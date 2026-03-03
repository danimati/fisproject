from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import APIRouter,Depends, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
import httpx
import time
from typing import Dict, Any
from urllib.parse import urljoin
from app.core.database import get_db

from app.core.config import settings
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from app.models.user import User
import logging



logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["proxy"])
security = HTTPBearer()

class ProxyService:
    def __init__(self):
        self.backend_url = settings.backend_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def proxy_request(self, request: Request, path: str) -> Response:
        """Proxy request to backend API"""
        start_time = time.time()
        
        # Construct backend URL
        backend_url = urljoin(self.backend_url, f"/api/v1/{path}")
        
        # Prepare headers
        headers = dict(request.headers)
        # Remove hop-by-hop headers
        headers.pop("host", None)
        headers.pop("connection", None)
        headers.pop("content-length", None)
        
        # Add authentication if user is logged in
        if hasattr(request.state, 'user_id'):
            # Forward the original token to backend
            auth_header = request.headers.get("Authorization")
            if auth_header:
                headers["Authorization"] = auth_header
        
        try:
            # Make request to backend
            if request.method in ["GET", "DELETE"]:
                response = await self.client.request(
                    method=request.method,
                    url=backend_url,
                    headers=headers,
                    params=request.query_params
                )
            else:
                # For POST, PUT, PATCH requests
                body = await request.body()
                response = await self.client.request(
                    method=request.method,
                    url=backend_url,
                    headers=headers,
                    params=request.query_params,
                    content=body
                )
            
            # Process response
            process_time = time.time() - start_time
            
            # Create response
            proxy_response = Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
            # Add timing header
            proxy_response.headers["X-Gateway-Process-Time"] = str(process_time)
            proxy_response.headers["X-Backend-Response-Time"] = str(response.elapsed.total_seconds())
            
            return proxy_response
            
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Backend service timeout"
            )
        except httpx.ConnectError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Backend service unavailable"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Proxy error: {str(e)}"
            )


# Create proxy service instance
proxy_service = ProxyService()


# Dynamic route handlers for all backend endpoints
@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_to_backend(request: Request,
                           path: str,
                           credentials: HTTPAuthorizationCredentials = Depends(security),
                           db: Session = Depends(get_db)):
    """Proxy all requests to backend API"""
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing user ID"
        )
    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: malformed user ID"
        )
    user = db.query(User).filter(User.id == user_uuid).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if user.is_admin:
        logger.info(f"Admin user {user.username} accessing {path}")
        return await proxy_service.proxy_request(request, path)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied"
    )

@router.get("/health")
async def health_check():
    """Gateway health check"""
    try:
        # Check backend health
        async with httpx.AsyncClient() as client:
            backend_response = await client.get(f"{settings.backend_url}/health", timeout=5.0)
            backend_healthy = backend_response.status_code == 200
    except:
        backend_healthy = False
    
    return {
        "status": "healthy",
        "gateway": "running",
        "backend": "healthy" if backend_healthy else "unhealthy",
        "timestamp": time.time()
    }


