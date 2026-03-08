from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserPermitBase(BaseModel):
    user_id: UUID = Field(..., description="User ID")
    permit_id: UUID = Field(..., description="Permission ID")
    is_active: Optional[bool] = Field(True, description="Whether the permission assignment is active")


class UserPermitCreate(UserPermitBase):
    pass


class UserPermitUpdate(BaseModel):
    user_id: Optional[UUID] = Field(None, description="User ID")
    permit_id: Optional[UUID] = Field(None, description="Permission ID")
    is_active: Optional[bool] = Field(None, description="Whether the permission assignment is active")


class UserPermitResponse(UserPermitBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserPermitWithDetails(UserPermitResponse):
    user_username: Optional[str] = Field(None, description="Username of the user")
    permit_endpoint: Optional[str] = Field(None, description="Endpoint of the permission")
    permit_description: Optional[str] = Field(None, description="Description of the permission")
