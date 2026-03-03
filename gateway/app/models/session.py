from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import BaseModel
from app.core.security import hash_ip_address


class UserSession(BaseModel):
    __tablename__ = "user_sessions"
    
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(255), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    
    # Session metadata
    ip_address = Column(String(45))  # IPv6 compatible
    user_agent = Column(Text)
    device_fingerprint = Column(String(255))
    
    # Status
    is_active = Column(String(20), default="active", nullable=False)  # active, expired, revoked
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    
    def set_ip_address(self, ip: str):
        """Hash IP address for privacy"""
        self.ip_address = hash_ip_address(ip)
    
    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at
    
    def is_valid(self) -> bool:
        return self.is_active == "active" and not self.is_expired()
