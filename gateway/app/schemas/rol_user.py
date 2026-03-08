from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class RolUserBase(BaseModel):
    user_id: UUID = Field(..., description="User ID")
    rol_id: UUID = Field(..., description="Role ID")
    is_active: Optional[bool] = Field(True, description="Whether the role assignment is active")


class RolUserCreate(RolUserBase):
    pass


class RolUserUpdate(BaseModel):
    user_id: Optional[UUID] = Field(None, description="User ID")
    rol_id: Optional[UUID] = Field(None, description="Role ID")
    is_active: Optional[bool] = Field(None, description="Whether the role assignment is active")


class RolUserResponse(RolUserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class RolUserWithDetails(RolUserResponse):
    user_username: Optional[str] = Field(None, description="Username of the user")
    rol_nombre: Optional[str] = Field(None, description="Name of the role")
