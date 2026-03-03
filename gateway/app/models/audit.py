from sqlalchemy import Column, String, Integer, Float, ForeignKey, Text, DateTime, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import BaseModel
from app.core.security import hash_ip_address


class AuditLog(BaseModel):
    __tablename__ = "audit_logs"
    
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Nullable for unauthenticated requests
    ip_address = Column(String(45))  # Hashed for privacy
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    
    # Request/Response details
    status_code = Column(Integer, nullable=False)
    response_time = Column(Float)  # in milliseconds
    request_size = Column(Integer)  # in bytes
    response_size = Column(Integer)  # in bytes
    
    # Security events
    event_type = Column(String(50))  # login, logout, access, blocked, suspicious
    details = Column(Text)  # JSON string with additional details
    
    # User identification
    user_agent = Column(Text)
    device_fingerprint = Column(String(255))
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    def set_ip_address(self, ip: str):
        """Hash IP address for privacy"""
        self.ip_address = hash_ip_address(ip)
    
    def set_details(self, details_dict: dict):
        """Store details as JSON string"""
        import json
        self.details = json.dumps(details_dict) if details_dict else None
    
    def get_details(self) -> dict:
        """Get details as dictionary"""
        import json
        try:
            return json.loads(self.details) if self.details else {}
        except:
            return {}
