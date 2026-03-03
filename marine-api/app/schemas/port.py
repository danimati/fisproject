from pydantic import BaseModel, validator, field_serializer
from typing import Optional, List
from datetime import datetime
from app.models.port import PortType
from app.schemas.base import PaginatedResponse


class PortBase(BaseModel):
    name: str
    code: str
    country: str
    city: str
    latitude: float
    longitude: float
    port_type: PortType
    max_vessel_draft: Optional[float] = None
    container_terminals: int = 1
    is_active: bool = True
    
    @validator('code')
    def validate_code(cls, v):
        if len(v) != 5:
            raise ValueError('Port code must be 5 characters (UN/LOCODE format)')
        return v.upper()
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v
    
    @validator('container_terminals')
    def validate_container_terminals(cls, v):
        if v < 1:
            raise ValueError('Container terminals must be at least 1')
        return v
    
    @validator('is_active')
    def validate_is_active(cls, v):
        if not isinstance(v, bool):
            raise ValueError('is_active must be a boolean')
        return v


class PortCreate(PortBase):
    pass


class PortUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    port_type: Optional[PortType] = None
    max_vessel_draft: Optional[float] = None
    container_terminals: Optional[int] = None
    is_active: Optional[bool] = None


class PortResponse(PortBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True


class PortPaginatedResponse(PaginatedResponse):
    items: List[PortResponse]
