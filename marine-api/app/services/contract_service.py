from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.contract import Contract
from app.services.base import BaseService


class ContractService(BaseService[Contract]):
    def __init__(self, db: Session):
        super().__init__(Contract, db)

    def create(self, obj_in: Dict[str, Any]) -> Contract:
        try:
            return super().create(obj_in)
        except IntegrityError as e:
            self.db.rollback()
            if "contract_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Contract with this number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def update(self, id: int, obj_in: Dict[str, Any]) -> Optional[Contract]:
        try:
            return super().update(id, obj_in)
        except IntegrityError as e:
            self.db.rollback()
            if "contract_number" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Contract with this number already exists"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error"
            )

    def get_by_contract_number(self, contract_number: str) -> Optional[Contract]:
        return self.db.query(Contract).filter(
            Contract.contract_number == contract_number.upper()
        ).first()

    def get_contracts_by_client(self, client_id: int) -> list:
        return self.db.query(Contract).filter(Contract.client_id == client_id).all()

    def get_contracts_by_type(self, contract_type: str) -> list:
        return self.db.query(Contract).filter(Contract.contract_type == contract_type).all()

    def get_contracts_by_status(self, status: str) -> list:
        return self.db.query(Contract).filter(Contract.status == status).all()

    def get_active_contracts(self) -> list:
        return self.db.query(Contract).filter(Contract.status == "active").all()

    def get_expired_contracts(self) -> list:
        from datetime import datetime
        return self.db.query(Contract).filter(
            Contract.end_date < datetime.utcnow()
        ).all()

    def get_expiring_contracts(self, days: int = 30) -> list:
        from datetime import datetime, timedelta
        future_date = datetime.utcnow() + timedelta(days=days)
        return self.db.query(Contract).filter(
            Contract.end_date.between(datetime.utcnow(), future_date)
        ).all()

    def get_contracts_by_value_range(self, min_value: float, max_value: float) -> list:
        return self.db.query(Contract).filter(
            Contract.total_value.between(min_value, max_value)
        ).all()
