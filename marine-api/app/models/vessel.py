from sqlalchemy import Column, String, Integer, Float, Enum
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class VesselStatus(PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    DECOMMISSIONED = "decommissioned"


class Vessel(BaseModel):
    __tablename__ = "vessels"
    
    name = Column(String(100), nullable=False, index=True)
    imo_number = Column(String(10), unique=True, nullable=False, index=True)
    flag_country = Column(String(50), nullable=False)
    vessel_type = Column(String(50), nullable=False)
    deadweight_tonnage = Column(Integer, nullable=False)
    gross_tonnage = Column(Integer, nullable=False)
    length_overall = Column(Float)  # meters
    beam = Column(Float)  # meters
    draft = Column(Float)  # meters
    max_containers = Column(Integer)
    max_cargo_weight = Column(Float)  # tons
    status = Column(Enum(VesselStatus), default=VesselStatus.ACTIVE, nullable=False)
    
    # Relationships
    shipments = relationship("Shipment", back_populates="vessel")
