from pydantic import BaseModel, validator
from typing import Optional
from app.models.contract import ContractStatus
from datetime import datetime


class ContractBase(BaseModel):
    contract_number: str
    title: str
    client_id: int
    contract_type: str
    total_value: float
    currency: str = "USD"
    start_date: datetime
    end_date: datetime
    terms_and_conditions: Optional[str] = None
    status: ContractStatus = ContractStatus.DRAFT
    
    @validator('contract_number')
    def validate_contract_number(cls, v):
        if len(v) < 5 or len(v) > 50:
            raise ValueError('Contract number must be between 5 and 50 characters')
        return v.upper()
    
    @validator('total_value')
    def validate_total_value(cls, v):
        if v <= 0:
            raise ValueError('Total value must be positive')
        return v
    
    @validator('currency')
    def validate_currency(cls, v):
        if len(v) != 3:
            raise ValueError('Currency must be 3 characters (ISO 4217)')
        return v.upper()
    
    @validator('end_date')
    def validate_end_date(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    client_id: Optional[int] = None
    contract_type: Optional[str] = None
    total_value: Optional[float] = None
    currency: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    terms_and_conditions: Optional[str] = None
    status: Optional[ContractStatus] = None


class ContractResponse(ContractBase):
    id: int
    created_at: str
    updated_at: str
