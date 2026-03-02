from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class BaseSchema(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    items: List
    total: int
    page: int
    size: int
    pages: int
