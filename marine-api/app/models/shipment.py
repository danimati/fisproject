from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class ShipmentStatus(PyEnum):
    PLANNED = "planned"
    BOOKED = "booked"
    LOADING = "loading"
    IN_TRANSIT = "in_transit"
    AT_PORT = "at_port"
    UNLOADING = "unloading"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DELAYED = "delayed"


class Shipment(BaseModel):
    __tablename__ = "shipments"
    
    shipment_number = Column(String(50), unique=True, nullable=False, index=True)
    bill_of_lading = Column(String(50), unique=True, index=True)
    vessel_id = Column(UUID(as_uuid=True), ForeignKey("vessels.id"), nullable=False)
    route_id = Column(UUID(as_uuid=True), ForeignKey("routes.id"), nullable=False)
    contract_id = Column(UUID(as_uuid=True), ForeignKey("contracts.id"))
    departure_date = Column(DateTime, nullable=False)
    estimated_arrival = Column(DateTime, nullable=False)
    actual_arrival = Column(DateTime)
    status = Column(Enum(ShipmentStatus), default=ShipmentStatus.PLANNED, nullable=False)
    total_containers = Column(Integer, default=0)
    total_weight = Column(Float, default=0.0)  # tons
    special_instructions = Column(Text)
    
    # Relationships
    vessel = relationship("Vessel", back_populates="shipments")
    route = relationship("Route", back_populates="shipments")
    contract = relationship("Contract", back_populates="shipments")
    cargo_items = relationship("Cargo", back_populates="shipment")
    events = relationship("Event", back_populates="shipment")
