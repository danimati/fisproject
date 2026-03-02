from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate, ShipmentResponse, ShipmentPaginatedResponse
from app.schemas.base import PaginatedResponse
from app.services.shipment_service import ShipmentService

router = APIRouter(prefix="/shipments", tags=["shipments"])


@router.post("/", response_model=ShipmentResponse, status_code=201)
async def create_shipment(
    shipment: ShipmentCreate,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    return service.create(shipment)


@router.get("/", response_model=ShipmentPaginatedResponse)
async def list_shipments(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    vessel_id: Optional[int] = Query(None),
    route_id: Optional[int] = Query(None),
    contract_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    filters = {}
    if vessel_id:
        filters["vessel_id"] = vessel_id
    if route_id:
        filters["route_id"] = route_id
    if contract_id:
        filters["contract_id"] = contract_id
    if status:
        filters["status"] = status
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{shipment_id}", response_model=ShipmentResponse)
async def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    shipment = service.get_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.put("/{shipment_id}", response_model=ShipmentResponse)
async def update_shipment(
    shipment_id: int,
    shipment_update: ShipmentUpdate,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    shipment = service.update(shipment_id, shipment_update)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.delete("/{shipment_id}", status_code=204)
async def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    success = service.delete(shipment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Shipment not found")


@router.get("/number/{shipment_number}", response_model=ShipmentResponse)
async def get_shipment_by_number(
    shipment_number: str,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    shipment = service.get_by_shipment_number(shipment_number)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@router.get("/bol/{bill_of_lading}", response_model=ShipmentResponse)
async def get_shipment_by_bol(
    bill_of_lading: str,
    db: Session = Depends(get_db)
):
    service = ShipmentService(db)
    shipment = service.get_by_bill_of_lading(bill_of_lading)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment
