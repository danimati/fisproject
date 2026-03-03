
from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey, Uuid, Boolean

from app.models.base import BaseModel

class RolUser(BaseModel):

    __tablename__ = "rol_user"

    user_id = Column(Uuid, ForeignKey("users.id"))
    rol_id = Column(Uuid, ForeignKey("roles.id"))
    is_active = Column(Boolean, default=True)
    
    rol = relationship("Rol", back_populates="users")
    user = relationship("User", back_populates="roles")