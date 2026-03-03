from sqlalchemy import Column, String, Integer, Float, Boolean, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class CargoType(PyEnum):
    GENERAL = "general"
    PERISHABLE = "perishable"
    DANGEROUS = "dangerous"
    FRAGILE = "fragile"
    LIQUID = "liquid"
    BULK = "bulk"


class CargoStatus(PyEnum):
    PENDING = "pending"
    LOADED = "loaded"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    DAMAGED = "damaged"
    LOST = "lost"


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
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    container_id = Column(Integer, ForeignKey("containers.id"))
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    
    # Relationships
    client = relationship("Client", back_populates="cargo_items")
    container = relationship("Container", back_populates="cargo_items")
    shipment = relationship("Shipment", back_populates="cargo_items")
