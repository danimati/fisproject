from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import redis
import json
import time

from app.core.database import SessionLocal
from app.core.config import settings
from app.models.rate_limit import RateLimit
from app.models.audit import AuditLog
from app.core.security import hash_ip_address


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis_client = redis.Redis.from_url(settings.redis_url)
    
    async def dispatch(self, request: Request, call_next):
        client_ip = self.get_client_ip(request)
        hashed_ip = hash_ip_address(client_ip)
        
        # Skip rate limiting for health checks and auth endpoints
        if self.should_skip_rate_limit(request):
            return await call_next(request)
        
        # Check Redis first for performance
        if not await self.check_redis_rate_limit(client_ip, hashed_ip):
            await self.log_blocked_request(request, client_ip, "rate_limit_exceeded")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        # Process request
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Update rate limit counters
        await self.update_rate_limit_counters(client_ip, hashed_ip, request, response, process_time)
        
        return response
    
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address from request"""
        # Check for forwarded headers first
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"
    
    def should_skip_rate_limit(self, request: Request) -> bool:
        """Check if request should skip rate limiting"""
        skip_paths = ["/health", "/docs", "/redoc", "/openapi.json", "/auth/login", "/auth/register", "/auth/refresh"]
        return any(request.url.path.startswith(path) for path in skip_paths)
    
    async def check_redis_rate_limit(self, client_ip: str, hashed_ip: str) -> bool:
        """Check rate limits using Redis for high performance"""
        try:
            current_time = int(time.time())
            
            # Check per-minute limit
            minute_key = f"rate_limit:minute:{hashed_ip}:{current_time // 60}"
            minute_count = self.redis_client.incr(minute_key)
            if minute_count == 1:
                self.redis_client.expire(minute_key, 60)
            
            if minute_count > settings.rate_limit_per_minute:
                return False
            
            # Check per-hour limit
            hour_key = f"rate_limit:hour:{hashed_ip}:{current_time // 3600}"
            hour_count = self.redis_client.incr(hour_key)
            if hour_count == 1:
                self.redis_client.expire(hour_key, 3600)
            
            if hour_count > settings.rate_limit_per_hour:
                return False
            
            # Check DoS threshold
            if minute_count > settings.dos_threshold:
                # Block for 1 hour
                block_key = f"dos_block:{hashed_ip}"
                self.redis_client.setex(block_key, 3600, "1")
                return False
            
            # Check if currently blocked
            block_key = f"dos_block:{hashed_ip}"
            if self.redis_client.exists(block_key):
                return False
            
            return True
            
        except Exception as e:
            # If Redis fails, allow request but log error
            print(f"Rate limit error: {e}")
            return True
    
    async def update_rate_limit_counters(self, client_ip: str, hashed_ip: str, 
                                       request: Request, response: Response, process_time: float):
        """Update rate limit counters in database"""
        try:
            db = SessionLocal()
            
            # Update or create rate limit record
            rate_limit = db.query(RateLimit).filter(
                RateLimit.ip_address == hashed_ip,
                RateLimit.window_start >= datetime.utcnow() - timedelta(seconds=60)
            ).first()
            
            if not rate_limit:
                rate_limit = RateLimit(
                    ip_address=hashed_ip,
                    window_start=datetime.utcnow(),
                    window_size=60,
                    request_count=1
                )
                db.add(rate_limit)
            else:
                rate_limit.request_count += 1
            
            db.commit()
            
        except Exception as e:
            print(f"Database rate limit error: {e}")
        finally:
            db.close()
    
    async def log_blocked_request(self, request: Request, client_ip: str, reason: str):
        """Log blocked requests for security monitoring"""
        try:
            db = SessionLocal()
            
            audit_log = AuditLog(
                ip_address=client_ip,
                endpoint=str(request.url.path),
                method=request.method,
                status_code=429,
                event_type="blocked",
                details={"reason": reason, "user_agent": request.headers.get("User-Agent")}
            )
            audit_log.set_ip_address(client_ip)
            
            db.add(audit_log)
            db.commit()
            
        except Exception as e:
            print(f"Audit log error: {e}")
        finally:
            db.close()
