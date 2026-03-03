

from sqlalchemy import Column, ForeignKey, Uuid, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class UserPermit(BaseModel):
    __tablename__ = "user_permits"
    
    user_id = Column(Uuid, ForeignKey("users.id"))
    permit_id = Column(Uuid, ForeignKey("permissions.id"))
    is_active = Column(Boolean, default=True)
    
    permit = relationship("Permission", back_populates="users")
    user = relationship("User", back_populates="permissions")
