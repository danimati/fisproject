from pydantic import BaseModel, validator, field_serializer
from typing import Optional
from datetime import datetime
from app.models.container import ContainerType, ContainerStatus


class ContainerBase(BaseModel):
    container_number: str
    container_type: ContainerType
    max_weight: float
    max_volume: float
    current_weight: float = 0.0
    current_volume: float = 0.0
    status: ContainerStatus = ContainerStatus.EMPTY
    current_location_id: Optional[int] = None
    
    @validator('container_number')
    def validate_container_number(cls, v):
        if len(v) != 11:
            raise ValueError('Container number must be 11 characters')
        return v.upper()
    
    @validator('current_weight')
    def validate_current_weight(cls, v, values):
        if 'max_weight' in values and v > values['max_weight']:
            raise ValueError('Current weight cannot exceed max weight')
        return v
    
    @validator('current_volume')
    def validate_current_volume(cls, v, values):
        if 'max_volume' in values and v > values['max_volume']:
            raise ValueError('Current volume cannot exceed max volume')
        return v


class ContainerCreate(ContainerBase):
    pass


class ContainerUpdate(BaseModel):
    container_type: Optional[ContainerType] = None
    max_weight: Optional[float] = None
    max_volume: Optional[float] = None
    current_weight: Optional[float] = None
    current_volume: Optional[float] = None
    status: Optional[ContainerStatus] = None
    current_location_id: Optional[int] = None


class ContainerResponse(ContainerBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True
