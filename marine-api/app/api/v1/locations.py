from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse
from app.schemas.base import PaginatedResponse
from app.services.location_service import LocationService

router = APIRouter(prefix="/locations", tags=["locations"])


@router.post("/", response_model=LocationResponse, status_code=201)
async def create_location(
    location: LocationCreate,
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    return service.create(location)


@router.get("/", response_model=PaginatedResponse)
async def list_locations(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    location_type: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    filters = {}
    if location_type:
        filters["location_type"] = location_type
    if country:
        filters["country"] = country
    if city:
        filters["city"] = city
    if is_active:
        filters["is_active"] = is_active
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    location = service.get_by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.put("/{location_id}", response_model=LocationResponse)
async def update_location(
    location_id: int,
    location_update: LocationUpdate,
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    location = service.update(location_id, location_update)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.delete("/{location_id}", status_code=204)
async def delete_location(
    location_id: int,
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    success = service.delete(location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found")


@router.get("/code/{location_code}", response_model=LocationResponse)
async def get_location_by_code(
    location_code: str,
    db: Session = Depends(get_db)
):
    service = LocationService(db)
    location = service.get_by_location_code(location_code)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location
