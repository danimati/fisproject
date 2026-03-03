from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.route import RouteCreate, RouteUpdate, RouteResponse, RoutePaginatedResponse
from app.schemas.base import PaginatedResponse
from app.services.route_service import RouteService

router = APIRouter(prefix="/routes", tags=["routes"])


@router.post("/", response_model=RouteResponse, status_code=201)
async def create_route(
    route: RouteCreate,
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    return service.create(route)


@router.get("/", response_model=RoutePaginatedResponse)
async def list_routes(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    departure_port_id: Optional[int] = Query(None),
    arrival_port_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    filters = {}
    if departure_port_id:
        filters["departure_port_id"] = departure_port_id
    if arrival_port_id:
        filters["arrival_port_id"] = arrival_port_id
    if status:
        filters["status"] = status
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{route_id}", response_model=RouteResponse)
async def get_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    route = service.get_by_id(route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route


@router.put("/{route_id}", response_model=RouteResponse)
async def update_route(
    route_id: int,
    route_update: RouteUpdate,
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    route = service.update(route_id, route_update)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route


@router.delete("/{route_id}", status_code=204)
async def delete_route(
    route_id: int,
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    success = service.delete(route_id)
    if not success:
        raise HTTPException(status_code=404, detail="Route not found")


@router.get("/code/{route_code}", response_model=RouteResponse)
async def get_route_by_code(
    route_code: str,
    db: Session = Depends(get_db)
):
    service = RouteService(db)
    route = service.get_by_route_code(route_code)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route
