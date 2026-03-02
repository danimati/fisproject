from typing import Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.personnel import Personnel
from app.services.base import BaseService


class PersonnelService(BaseService[Personnel]):
    def __init__(self, db: Session):
        super().__init__(Personnel, db)

    def create(self, obj_in: Union[Dict[str, Any], BaseModel]) -> Personnel:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict()
        else:
            obj_data = obj_in
        
        try:
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "email" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Personnel with this email already exists"
                )
            if "employee_id" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Personnel with this employee ID already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in: Union[Dict[str, Any], BaseModel]) -> Optional[Personnel]:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict(exclude_unset=True)
        else:
            obj_data = obj_in
        
        try:
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "email" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Personnel with this email already exists"
                )
            if "employee_id" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Personnel with this employee ID already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_email(self, email: str) -> Optional[Personnel]:
        return self.db.query(Personnel).filter(Personnel.email == email.lower()).first()

    def get_by_employee_id(self, employee_id: str) -> Optional[Personnel]:
        return self.db.query(Personnel).filter(
            Personnel.employee_id == employee_id.upper()
        ).first()

    def get_active_personnel(self) -> list:
        return self.db.query(Personnel).filter(Personnel.is_active == True).all()

    def get_personnel_by_role(self, role: str) -> list:
        return self.db.query(Personnel).filter(Personnel.role == role).all()

    def get_personnel_by_location(self, location_id: int) -> list:
        return self.db.query(Personnel).filter(
            Personnel.location_id == location_id
        ).all()

    def get_personnel_by_department(self, department: str) -> list:
        return self.db.query(Personnel).filter(Personnel.department == department).all()

    def get_global_admins(self) -> list:
        return self.db.query(Personnel).filter(
            Personnel.role == "global_admin"
        ).all()

    def get_location_managers(self) -> list:
        return self.db.query(Personnel).filter(
            Personnel.role == "location_manager"
        ).all()

    def get_logistics_operators(self) -> list:
        return self.db.query(Personnel).filter(
            Personnel.role == "logistics_operator"
        ).all()
