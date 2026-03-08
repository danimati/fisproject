from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class RolBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=50, description="Role name")
    descripcion: Optional[str] = Field(None, description="Role description")
    activo: Optional[bool] = Field(True, description="Whether the role is active")


class RolCreate(RolBase):
    pass


class RolUpdate(BaseModel):
    nombre: Optional[str] = Field(None, min_length=1, max_length=50, description="Role name")
    descripcion: Optional[str] = Field(None, description="Role description")
    activo: Optional[bool] = Field(None, description="Whether the role is active")


class RolResponse(RolBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RolWithUsers(RolResponse):
    users_count: Optional[int] = Field(None, description="Number of users with this role")
