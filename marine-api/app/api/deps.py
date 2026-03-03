from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_token


def get_current_user_id(token: str) -> Optional[int]:
    payload = verify_token(token)
    if payload is None:
        return None
    return payload.get("sub")


def get_current_user(token: str = Depends(None), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if token is None:
        raise credentials_exception
    
    user_id = get_current_user_id(token)
    if user_id is None:
        raise credentials_exception
    
    return user_id
