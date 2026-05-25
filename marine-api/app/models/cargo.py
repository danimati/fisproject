from sqlalchemy import Column, String, Integer, Float, Boolean, Enum, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class CargoType(PyEnum):
    GENERAL = "GENERAL"
    PERISHABLE = "PERISHABLE"
    DANGEROUS = "DANGEROUS"
    FRAGILE = "FRAGILE"
    LIQUID = "LIQUID"
    BULK = "BULK"


class CargoStatus(PyEnum):
    PENDING = "PENDING"
    LOADED = "LOADED"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    DAMAGED = "DAMAGED"
    LOST = "LOST"


class Cargo(BaseModel):
    __tablename__ = "cargo"
    
    tracking_number = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    cargo_type = Column(Enum(CargoType), nullable=False)
    weight = Column(Float, nullable=False)  # kg
    volume = Column(Float, nullable=False)  # cubic meters
    is_fragile = Column(Boolean, default=False)
    is_dangerous = Column(Boolean, default=False)
    temperature_required = Column(Float)  # Celsius
    packaging_type = Column(String(50))
    value = Column(Float)  # USD
    status = Column(Enum(CargoStatus), default=CargoStatus.PENDING, nullable=False)
    
    # Foreign Keys
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    container_id = Column(UUID(as_uuid=True), ForeignKey("containers.id"))
    shipment_id = Column(UUID(as_uuid=True), ForeignKey("shipments.id"))
    
    # Relationships
    client = relationship("Client", back_populates="cargo_items")
    container = relationship("Container", back_populates="cargo_items")
    shipment = relationship("Shipment", back_populates="cargo_items")
