from pydantic import BaseModel, validator, field_serializer
from typing import Optional, List
from datetime import datetime
from app.models.personnel import PersonnelRole
import re
from app.schemas.base import PaginatedResponse


class PersonnelBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    role: PersonnelRole
    employee_id: str
    department: Optional[str] = None
    location_id: Optional[int] = None
    responsibilities: Optional[str] = None
    is_active: bool = True
    
    @validator('email')
    def validate_email(cls, v):
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()
    
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if len(v) < 3 or len(v) > 20:
            raise ValueError('Employee ID must be between 3 and 20 characters')
        return v.upper()
    
    @validator('is_active')
    def validate_is_active(cls, v):
        if not isinstance(v, bool):
            raise ValueError('is_active must be a boolean')
        return v


class PersonnelCreate(PersonnelBase):
    pass


class PersonnelUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[PersonnelRole] = None
    employee_id: Optional[str] = None
    department: Optional[str] = None
    location_id: Optional[int] = None
    responsibilities: Optional[str] = None
    is_active: Optional[bool] = None


class PersonnelResponse(PersonnelBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True


class PersonnelPaginatedResponse(PaginatedResponse):
    items: List[PersonnelResponse]
