from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.container import ContainerCreate, ContainerUpdate, ContainerResponse
from app.schemas.base import PaginatedResponse
from app.services.container_service import ContainerService

router = APIRouter(prefix="/containers", tags=["containers"])


@router.post("/", response_model=ContainerResponse, status_code=201)
async def create_container(
    container: ContainerCreate,
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    return service.create(container)


@router.get("/", response_model=PaginatedResponse)
async def list_containers(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    container_type: Optional[str] = Query(None),
    current_location_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    filters = {}
    if status:
        filters["status"] = status
    if container_type:
        filters["container_type"] = container_type
    if current_location_id:
        filters["current_location_id"] = current_location_id
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{container_id}", response_model=ContainerResponse)
async def get_container(
    container_id: int,
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    container = service.get_by_id(container_id)
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
    return container


@router.put("/{container_id}", response_model=ContainerResponse)
async def update_container(
    container_id: int,
    container_update: ContainerUpdate,
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    container = service.update(container_id, container_update)
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
    return container


@router.delete("/{container_id}", status_code=204)
async def delete_container(
    container_id: int,
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    success = service.delete(container_id)
    if not success:
        raise HTTPException(status_code=404, detail="Container not found")


@router.get("/number/{container_number}", response_model=ContainerResponse)
async def get_container_by_number(
    container_number: str,
    db: Session = Depends(get_db)
):
    service = ContainerService(db)
    container = service.get_by_container_number(container_number)
    if not container:
        raise HTTPException(status_code=404, detail="Container not found")
    return container
