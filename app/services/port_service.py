from typing import Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.port import Port
from app.services.base import BaseService


class PortService(BaseService[Port]):
    def __init__(self, db: Session):
        super().__init__(Port, db)

    def create(self, obj_in: Union[Dict[str, Any], BaseModel]) -> Port:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict()
        else:
            obj_data = obj_in
        
        try:
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Port with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in: Union[Dict[str, Any], BaseModel]) -> Optional[Port]:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict(exclude_unset=True)
        else:
            obj_data = obj_in
        
        try:
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Port with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_code(self, code: str) -> Optional[Port]:
        return self.db.query(Port).filter(Port.code == code.upper()).first()

    def get_active_ports(self) -> list:
        return self.db.query(Port).filter(Port.is_active == True).all()

    def get_ports_by_country(self, country: str) -> list:
        return self.db.query(Port).filter(Port.country == country).all()

    def get_ports_by_type(self, port_type: str) -> list:
        return self.db.query(Port).filter(Port.port_type == port_type).all()

    def get_ports_by_draft_capacity(self, min_draft: float) -> list:
        return self.db.query(Port).filter(
            Port.max_vessel_draft >= min_draft
        ).all()

    def get_ports_by_coordinates(
        self, 
        lat_min: float, lat_max: float, 
        lon_min: float, lon_max: float
    ) -> list:
        return self.db.query(Port).filter(
            Port.latitude.between(lat_min, lat_max),
            Port.longitude.between(lon_min, lon_max)
        ).all()
