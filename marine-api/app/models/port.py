from sqlalchemy import Column, String, Integer, Float, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class PortType(PyEnum):
    SEA = "sea"
    RIVER = "river"
    LAKE = "lake"


class Port(BaseModel):
    __tablename__ = "ports"
    
    name = Column(String(100), nullable=False, index=True)
    code = Column(String(5), unique=True, nullable=False, index=True)  # UN/LOCODE
    country = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    port_type = Column(Enum(PortType), nullable=False)
    max_vessel_draft = Column(Float)  # meters
    container_terminals = Column(Integer, default=1)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    departure_routes = relationship("Route", foreign_keys="Route.departure_port_id", back_populates="departure_port")
    arrival_routes = relationship("Route", foreign_keys="Route.arrival_port_id", back_populates="arrival_port")
