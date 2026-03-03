from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from app.schemas.base import PaginatedResponse
from app.services.client_service import ClientService

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/", response_model=ClientResponse, status_code=201)
async def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    return service.create(client)


@router.get("/", response_model=PaginatedResponse)
async def list_clients(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    client_type: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    is_active: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    filters = {}
    if client_type:
        filters["client_type"] = client_type
    if country:
        filters["country"] = country
    if is_active:
        filters["is_active"] = is_active
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    client = service.get_by_id(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    client_update: ClientUpdate,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    client = service.update(client_id, client_update)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.delete("/{client_id}", status_code=204)
async def delete_client(
    client_id: int,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    success = service.delete(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")


@router.get("/email/{email}", response_model=ClientResponse)
async def get_client_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    client = service.get_by_email(email)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.get("/tax/{tax_id}", response_model=ClientResponse)
async def get_client_by_tax_id(
    tax_id: str,
    db: Session = Depends(get_db)
):
    service = ClientService(db)
    client = service.get_by_tax_id(tax_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client
