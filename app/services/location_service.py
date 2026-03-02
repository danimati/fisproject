from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.location import Location
from app.schemas.location import LocationResponse
from app.services.base import BaseGenericService


class LocationService(BaseGenericService[Location, LocationResponse]):
    def __init__(self, db: Session):
        super().__init__(Location, LocationResponse, db)

    def create(self, obj_in) -> LocationResponse:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "location_code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Location with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in) -> Optional[LocationResponse]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "location_code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Location with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_location_code(self, location_code: str) -> Optional[LocationResponse]:
        db_obj = self.db.query(Location).filter(
            Location.location_code == location_code.upper()
        ).first()
        return self.response_schema.from_orm(db_obj) if db_obj else None

    def get_active_locations(self) -> list:
        return self.db.query(Location).filter(Location.is_active == True).all()

    def get_locations_by_type(self, location_type: str) -> list:
        return self.db.query(Location).filter(
            Location.location_type == location_type
        ).all()

    def get_locations_by_country(self, country: str) -> list:
        return self.db.query(Location).filter(Location.country == country).all()

    def get_locations_by_city(self, city: str) -> list:
        return self.db.query(Location).filter(Location.city == city).all()

    def get_locations_by_coordinates(
        self, 
        lat_min: float, lat_max: float, 
        lon_min: float, lon_max: float
    ) -> list:
        return self.db.query(Location).filter(
            Location.latitude.between(lat_min, lat_max),
            Location.longitude.between(lon_min, lon_max)
        ).all()
