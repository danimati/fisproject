import uuid

from sqlalchemy import Boolean, Column, String, Text, Uuid
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Rol(BaseModel):
    __tablename__ = "roles"

    nombre = Column(String(50), unique=True, nullable=False, index=True)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True, nullable=False)
    
    users = relationship("RolUser", back_populates="rol")

