from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.client import Client
from app.schemas.client import ClientResponse
from app.services.base import BaseGenericService


class ClientService(BaseGenericService[Client, ClientResponse]):
    def __init__(self, db: Session):
        super().__init__(Client, ClientResponse, db)

    def create(self, obj_in) -> ClientResponse:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().create(obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "email" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Client with this email already exists"
                )
            if "tax_id" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Client with this tax ID already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in) -> Optional[ClientResponse]:
        try:
            # Convert Pydantic model to dict if needed
            obj_data = obj_in.dict() if hasattr(obj_in, 'dict') else obj_in
            return super().update(id, obj_data)
        except IntegrityError as e:
            self.db.rollback()
            if "email" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Client with this email already exists"
                )
            if "tax_id" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Client with this tax ID already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_email(self, email: str) -> Optional[ClientResponse]:
        client = self.db.query(Client).filter(Client.email == email.lower()).first()
        return ClientResponse.from_orm(client) if client else None

    def get_by_tax_id(self, tax_id: str) -> Optional[ClientResponse]:
        client = self.db.query(Client).filter(Client.tax_id == tax_id).first()
        return ClientResponse.from_orm(client) if client else None

    def get_active_clients(self) -> List[ClientResponse]:
        clients = self.db.query(Client).filter(Client.is_active == "true").all()
        return [ClientResponse.from_orm(client) for client in clients]

    def get_clients_by_type(self, client_type: str) -> List[ClientResponse]:
        clients = self.db.query(Client).filter(Client.client_type == client_type).all()
        return [ClientResponse.from_orm(client) for client in clients]

    def get_clients_by_country(self, country: str) -> List[ClientResponse]:
        clients = self.db.query(Client).filter(Client.country == country).all()
        return [ClientResponse.from_orm(client) for client in clients]
