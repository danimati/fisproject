from sqlalchemy import Column, String, Integer, Float, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class ContractStatus(PyEnum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    TERMINATED = "terminated"
    SUSPENDED = "suspended"


class Contract(BaseModel):
    __tablename__ = "contracts"
    
    contract_number = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    contract_type = Column(String(50), nullable=False)
    total_value = Column(Float, nullable=False)  # USD
    currency = Column(String(3), default="USD")
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    terms_and_conditions = Column(Text)
    status = Column(Enum(ContractStatus), default=ContractStatus.DRAFT, nullable=False)
    
    # Relationships
    client = relationship("Client", back_populates="contracts")
    shipments = relationship("Shipment", back_populates="contract")
