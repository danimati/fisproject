from pydantic import BaseModel, validator, field_serializer, Field
from typing import Optional
from datetime import datetime
from app.models.vessel import VesselStatus


class VesselBase(BaseModel):
    name: str
    imo_number: str
    flag_country: str
    vessel_type: str
    deadweight_tonnage: int
    gross_tonnage: int
    length_overall: Optional[float] = None
    beam: Optional[float] = None
    draft: Optional[float] = None
    max_containers: Optional[int] = None
    max_cargo_weight: Optional[float] = None
    status: VesselStatus = VesselStatus.ACTIVE
    
    @validator('imo_number')
    def validate_imo_number(cls, v):
        if not v.isdigit() or len(v) != 7:
            raise ValueError('IMO number must be 7 digits')
        return v


class VesselCreate(VesselBase):
    pass


class VesselUpdate(BaseModel):
    name: Optional[str] = None
    imo_number: Optional[str] = None
    flag_country: Optional[str] = Field(None, alias="flag_state")
    vessel_type: Optional[str] = Field(None, alias="type")
    deadweight_tonnage: Optional[int] = Field(None, alias=["deadweight", "dwt"])
    gross_tonnage: Optional[int] = Field(None, alias=["gross", "gt"])
    length_overall: Optional[float] = Field(None, alias=["length", "loa"])
    beam: Optional[float] = Field(None, alias="width")
    draft: Optional[float] = None
    max_containers: Optional[int] = Field(None, alias=["capacity_teu", "capacity", "teu"])
    max_cargo_weight: Optional[float] = Field(None, alias=["cargo_weight", "max_cargo"])
    status: Optional[VesselStatus] = None
    
    @validator('imo_number')
    def validate_imo_number(cls, v):
        if v and (not v.isdigit() or len(v) != 7):
            raise ValueError('IMO number must be 7 digits')
        return v


class VesselResponse(VesselBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @field_serializer('created_at', 'updated_at')
    def serialize_datetime(self, value: datetime) -> str:
        return value.isoformat()
    
    class Config:
        from_attributes = True
