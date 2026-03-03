from pydantic import BaseModel, validator, field_serializer
from typing import Optional, List
from app.models.shipment import ShipmentStatus
from datetime import datetime
from app.schemas.base import PaginatedResponse


class ShipmentBase(BaseModel):
    shipment_number: str
    bill_of_lading: Optional[str] = None
    vessel_id: int
    route_id: int
    contract_id: Optional[int] = None
    departure_date: datetime
    estimated_arrival: datetime
    actual_arrival: Optional[datetime] = None
    status: ShipmentStatus = ShipmentStatus.PLANNED
    total_containers: int = 0
    total_weight: float = 0.0
    special_instructions: Optional[str] = None
    
    @validator('shipment_number')
    def validate_shipment_number(cls, v):
        if len(v) < 5 or len(v) > 50:
            raise ValueError('Shipment number must be between 5 and 50 characters')
        return v.upper()
    
    @validator('total_containers')
    def validate_total_containers(cls, v):
        if v < 0:
            raise ValueError('Total containers cannot be negative')
        return v
    
    @validator('total_weight')
    def validate_total_weight(cls, v):
        if v < 0:
            raise ValueError('Total weight cannot be negative')
        return v
    
    @validator('estimated_arrival')
    def validate_estimated_arrival(cls, v, values):
        if 'departure_date' in values and v <= values['departure_date']:
            raise ValueError('Estimated arrival must be after departure date')
        return v
    
    @validator('actual_arrival')
    def validate_actual_arrival(cls, v, values):
        if v is not None and 'departure_date' in values and v <= values['departure_date']:
            raise ValueError('Actual arrival must be after departure date')
        return v


class ShipmentCreate(ShipmentBase):
    pass


class ShipmentUpdate(BaseModel):
    shipment_number: Optional[str] = None
    bill_of_lading: Optional[str] = None
    vessel_id: Optional[int] = None
    route_id: Optional[int] = None
    contract_id: Optional[int] = None
    departure_date: Optional[datetime] = None
    estimated_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    status: Optional[ShipmentStatus] = None
    total_containers: Optional[int] = None
    total_weight: Optional[float] = None
    special_instructions: Optional[str] = None


class ShipmentResponse(ShipmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True


class ShipmentPaginatedResponse(PaginatedResponse):
    items: List[ShipmentResponse]
