from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.personnel import PersonnelCreate, PersonnelUpdate, PersonnelResponse, PersonnelPaginatedResponse
from app.schemas.base import PaginatedResponse
from app.services.personnel_service import PersonnelService

router = APIRouter(prefix="/personnel", tags=["personnel"])


@router.post("/", response_model=PersonnelResponse, status_code=201)
async def create_personnel(
    personnel: PersonnelCreate,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    return service.create(personnel)


@router.get("/", response_model=PersonnelPaginatedResponse)
async def list_personnel(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    role: Optional[str] = Query(None),
    location_id: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    filters = {}
    if role:
        filters["role"] = role
    if location_id:
        filters["location_id"] = location_id
    if department:
        filters["department"] = department
    if is_active is not None:
        filters["is_active"] = is_active
    
    return service.get_paginated(page=page, size=size, filters=filters)


@router.get("/{personnel_id}", response_model=PersonnelResponse)
async def get_personnel(
    personnel_id: int,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    personnel = service.get_by_id(personnel_id)
    if not personnel:
        raise HTTPException(status_code=404, detail="Personnel not found")
    return personnel


@router.put("/{personnel_id}", response_model=PersonnelResponse)
async def update_personnel(
    personnel_id: int,
    personnel_update: PersonnelUpdate,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    personnel = service.update(personnel_id, personnel_update)
    if not personnel:
        raise HTTPException(status_code=404, detail="Personnel not found")
    return personnel


@router.delete("/{personnel_id}", status_code=204)
async def delete_personnel(
    personnel_id: int,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    success = service.delete(personnel_id)
    if not success:
        raise HTTPException(status_code=404, detail="Personnel not found")


@router.get("/email/{email}", response_model=PersonnelResponse)
async def get_personnel_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    personnel = service.get_by_email(email)
    if not personnel:
        raise HTTPException(status_code=404, detail="Personnel not found")
    return personnel


@router.get("/employee/{employee_id}", response_model=PersonnelResponse)
async def get_personnel_by_employee_id(
    employee_id: str,
    db: Session = Depends(get_db)
):
    service = PersonnelService(db)
    personnel = service.get_by_employee_id(employee_id)
    if not personnel:
        raise HTTPException(status_code=404, detail="Personnel not found")
    return personnel
