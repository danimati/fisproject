from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.container import Container
from app.services.base import BaseService


class ContainerService(BaseService[Container]):
    def __init__(self, db: Session):
        super().__init__(Container, db)

    def create(self, obj_in) -> Container:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "container_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Container with this number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in) -> Optional[Container]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "container_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Container with this number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_container_number(self, container_number: str) -> Optional[Container]:
        return self.db.query(Container).filter(
            Container.container_number == container_number.upper()
        ).first()

    def get_available_containers(self) -> list:
        return self.db.query(Container).filter(Container.status == "empty").all()

    def get_containers_by_location(self, location_id: int) -> list:
        return self.db.query(Container).filter(
            Container.current_location_id == location_id
        ).all()

    def get_containers_by_type(self, container_type: str) -> list:
        return self.db.query(Container).filter(
            Container.container_type == container_type
        ).all()

    def update_container_location(self, container_id: int, location_id: int) -> Optional[Container]:
        container = self.get_by_id(container_id)
        if container:
            container.current_location_id = location_id
            self.db.commit()
            self.db.refresh(container)
        return container
