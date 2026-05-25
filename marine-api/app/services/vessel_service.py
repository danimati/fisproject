from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
import logging
from app.models.vessel import Vessel
from app.schemas.vessel import VesselResponse
from app.services.base import BaseGenericService

logger = logging.getLogger(__name__)


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
            logger.error(f"Integrity error creating vessel: {e}")
            if "imo_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Vessel with this IMO number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: str, obj_in) -> Optional[VesselResponse]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            error_msg = str(e).lower()
            logger.error(f"Integrity error updating vessel {id}: {e}")
            
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
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Database integrity error: {str(e)}"
                )

    def get_by_imo_number(self, imo_number: str) -> Optional[VesselResponse]:
        try:
            db_obj = self.db.query(Vessel).filter(Vessel.imo_number == imo_number).first()
            return VesselResponse.model_validate(db_obj) if db_obj else None
        except Exception as e:
            logger.error(f"Error getting vessel by IMO number {imo_number}: {e}")
            raise

    def get_active_vessels(self) -> list[VesselResponse]:
        try:
            db_objs = self.db.query(Vessel).filter(Vessel.status == "ACTIVE").all()
            return [VesselResponse.model_validate(obj) for obj in db_objs]
        except Exception as e:
            logger.error(f"Error getting active vessels: {e}")
            raise

    def get_by_capacity_range(self, min_capacity: int, max_capacity: int) -> list[VesselResponse]:
        try:
            db_objs = self.db.query(Vessel).filter(
                Vessel.deadweight_tonnage.between(min_capacity, max_capacity)
            ).all()
            return [VesselResponse.model_validate(obj) for obj in db_objs]
        except Exception as e:
            logger.error(f"Error getting vessels by capacity range {min_capacity}-{max_capacity}: {e}")
            raise
