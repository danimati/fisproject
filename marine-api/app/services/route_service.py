from typing import Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.route import Route
from app.services.base import BaseService


class RouteService(BaseService[Route]):
    def __init__(self, db: Session):
        super().__init__(Route, db)

    def create(self, obj_in: Union[Dict[str, Any], BaseModel]) -> Route:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict()
        else:
            obj_data = obj_in
        
        try:
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "route_code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Route with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in: Union[Dict[str, Any], BaseModel]) -> Optional[Route]:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict(exclude_unset=True)
        else:
            obj_data = obj_in
        
        try:
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "route_code" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Route with this code already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_route_code(self, route_code: str) -> Optional[Route]:
        return self.db.query(Route).filter(Route.route_code == route_code.upper()).first()

    def get_routes_by_departure_port(self, departure_port_id: int) -> list:
        return self.db.query(Route).filter(
            Route.departure_port_id == departure_port_id
        ).all()

    def get_routes_by_arrival_port(self, arrival_port_id: int) -> list:
        return self.db.query(Route).filter(
            Route.arrival_port_id == arrival_port_id
        ).all()

    def get_routes_between_ports(self, departure_port_id: int, arrival_port_id: int) -> list:
        return self.db.query(Route).filter(
            Route.departure_port_id == departure_port_id,
            Route.arrival_port_id == arrival_port_id
        ).all()

    def get_active_routes(self) -> list:
        return self.db.query(Route).filter(Route.status == "active").all()

    def get_routes_by_distance(self, max_distance: float) -> list:
        return self.db.query(Route).filter(Route.distance <= max_distance).all()

    def get_routes_by_duration(self, max_duration: int) -> list:
        return self.db.query(Route).filter(Route.estimated_duration <= max_duration).all()
