from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.vessel import VesselCreate, VesselUpdate, VesselResponse
from app.schemas.base import PaginatedResponse
from app.services.vessel_service import VesselService

router = APIRouter(prefix="/vessels", tags=["vessels"])


@router.post("/", response_model=VesselResponse, status_code=201)
async def create_vessel(
    vessel: VesselCreate,
    db: Session = Depends(get_db)
):
    service = VesselService(db)
    return service.create(vessel)


@router.get("/", response_model=PaginatedResponse)
async def list_vessels(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    vessel_type: Optional[str] = Query(None),
    flag_country: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = VesselService(db)
    filters = {}
    if status:
        filters["status"] = status
    if vessel_type:
        filters["vessel_type"] = vessel_type
    if flag_country:
        filters["flag_country"] = flag_country
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{vessel_id}", response_model=VesselResponse)
async def get_vessel(
    vessel_id: int,
    db: Session = Depends(get_db)
):
    service = VesselService(db)
    vessel = service.get_by_id(vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.put("/{vessel_id}", response_model=VesselResponse)
async def update_vessel(
    vessel_id: int,
    vessel_update: VesselUpdate,
    db: Session = Depends(get_db)
):
    service = VesselService(db)
    vessel = service.update(vessel_id, vessel_update)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.delete("/{vessel_id}", status_code=204)
async def delete_vessel(
    vessel_id: int,
    db: Session = Depends(get_db)
):
    service = VesselService(db)
    success = service.delete(vessel_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vessel not found")
