from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.contract import ContractCreate, ContractUpdate, ContractResponse
from app.schemas.base import PaginatedResponse
from app.services.contract_service import ContractService

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.post("/", response_model=ContractResponse, status_code=201)
async def create_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    return service.create(contract)


@router.get("/", response_model=PaginatedResponse)
async def list_contracts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    client_id: Optional[int] = Query(None),
    contract_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    filters = {}
    if client_id:
        filters["client_id"] = client_id
    if contract_type:
        filters["contract_type"] = contract_type
    if status:
        filters["status"] = status
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: int,
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    contract = service.get_by_id(contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract


@router.put("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: int,
    contract_update: ContractUpdate,
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    contract = service.update(contract_id, contract_update)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract


@router.delete("/{contract_id}", status_code=204)
async def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    success = service.delete(contract_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contract not found")


@router.get("/number/{contract_number}", response_model=ContractResponse)
async def get_contract_by_number(
    contract_number: str,
    db: Session = Depends(get_db)
):
    service = ContractService(db)
    contract = service.get_by_contract_number(contract_number)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract
