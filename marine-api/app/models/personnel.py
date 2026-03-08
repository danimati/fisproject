from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class PersonnelRole(PyEnum):
    GLOBAL_ADMIN = "global_admin"
    LOCATION_MANAGER = "location_manager"
    LOGISTICS_OPERATOR = "logistics_operator"
    PORT_PERSONNEL = "port_personnel"
    ADMINISTRATIVE = "administrative"
    AUDITOR = "auditor"


class Personnel(BaseModel):
    __tablename__ = "personnel"
    
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    role = Column(Enum(PersonnelRole), nullable=False)
    employee_id = Column(String(20), unique=True, nullable=False, index=True)
    department = Column(String(50))
    location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"))
    responsibilities = Column(Text)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    location = relationship("Location", back_populates="personnel")
    events = relationship("Event", back_populates="responsible_person")
