from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from app.core.config import settings
from app.core.database import engine, Base
from app.api.auth import router as auth_router
from app.api.proxy import router as proxy_router
from app.api.admin import router as admin_router
from app.api.crud import router as crud_router
from app.middleware.auth import AuthenticationMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware
from app.middleware.security import SecurityHeadersMiddleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Maritime Gateway API")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Gateway database tables created/verified")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Maritime Gateway API")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A secure gateway for the Maritime Trade Management System with authentication, rate limiting, and monitoring.",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add middleware in order
# 1. CORS first (to handle preflight requests before authentication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# 2. Security headers
app.add_middleware(SecurityHeadersMiddleware)

# 3. Rate limiting
app.add_middleware(RateLimitMiddleware)

# 4. Authentication
app.add_middleware(AuthenticationMiddleware)

# 5. Logging
app.add_middleware(LoggingMiddleware)


# Add timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "type": type(exc).__name__
        }
    )


# Include API routes
app.include_router(auth_router)
app.include_router(proxy_router)
app.include_router(admin_router)
app.include_router(crud_router)


@app.get("/")
async def root():
    return {
        "message": "Maritime Gateway API",
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs" if settings.debug else "Documentation disabled in production",
        "endpoints": {
            "auth": "/auth",
            "proxy": "/api/v1",
            "admin": "/admin",
            "crud": "/crud",
            "health": "/api/v1/health"
        }
    }


@app.get("/health")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "service": "gateway",
        "version": settings.app_version,
        "timestamp": time.time()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8080,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
