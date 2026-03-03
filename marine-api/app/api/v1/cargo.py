from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.cargo import CargoCreate, CargoUpdate, CargoResponse
from app.schemas.base import PaginatedResponse
from app.services.cargo_service import CargoService

router = APIRouter(prefix="/cargo", tags=["cargo"])


@router.post("/", response_model=CargoResponse, status_code=201)
async def create_cargo(
    cargo: CargoCreate,
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    return service.create(cargo)


@router.get("/", response_model=PaginatedResponse)
async def list_cargo(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    cargo_type: Optional[str] = Query(None),
    client_id: Optional[int] = Query(None),
    container_id: Optional[int] = Query(None),
    shipment_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    filters = {}
    if status:
        filters["status"] = status
    if cargo_type:
        filters["cargo_type"] = cargo_type
    if client_id:
        filters["client_id"] = client_id
    if container_id:
        filters["container_id"] = container_id
    if shipment_id:
        filters["shipment_id"] = shipment_id
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{cargo_id}", response_model=CargoResponse)
async def get_cargo(
    cargo_id: int,
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    cargo = service.get_by_id(cargo_id)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")
    return cargo


@router.put("/{cargo_id}", response_model=CargoResponse)
async def update_cargo(
    cargo_id: int,
    cargo_update: CargoUpdate,
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    cargo = service.update(cargo_id, cargo_update)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")
    return cargo


@router.delete("/{cargo_id}", status_code=204)
async def delete_cargo(
    cargo_id: int,
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    success = service.delete(cargo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cargo not found")


@router.get("/tracking/{tracking_number}", response_model=CargoResponse)
async def get_cargo_by_tracking_number(
    tracking_number: str,
    db: Session = Depends(get_db)
):
    service = CargoService(db)
    cargo = service.get_by_tracking_number(tracking_number)
    if not cargo:
        raise HTTPException(status_code=404, detail="Cargo not found")
    return cargo
