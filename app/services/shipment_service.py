from typing import Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from pydantic import BaseModel
from app.models.shipment import Shipment
from app.models.vessel import Vessel
from app.services.base import BaseService


class ShipmentService(BaseService[Shipment]):
    def __init__(self, db: Session):
        super().__init__(Shipment, db)

    def create(self, obj_in: Union[Dict[str, Any], BaseModel]) -> Shipment:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict()
        else:
            obj_data = obj_in
        
        try:
            return super().create(obj_data)
        except IntegrityError as e:
            print("Error creating shipment:", e)
            self.db.rollback()
            error_str = str(e)
            
            if "shipment_number" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Shipment with this number already exists"
                )
            if "bill_of_lading" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Shipment with this bill of lading already exists"
                )
            if "vessel_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified vessel does not exist. Please select a valid vessel."
                )
            if "route_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified route does not exist. Please select a valid route."
                )
            if "contract_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified contract does not exist. Please select a valid contract."
                )
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error. Please check your data and try again."
            )

    def update(self, id: int, obj_in: Union[Dict[str, Any], BaseModel]) -> Optional[Shipment]:
        # Convert Pydantic model to dict if needed
        if isinstance(obj_in, BaseModel):
            obj_data = obj_in.dict(exclude_unset=True)
        else:
            obj_data = obj_in
        
        try:
            return super().update(id, obj_data)
        except IntegrityError as e:
            print("Error updating shipment:", e)
            self.db.rollback()
            error_str = str(e)
            
            vessel_id = obj_data.get('vessel_id')
            route_id = obj_data.get('route_id')
            
            if vessel_id:
                vessel = self.db.query(Vessel).filter(Vessel.id == vessel_id).first()
                if not vessel:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The specified vessel does not exist. Please select a valid vessel."
                    )
            if route_id:
                route = self.db.query(Route).filter(Route.id == route_id).first()
                if not route:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="The specified route does not exist. Please select a valid route."
                    )
            
            
            
            
            
            

            
            if "shipment_number" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Shipment with this number already exists"
                )
            if "bill_of_lading" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Shipment with this bill of lading already exists"
                )
            if "vessel_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified vessel does not exist. Please select a valid vessel."
                )
            if "route_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified route does not exist. Please select a valid route."
                )
            if "contract_id" in error_str and "not present in table" in error_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The specified contract does not exist. Please select a valid contract."
                )
            
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Database integrity error. Please check your data and try again."
            )

    def get_by_shipment_number(self, shipment_number: str) -> Optional[Shipment]:
        return self.db.query(Shipment).filter(
            Shipment.shipment_number == shipment_number.upper()
        ).first()

    def get_by_bill_of_lading(self, bill_of_lading: str) -> Optional[Shipment]:
        return self.db.query(Shipment).filter(
            Shipment.bill_of_lading == bill_of_lading
        ).first()

    def get_shipments_by_vessel(self, vessel_id: int) -> list:
        return self.db.query(Shipment).filter(Shipment.vessel_id == vessel_id).all()

    def get_shipments_by_route(self, route_id: int) -> list:
        return self.db.query(Shipment).filter(Shipment.route_id == route_id).all()

    def get_shipments_by_contract(self, contract_id: int) -> list:
        return self.db.query(Shipment).filter(Shipment.contract_id == contract_id).all()

    def get_shipments_by_status(self, status: str) -> list:
        return self.db.query(Shipment).filter(Shipment.status == status).all()

    def get_active_shipments(self) -> list:
        return self.db.query(Shipment).filter(
            Shipment.status.in_(["booked", "loading", "in_transit", "at_port", "unloading"])
        ).all()

    def get_delayed_shipments(self) -> list:
        from datetime import datetime
        return self.db.query(Shipment).filter(
            Shipment.estimated_arrival < datetime.utcnow(),
            Shipment.status.in_(["booked", "loading", "in_transit", "at_port"])
        ).all()

    def get_completed_shipments(self) -> list:
        return self.db.query(Shipment).filter(Shipment.status == "completed").all()

    def get_shipments_by_date_range(self, start_date, end_date) -> list:
        return self.db.query(Shipment).filter(
            Shipment.departure_date.between(start_date, end_date)
        ).all()
