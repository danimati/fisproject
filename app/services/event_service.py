from typing import Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.event import Event
from app.services.base import BaseService
from app.schemas.base import PaginatedResponse
from math import ceil


class EventService(BaseService[Event]):
    def __init__(self, db: Session):
        super().__init__(Event, db)

    def create(self, obj_in: Union[Dict[str, Any], BaseModel]) -> Event:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict()
        else:
            obj_data = obj_in
        
        try:
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in: Union[Dict[str, Any], BaseModel]) -> Optional[Event]:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict(exclude_unset=True)
        else:
            obj_data = obj_in
        
        try:
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_shipment_paginated(
        self, 
        shipment_id: int, 
        page: int = 1, 
        size: int = 10
    ) -> PaginatedResponse:
        query = self.db.query(Event).filter(Event.shipment_id == shipment_id)
        
        total = query.count()
        items = query.order_by(Event.event_date.desc()).offset((page - 1) * size).limit(size).all()
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=ceil(total / size) if total > 0 else 0
        )

    def get_by_container_paginated(
        self, 
        container_id: int, 
        page: int = 1, 
        size: int = 10
    ) -> PaginatedResponse:
        query = self.db.query(Event).filter(Event.container_id == container_id)
        
        total = query.count()
        items = query.order_by(Event.event_date.desc()).offset((page - 1) * size).limit(size).all()
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=ceil(total / size) if total > 0 else 0
        )

    def get_events_by_shipment(self, shipment_id: int) -> list:
        return self.db.query(Event).filter(Event.shipment_id == shipment_id).all()

    def get_events_by_container(self, container_id: int) -> list:
        return self.db.query(Event).filter(Event.container_id == container_id).all()

    def get_events_by_personnel(self, personnel_id: int) -> list:
        return self.db.query(Event).filter(Event.personnel_id == personnel_id).all()

    def get_events_by_type(self, event_type: str) -> list:
        return self.db.query(Event).filter(Event.event_type == event_type).all()

    def get_events_by_date_range(self, start_date, end_date) -> list:
        return self.db.query(Event).filter(
            Event.event_date.between(start_date, end_date)
        ).all()

    def get_recent_events(self, hours: int = 24) -> list:
        from datetime import datetime, timedelta
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        return self.db.query(Event).filter(
            Event.event_date >= cutoff_time
        ).order_by(Event.event_date.desc()).all()

    def get_damage_events(self) -> list:
        return self.db.query(Event).filter(Event.event_type == "damage_reported").all()

    def get_delay_events(self) -> list:
        return self.db.query(Event).filter(Event.event_type == "delay_reported").all()

    def get_inspection_events(self) -> list:
        return self.db.query(Event).filter(Event.event_type == "inspection").all()
