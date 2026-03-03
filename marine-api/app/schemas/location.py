from pydantic import BaseModel, validator, field_serializer
from typing import Optional
from datetime import datetime
from app.models.location import LocationType


class LocationBase(BaseModel):
    name: str
    location_code: str
    location_type: LocationType
    address: Optional[str] = None
    city: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    is_active: bool = True
    
    @validator('location_code')
    def validate_location_code(cls, v):
        if len(v) < 3 or len(v) > 20:
            raise ValueError('Location code must be between 3 and 20 characters')
        return v.upper()
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if v is not None and not -90 <= v <= 90:
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if v is not None and not -180 <= v <= 180:
            raise ValueError('Longitude must be between -180 and 180')
        return v
    
    

class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    location_code: Optional[str] = None
    location_type: Optional[LocationType] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    is_active: Optional[bool] = None


class LocationResponse(LocationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True
