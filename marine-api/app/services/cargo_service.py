from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.cargo import Cargo
from app.models.client import Client, ClientType
from app.services.base import BaseService


class CargoService(BaseService[Cargo]):
    def __init__(self, db: Session):
        super().__init__(Cargo, db)

    def create(self, obj_in) -> Cargo:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            
            # Check if client exists, if not create one
            client_id = obj_data.get('client_id')
            if client_id:
                client = self.db.query(Client).filter(Client.id == client_id).first()
                if not client:
                    # Auto-create a default client
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Client not found"
                    )
            
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            print(e,"ERROR")
            error_str = str(e)
            if "tracking_number" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cargo with this tracking number already exists"
                )
            elif "client_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid client_id: The specified client does not exist"
                )
            elif "container_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid container_id: The specified container does not exist"
                )
            elif "shipment_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid shipment_id: The specified shipment does not exist"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in) -> Optional[Cargo]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            print(e,"ERROR")
            error_str = str(e)
            if "tracking_number" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cargo with this tracking number already exists"
                )
            elif "client_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid client_id: The specified client does not exist"
                )
            elif "container_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid container_id: The specified container does not exist"
                )
            elif "shipment_id" in error_str and "foreign key constraint" in error_str.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid shipment_id: The specified shipment does not exist"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_tracking_number(self, tracking_number: str) -> Optional[Cargo]:
        return self.db.query(Cargo).filter(
            Cargo.tracking_number == tracking_number
        ).first()

    def get_cargo_by_client(self, client_id: int) -> list:
        return self.db.query(Cargo).filter(Cargo.client_id == client_id).all()

    def get_cargo_by_shipment(self, shipment_id: int) -> list:
        return self.db.query(Cargo).filter(Cargo.shipment_id == shipment_id).all()

    def get_cargo_by_container(self, container_id: int) -> list:
        return self.db.query(Cargo).filter(Cargo.container_id == container_id).all()

    def get_dangerous_cargo(self) -> list:
        return self.db.query(Cargo).filter(Cargo.is_dangerous == True).all()

    def get_fragile_cargo(self) -> list:
        return self.db.query(Cargo).filter(Cargo.is_fragile == True).all()

    def get_cargo_by_status(self, status: str) -> list:
        return self.db.query(Cargo).filter(Cargo.status == status).all()

    def assign_to_container(self, cargo_id: int, container_id: int) -> Optional[Cargo]:
        cargo = self.get_by_id(cargo_id)
        if cargo:
            cargo.container_id = container_id
            self.db.commit()
            self.db.refresh(cargo)
        return cargo

    def assign_to_shipment(self, cargo_id: int, shipment_id: int) -> Optional[Cargo]:
        cargo = self.get_by_id(cargo_id)
        if cargo:
            cargo.shipment_id = shipment_id
            self.db.commit()
            self.db.refresh(cargo)
        return cargo
