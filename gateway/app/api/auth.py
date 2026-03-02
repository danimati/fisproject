from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    verify_password, get_password_hash, create_access_token, 
    create_refresh_token, verify_token, blacklist_token
)
from app.core.config import settings
from app.models.user import User
from app.models.session import UserSession
from app.schemas.user import UserCreate, UserResponse, UserLogin, TokenResponse
from app.schemas.auth import RefreshTokenRequest

router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        if existing_user.username == user_data.username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed_password
    )
    
    # Set encrypted fields
    if user_data.full_name:
        user.set_full_name(user_data.full_name)
    if user_data.phone:
        user.set_phone(user_data.phone)
    if user_data.address:
        user.set_address(user_data.address)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Authenticate user and return tokens"""
    # Find user by username
    user = db.query(User).filter(User.username == user_credentials.username).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is inactive"
        )
    
    # Create tokens
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username, "is_admin": user.is_admin}
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "username": user.username}
    )
    
    # Create session record
    session = UserSession(
        user_id=user.id,
        token_hash=access_token[:50],  # Store partial hash for identification
        expires_at=timedelta(minutes=settings.access_token_expire_minutes),
        ip_address=request.client.host,
        user_agent=request.headers.get("User-Agent")
    )
    session.set_ip_address(request.client.host)
    
    db.add(session)
    db.commit()
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    # Verify refresh token
    payload = verify_token(refresh_data.refresh_token)
    
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new access token
    access_token = create_access_token(
        data={"sub": str(user.id), "username": user.username, "is_admin": user.is_admin}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_data.refresh_token,  # Keep same refresh token
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security), 
                db: Session = Depends(get_db)):
    """Logout user and blacklist token"""
    token = credentials.credentials
    
    # Blacklist the token
    blacklist_token(token)
    
    # Deactivate user sessions
    payload = verify_token(token)
    if payload:
        user_id = payload.get("sub")
        db.query(UserSession).filter(
            UserSession.user_id == user_id,
            UserSession.is_active == "active"
        ).update({"is_active": "revoked"})
        db.commit()
    
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security),
                          db: Session = Depends(get_db)):
    """Get current user information"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
