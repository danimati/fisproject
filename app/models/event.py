from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class EventType(PyEnum):
    BOOKING_CREATED = "booking_created"
    CONTAINER_LOADED = "container_loaded"
    CONTAINER_UNLOADED = "container_unloaded"
    VESSEL_DEPARTURE = "vessel_departure"
    VESSEL_ARRIVAL = "vessel_arrival"
    INSPECTION = "inspection"
    DAMAGE_REPORTED = "damage_reported"
    CUSTOMS_CLEARANCE = "customs_clearance"
    DELAY_REPORTED = "delay_reported"
    STATUS_CHANGE = "status_change"


class Event(BaseModel):
    __tablename__ = "events"
    
    event_type = Column(Enum(EventType), nullable=False)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    container_id = Column(Integer, ForeignKey("containers.id"))
    personnel_id = Column(Integer, ForeignKey("personnel.id"))
    event_date = Column(DateTime, nullable=False)
    location = Column(String(200))
    description = Column(Text, nullable=False)
    observations = Column(Text)
    
    # Relationships
    shipment = relationship("Shipment", back_populates="events")
    container = relationship("Container")
    responsible_person = relationship("Personnel", back_populates="events")
