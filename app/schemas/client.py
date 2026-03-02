from pydantic import BaseModel, validator, field_serializer
from typing import Optional
from datetime import datetime
from app.models.client import ClientType
import re


class ClientBase(BaseModel):
    name: str
    client_type: ClientType
    tax_id: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    country: str
    contact_person: Optional[str] = None
    is_active: str = "true"
    
    @validator('email')
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('is_active')
    def validate_is_active(cls, v):
        if v not in ["true", "false"]:
            raise ValueError('is_active must be "true" or "false"')
        return v


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    client_type: Optional[ClientType] = None
    tax_id: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    contact_person: Optional[str] = None
    is_active: Optional[str] = None


class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True
