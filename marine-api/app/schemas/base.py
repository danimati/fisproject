from pydantic import BaseModel, ConfigDict, field_serializer
from datetime import datetime
from typing import Optional, List
from uuid import UUID


class TimestampedResponse(BaseModel):
    """Campos comunes de respuesta para entidades con UUID en BD."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime

    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int
    pages: int
