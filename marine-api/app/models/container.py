from sqlalchemy import Column, String, Integer, Float, Enum, ForeignKey
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class ContainerType(PyEnum):
    DRY_20 = "dry_20"
    DRY_40 = "dry_40"
    REEFER_20 = "reefer_20"
    REEFER_40 = "reefer_40"
    OPEN_TOP = "open_top"
    FLAT_RACK = "flat_rack"
    TANK = "tank"


class ContainerStatus(PyEnum):
    EMPTY = "empty"
    LOADED = "loaded"
    IN_TRANSIT = "in_transit"
    AT_PORT = "at_port"
    DELIVERED = "delivered"
    DAMAGED = "damaged"
    MAINTENANCE = "maintenance"


class Container(BaseModel):
    __tablename__ = "containers"
    
    container_number = Column(String(11), unique=True, nullable=False, index=True)
    container_type = Column(Enum(ContainerType), nullable=False)
    max_weight = Column(Float, nullable=False)  # kg
    max_volume = Column(Float, nullable=False)  # cubic meters
    current_weight = Column(Float, default=0.0)
    current_volume = Column(Float, default=0.0)
    status = Column(Enum(ContainerStatus), default=ContainerStatus.EMPTY, nullable=False)
    current_location_id = Column(Integer, ForeignKey("locations.id"))
    
    # Relationships
    current_location = relationship("Location", back_populates="containers")
    cargo_items = relationship("Cargo", back_populates="container")
