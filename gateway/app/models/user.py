from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.orm import relationship
from .base import BaseModel
from app.core.security import encrypt_sensitive_data, decrypt_sensitive_data


class User(BaseModel):
    __tablename__ = "users"
    
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    
    # Encrypted sensitive fields
    full_name = Column(Text)  # Encrypted
    phone = Column(Text)       # Encrypted
    address = Column(Text)     # Encrypted
    
    # Relationships
    sessions = relationship("UserSession", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")
    roles = relationship("RolUser", back_populates="user")
    permissions = relationship("UserPermit", back_populates="user")
    
    def set_full_name(self, name: str):
        self.full_name = encrypt_sensitive_data(name) if name else None
    
    def get_full_name(self) -> str:
        return decrypt_sensitive_data(self.full_name) if self.full_name else None
    
    def set_phone(self, phone: str):
        self.phone = encrypt_sensitive_data(phone) if phone else None
    
    def get_phone(self) -> str:
        return decrypt_sensitive_data(self.phone) if self.phone else None
    
    def set_address(self, address: str):
        self.address = encrypt_sensitive_data(address) if address else None
    
    def get_address(self) -> str:
        return decrypt_sensitive_data(self.address) if self.address else None
