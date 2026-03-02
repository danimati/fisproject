from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.event import EventCreate, EventUpdate, EventResponse, EventPaginatedResponse
from app.schemas.base import PaginatedResponse
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventResponse, status_code=201)
async def create_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):
    service = EventService(db)
    return service.create(event)


@router.get("/", response_model=EventPaginatedResponse)
async def list_events(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    shipment_id: Optional[int] = Query(None),
    container_id: Optional[int] = Query(None),
    personnel_id: Optional[int] = Query(None),
    event_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = EventService(db)
    filters = {}
    if shipment_id:
        filters["shipment_id"] = shipment_id
    if container_id:
        filters["container_id"] = container_id
    if personnel_id:
        filters["personnel_id"] = personnel_id
    if event_type:
        filters["event_type"] = event_type
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    service = EventService(db)
    event = service.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db)
):
    service = EventService(db)
    event = service.update(event_id, event_update)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.delete("/{event_id}", status_code=204)
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    service = EventService(db)
    success = service.delete(event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")


@router.get("/shipment/{shipment_id}", response_model=PaginatedResponse)
async def get_events_by_shipment(
    shipment_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    service = EventService(db)
    return service.get_by_shipment_paginated(shipment_id, page=page, size=size)


@router.get("/container/{container_id}", response_model=PaginatedResponse)
async def get_events_by_container(
    container_id: int,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    service = EventService(db)
    return service.get_by_container_paginated(container_id, page=page, size=size)
