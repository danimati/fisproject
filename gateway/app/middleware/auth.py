from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import time

from app.core.config import settings
from app.core.security import verify_token, is_token_blacklisted


class AuthenticationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next):
        # Skip authentication for certain paths
        if self.should_skip_auth(request):
            return await call_next(request)
        
        # Extract token from Authorization header
        token = self.extract_token(request)
        
        if token:
            # Validate token
            payload = verify_token(token)
            if payload and not is_token_blacklisted(token):
                # Add user info to request state
                request.state.user_id = payload.get("sub")
                request.state.username = payload.get("username")
                request.state.is_admin = payload.get("is_admin", False)
        
        # Process request
        response = await call_next(request)
        return response
    
    def should_skip_auth(self, request: Request) -> bool:
        """Check if request should skip authentication"""
        skip_paths = [
            "/health",
            "/docs", 
            "/redoc",
            "/openapi.json",
            "/auth/login",
            "/auth/register",
            "/auth/refresh"
        ]
        return any(request.url.path.startswith(path) for path in skip_paths)
    
    def extract_token(self, request: Request) -> str:
        """Extract JWT token from Authorization header"""
        authorization = request.headers.get("Authorization")
        if authorization and authorization.startswith("Bearer "):
            return authorization.split(" ")[1]
        return None
