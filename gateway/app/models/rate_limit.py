from sqlalchemy import Column, String, Integer, DateTime, Index, Uuid
from datetime import datetime, timedelta
from .base import BaseModel
from app.core.security import hash_ip_address


class RateLimit(BaseModel):
    __tablename__ = "rate_limits"
    
    # Identification
    ip_address = Column(String(45), nullable=False, index=True)
    user_id = Column(Uuid(as_uuid=True), nullable=True, index=True)  # Nullable for anonymous requests
    
    # Rate limiting counters
    request_count = Column(Integer, default=0, nullable=False)
    window_start = Column(DateTime, nullable=False)
    window_size = Column(Integer, nullable=False)  # in seconds (60 for minute, 3600 for hour)
    
    # Status
    is_blocked = Column(String(20), default="active", nullable=False)  # active, blocked, warned
    block_expires = Column(DateTime)
    
    def set_ip_address(self, ip: str):
        """Hash IP address for privacy"""
        self.ip_address = hash_ip_address(ip)
    
    def is_window_expired(self) -> bool:
        """Check if the current time window has expired"""
        return datetime.utcnow() > (self.window_start + timedelta(seconds=self.window_size))
    
    def is_currently_blocked(self) -> bool:
        """Check if currently blocked"""
        return self.is_blocked == "blocked" and (
            self.block_expires is None or datetime.utcnow() < self.block_expires
        )
    
    def reset_window(self):
        """Reset the counting window"""
        self.window_start = datetime.utcnow()
        self.request_count = 0


# Add composite indexes for performance
__table_args__ = (
    Index('idx_rate_limit_ip_window', 'ip_address', 'window_start'),
    Index('idx_rate_limit_user_window', 'user_id', 'window_start'),
)
