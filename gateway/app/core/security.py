from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from app.core.config import settings
import redis
import json
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Ensure encryption key is 32 bytes for Fernet
encryption_key = settings.encryption_key.encode()[:32].ljust(32, b'0')
cipher_suite = Fernet(encryption_key)
redis_client = redis.Redis.from_url(settings.redis_url)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None


def is_token_blacklisted(token: str) -> bool:
    """Check if token is blacklisted in Redis"""
    try:
        return redis_client.exists(f"blacklist:{token}") > 0
    except:
        return False


def blacklist_token(token: str, expires_in: int = None):
    """Add token to blacklist in Redis"""
    try:
        if expires_in is None:
            # Extract expiration from token
            payload = verify_token(token)
            if payload:
                expires_in = int(payload.get("exp", 0) - datetime.utcnow().timestamp())
        
        if expires_in > 0:
            redis_client.setex(f"blacklist:{token}", expires_in, "1")
    except:
        pass


def encrypt_sensitive_data(data: str) -> str:
    """Encrypt sensitive data"""
    try:
        return cipher_suite.encrypt(data.encode()).decode()
    except:
        return data


def decrypt_sensitive_data(encrypted_data: str) -> str:
    """Decrypt sensitive data"""
    try:
        return cipher_suite.decrypt(encrypted_data.encode()).decode()
    except:
        return encrypted_data


def hash_ip_address(ip: str) -> str:
    """Hash IP address for privacy"""
    return hashlib.sha256(ip.encode()).hexdigest()[:16]
