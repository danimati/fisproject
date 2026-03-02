from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.vessel import Vessel
from app.schemas.vessel import VesselResponse
from app.services.base import BaseGenericService


class VesselService(BaseGenericService[Vessel, VesselResponse]):
    def __init__(self, db: Session):
        super().__init__(Vessel, VesselResponse, db)

    def create(self, obj_in) -> VesselResponse:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "imo_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vessel with this IMO number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in) -> Optional[VesselResponse]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            error_msg = str(e).lower()
            if "imo_number" in error_msg and "unique" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vessel with this IMO number already exists"
                )
            elif "name" in error_msg and "not null" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vessel name cannot be empty"
                )
            elif "flag_country" in error_msg and "not null" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Flag country cannot be empty"
                )
            elif "vessel_type" in error_msg and "not null" in error_msg:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vessel type cannot be empty"
                )
            else:
                # Log the full error for debugging
                print(f"Database integrity error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Database integrity error: {str(e)}"
                )

    def get_by_imo_number(self, imo_number: str) -> Optional[VesselResponse]:
        db_obj = self.db.query(Vessel).filter(Vessel.imo_number == imo_number).first()
        return VesselResponse.from_orm(db_obj) if db_obj else None

    def get_active_vessels(self) -> list[VesselResponse]:
        db_objs = self.db.query(Vessel).filter(Vessel.status == "active").all()
        return [VesselResponse.from_orm(obj) for obj in db_objs]

    def get_by_capacity_range(self, min_capacity: int, max_capacity: int) -> list[VesselResponse]:
        db_objs = self.db.query(Vessel).filter(
            Vessel.deadweight_tonnage.between(min_capacity, max_capacity)
        ).all()
        return [VesselResponse.from_orm(obj) for obj in db_objs]
