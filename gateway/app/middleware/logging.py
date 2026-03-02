from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from sqlalchemy.orm import Session
import time
import json
import logging

from app.core.database import SessionLocal
from app.models.audit import AuditLog
from app.models.user import User
from app.core.security import hash_ip_address


logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_ip = self.get_client_ip(request)
        
        # Process request
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log request asynchronously (don't block response)
        await self.log_request(request, response, client_ip, process_time)
        
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address from request"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    async def log_request(self, request: Request, response: Response, 
                         client_ip: str, process_time: float):
        """Log request details to database"""
        try:
            db = SessionLocal()
            
            # Determine event type
            event_type = self.determine_event_type(request, response)
            
            # Get user ID if available
            user_id = getattr(request.state, 'user_id', None)
            
            # Create audit log entry
            audit_log = AuditLog(
                user_id=user_id,
                endpoint=str(request.url.path),
                method=request.method,
                status_code=response.status_code,
                response_time=process_time * 1000,  # Convert to milliseconds
                user_agent=request.headers.get("User-Agent"),
                event_type=event_type
            )
            
            # Set IP address (hashed for privacy)
            audit_log.set_ip_address(client_ip)
            
            # Add additional details
            details = {
                "query_params": dict(request.query_params),
                "path_params": dict(request.path_params),
                "response_headers": dict(response.headers),
                "process_time_ms": round(process_time * 1000, 2)
            }
            
            # Add user info if available
            if hasattr(request.state, 'username'):
                details["username"] = request.state.username
            
            audit_log.set_details(details)
            
            db.add(audit_log)
            db.commit()
            
        except Exception as e:
            logger.error(f"Failed to log request: {e}")
        finally:
            db.close()
    
    def determine_event_type(self, request: Request, response: Response) -> str:
        """Determine the type of event for logging"""
        path = request.url.path
        
        if path.startswith("/auth/"):
            if "login" in path:
                return "login" if response.status_code == 200 else "login_failed"
            elif "logout" in path:
                return "logout"
            elif "register" in path:
                return "register"
            else:
                return "auth"
        
        if response.status_code >= 400:
            if response.status_code == 429:
                return "blocked"
            elif response.status_code >= 500:
                return "error"
            else:
                return "access_denied"
        
        if response.status_code == 200:
            return "access"
        
        return "unknown"
