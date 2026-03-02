from pydantic import BaseModel, validator, field_serializer
from typing import Optional
from datetime import datetime
from app.models.cargo import CargoType, CargoStatus


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
    client_id: int
    container_id: Optional[int] = None
    shipment_id: Optional[int] = None
    
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
    client_id: Optional[int] = None
    container_id: Optional[int] = None
    shipment_id: Optional[int] = None


class CargoResponse(CargoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True
