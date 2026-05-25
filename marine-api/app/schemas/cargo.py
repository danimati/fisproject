from pydantic import BaseModel, validator, field_serializer
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.cargo import CargoType, CargoStatus
from app.schemas.base import TimestampedResponse


class CargoBase(BaseModel):
    tracking_number: str
    description: str
    cargo_type: CargoType
    weight: float
    volume: float
    is_fragile: bool = False
    is_dangerous: bool = False
    temperature_required: Optional[float] = None
    packaging_type: Optional[str] = None
    value: Optional[float] = None
    status: CargoStatus = CargoStatus.PENDING
    client_id: UUID
    container_id: Optional[UUID] = None
    shipment_id: Optional[UUID] = None
    
    @validator('weight')
    def validate_weight(cls, v):
        if v <= 0:
            raise ValueError('Weight must be positive')
        return v
    
    @validator('volume')
    def validate_volume(cls, v):
        if v <= 0:
            raise ValueError('Volume must be positive')
        return v
    
    @validator('value')
    def validate_value(cls, v):
        if v is not None and v < 0:
            raise ValueError('Value cannot be negative')
        return v


class CargoCreate(CargoBase):
    pass


class CargoUpdate(BaseModel):
    description: Optional[str] = None
    cargo_type: Optional[CargoType] = None
    weight: Optional[float] = None
    volume: Optional[float] = None
    is_fragile: Optional[bool] = None
    is_dangerous: Optional[bool] = None
    temperature_required: Optional[float] = None
    packaging_type: Optional[str] = None
    value: Optional[float] = None
    status: Optional[CargoStatus] = None
    client_id: Optional[UUID] = None
    container_id: Optional[UUID] = None
    shipment_id: Optional[UUID] = None


class CargoResponse(CargoBase, TimestampedResponse):
    pass
