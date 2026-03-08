from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class RouteStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SEASONAL = "seasonal"


class Route(BaseModel):
    __tablename__ = "routes"
    
    name = Column(String(100), nullable=False, index=True)
    route_code = Column(String(20), unique=True, nullable=False, index=True)
    departure_port_id = Column(UUID(as_uuid=True), ForeignKey("ports.id"), nullable=False)
    arrival_port_id = Column(UUID(as_uuid=True), ForeignKey("ports.id"), nullable=False)
    distance = Column(Float, nullable=False)  # nautical miles
    estimated_duration = Column(Integer, nullable=False)  # hours
    status = Column(Enum(RouteStatus), default=RouteStatus.ACTIVE, nullable=False)
    
    # Relationships
    departure_port = relationship("Port", foreign_keys=[departure_port_id], back_populates="departure_routes")
    arrival_port = relationship("Port", foreign_keys=[arrival_port_id], back_populates="arrival_routes")
    shipments = relationship("Shipment", back_populates="route")
