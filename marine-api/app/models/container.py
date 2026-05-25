from sqlalchemy import Column, String, Integer, Float, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class ContainerType(PyEnum):
    DRY_20 = "DRY_20"
    DRY_40 = "DRY_40"
    REEFER_20 = "REEFER_20"
    REEFER_40 = "REEFER_40"
    OPEN_TOP = "OPEN_TOP"
    FLAT_RACK = "FLAT_RACK"
    TANK = "TANK"


class ContainerStatus(PyEnum):
    EMPTY = "EMPTY"
    LOADED = "LOADED"
    IN_TRANSIT = "IN_TRANSIT"
    AT_PORT = "AT_PORT"
    DELIVERED = "DELIVERED"
    DAMAGED = "DAMAGED"
    MAINTENANCE = "MAINTENANCE"


class Container(BaseModel):
    __tablename__ = "containers"
    
    container_number = Column(String(11), unique=True, nullable=False, index=True)
    container_type = Column(Enum(ContainerType), nullable=False)
    max_weight = Column(Float, nullable=False)  # kg
    max_volume = Column(Float, nullable=False)  # cubic meters
    current_weight = Column(Float, default=0.0)
    current_volume = Column(Float, default=0.0)
    status = Column(Enum(ContainerStatus), default=ContainerStatus.EMPTY, nullable=False)
    current_location_id = Column(UUID(as_uuid=True), ForeignKey("locations.id"))
    
    # Relationships
    current_location = relationship("Location", back_populates="containers")
    cargo_items = relationship("Cargo", back_populates="container")
