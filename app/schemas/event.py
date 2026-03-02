from pydantic import BaseModel, validator, field_serializer
from typing import Optional, List
from app.models.event import EventType
from datetime import datetime
from app.schemas.base import PaginatedResponse


class EventBase(BaseModel):
    event_type: EventType
    shipment_id: int
    container_id: Optional[int] = None
    personnel_id: Optional[int] = None
    event_date: datetime
    location: Optional[str] = None
    description: str
    observations: Optional[str] = None
    
    @validator('description')
    def validate_description(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Description cannot be empty')
        return v.strip()


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    event_type: Optional[EventType] = None
    shipment_id: Optional[int] = None
    container_id: Optional[int] = None
    personnel_id: Optional[int] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    observations: Optional[str] = None


class EventResponse(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True


class EventPaginatedResponse(PaginatedResponse):
    items: List[EventResponse]
