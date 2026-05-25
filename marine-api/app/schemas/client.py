from pydantic import BaseModel, field_validator
from typing import Optional, Any
from app.models.client import ClientType
from app.schemas.base import TimestampedResponse
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
    
    @field_validator('client_type', mode='before')
    @classmethod
    def coerce_client_type(cls, v: Any) -> Any:
        if isinstance(v, str):
            normalized = v.strip().upper()
            if normalized in ClientType.__members__:
                return ClientType[normalized]
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v.lower()

    @field_validator('is_active', mode='before')
    @classmethod
    def validate_is_active(cls, v: Any) -> str:
        if isinstance(v, bool):
            return 'true' if v else 'false'
        if isinstance(v, str):
            normalized = v.strip().lower()
            if normalized in ('true', '1', 'yes', 'si', 'sí', 'active', 'enabled'):
                return 'true'
            if normalized in (
                'false', '0', 'no', 'inactive', 'disabled',
                'maintenance', 'decommissioned', 'in_dock',
            ):
                return 'false'
        raise ValueError('is_active must be "true" or "false"')


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

    @field_validator('is_active', mode='before')
    @classmethod
    def validate_is_active(cls, v: Any) -> Optional[str]:
        if v is None:
            return None
        return ClientBase.validate_is_active(v)


class ClientResponse(ClientBase, TimestampedResponse):
    pass
