from sqlalchemy import Column, String, Text, Enum, Float, Boolean
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class LocationType(PyEnum):
    PORT = "port"
    WAREHOUSE = "warehouse"
    DEPOT = "depot"
    YARD = "yard"
    OFFICE = "office"


class Location(BaseModel):
    __tablename__ = "locations"
    
    name = Column(String(100), nullable=False, index=True)
    location_code = Column(String(20), unique=True, nullable=False, index=True)
    location_type = Column(Enum(LocationType), nullable=False)
    address = Column(Text)
    city = Column(String(100), nullable=False)
    country = Column(String(50), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    contact_phone = Column(String(20))
    contact_email = Column(String(100))
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    personnel = relationship("Personnel", back_populates="location")
    containers = relationship("Container", back_populates="current_location")
