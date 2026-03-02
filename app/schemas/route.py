from pydantic import BaseModel, validator, field_serializer
from typing import Optional, List
from datetime import datetime
from app.models.route import RouteStatus
from app.schemas.base import PaginatedResponse


class RouteBase(BaseModel):
    name: str
    route_code: str
    departure_port_id: int
    arrival_port_id: int
    distance: float
    estimated_duration: int
    status: RouteStatus = RouteStatus.ACTIVE
    
    @validator('route_code')
    def validate_route_code(cls, v):
        if len(v) < 3 or len(v) > 20:
            raise ValueError('Route code must be between 3 and 20 characters')
        return v.upper()
    
    @validator('distance')
    def validate_distance(cls, v):
        if v <= 0:
            raise ValueError('Distance must be positive')
        return v
    
    @validator('estimated_duration')
    def validate_estimated_duration(cls, v):
        if v <= 0:
            raise ValueError('Estimated duration must be positive')
        return v


class RouteCreate(RouteBase):
    pass


class RouteUpdate(BaseModel):
    name: Optional[str] = None
    route_code: Optional[str] = None
    departure_port_id: Optional[int] = None
    arrival_port_id: Optional[int] = None
    distance: Optional[float] = None
    estimated_duration: Optional[int] = None
    status: Optional[RouteStatus] = None


class RouteResponse(RouteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True


class RoutePaginatedResponse(PaginatedResponse):
    items: List[RouteResponse]
