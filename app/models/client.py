from sqlalchemy import Column, String, Enum, Text
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from .base import BaseModel


class ClientType(PyEnum):
    INDIVIDUAL = "individual"
    COMPANY = "company"


class Client(BaseModel):
    __tablename__ = "clients"
    
    name = Column(String(100), nullable=False, index=True)
    client_type = Column(Enum(ClientType), nullable=False)
    tax_id = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20))
    address = Column(Text)
    country = Column(String(50), nullable=False)
    contact_person = Column(String(100))
    is_active = Column(String(10), default="true", nullable=False)
    
    # Relationships
    cargo_items = relationship("Cargo", back_populates="client")
    contracts = relationship("Contract", back_populates="client")
