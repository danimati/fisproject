from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.port import PortCreate, PortUpdate, PortResponse, PortPaginatedResponse
from app.schemas.base import PaginatedResponse
from app.services.port_service import PortService

router = APIRouter(prefix="/ports", tags=["ports"])


@router.post("/", response_model=PortResponse, status_code=201)
async def create_port(
    port: PortCreate,
    db: Session = Depends(get_db)
):
    service = PortService(db)
    return service.create(port)


@router.get("/", response_model=PortPaginatedResponse)
async def list_ports(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    country: Optional[str] = Query(None),
    port_type: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    service = PortService(db)
    filters = {}
    if country:
        filters["country"] = country
    if port_type:
        filters["port_type"] = port_type
    if is_active:
        filters["is_active"] = is_active
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{port_id}", response_model=PortResponse)
async def get_port(
    port_id: int,
    db: Session = Depends(get_db)
):
    service = PortService(db)
    port = service.get_by_id(port_id)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return port


@router.put("/{port_id}", response_model=PortResponse)
async def update_port(
    port_id: int,
    port_update: PortUpdate,
    db: Session = Depends(get_db)
):
    service = PortService(db)
    port = service.update(port_id, port_update)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return port


@router.delete("/{port_id}", status_code=204)
async def delete_port(
    port_id: int,
    db: Session = Depends(get_db)
):
    service = PortService(db)
    success = service.delete(port_id)
    if not success:
        raise HTTPException(status_code=404, detail="Port not found")


@router.get("/code/{port_code}", response_model=PortResponse)
async def get_port_by_code(
    port_code: str,
    db: Session = Depends(get_db)
):
    service = PortService(db)
    port = service.get_by_code(port_code)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")
    return port
