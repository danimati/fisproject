from typing import Type, TypeVar, Generic, List, Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from fastapi import HTTPException, status
from app.models.base import BaseModel
from app.schemas.base import PaginatedResponse
from math import ceil
from pydantic import BaseModel as PydanticBaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)
ResponseType = TypeVar("ResponseType", bound=PydanticBaseModel)


class BaseGenericService(Generic[ModelType, ResponseType]):
    def __init__(self, model: Type[ModelType], response_schema: Type[ResponseType], db: Session):
        self.model = model
        self.response_schema = response_schema
        self.db = db

    def get_by_id(self, id: int) -> Optional[ResponseType]:
        db_obj = self.db.query(self.model).filter(self.model.id == id).first()
        return self.response_schema.from_orm(db_obj) if db_obj else None

    def get_all(self, filters: Optional[Dict[str, Any]] = None) -> List[ResponseType]:
        query = self.db.query(self.model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        return [self.response_schema.from_orm(obj) for obj in query.all()]

    def get_paginated(
        self, 
        page: int = 1, 
        size: int = 10, 
        filters: Optional[Dict[str, Any]] = None
    ) -> PaginatedResponse:
        query = self.db.query(self.model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        total = query.count()
        items = query.offset((page - 1) * size).limit(size).all()
        
        return PaginatedResponse(
            items=[self.response_schema.from_orm(obj) for obj in items],
            total=total,
            page=page,
            size=size,
            pages=ceil(total / size) if total > 0 else 0
        )

    def create(self, obj_in: Dict[str, Any]) -> ResponseType:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return self.response_schema.from_orm(db_obj)

    def update(self, id: int, obj_in: Dict[str, Any]) -> Optional[ResponseType]:
        db_obj = self.db.query(self.model).filter(self.model.id == id).first()
        if not db_obj:
            return None
        
        for field, value in obj_in.items():
            if hasattr(db_obj, field) and value is not None:
                setattr(db_obj, field, value)
        
        self.db.commit()
        self.db.refresh(db_obj)
        return self.response_schema.from_orm(db_obj)

    def delete(self, id: int) -> bool:
        db_obj = self.db.query(self.model).filter(self.model.id == id).first()
        if not db_obj:
            return False
        
        self.db.delete(db_obj)
        self.db.commit()
        return True


class BaseService(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get_by_id(self, id: int) -> Optional[ModelType]:
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, filters: Optional[Dict[str, Any]] = None) -> List[ModelType]:
        query = self.db.query(self.model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        return query.all()

    def get_paginated(
        self, 
        page: int = 1, 
        size: int = 10, 
        filters: Optional[Dict[str, Any]] = None
    ) -> PaginatedResponse:
        query = self.db.query(self.model)
        
        if filters:
            for key, value in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == value)
        
        total = query.count()
        items = query.offset((page - 1) * size).limit(size).all()
        
        return PaginatedResponse(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=ceil(total / size) if total > 0 else 0
        )

    def create(self, obj_in: Dict[str, Any]) -> ModelType:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, id: int, obj_in: Dict[str, Any]) -> Optional[ModelType]:
        db_obj = self.db.query(self.model).filter(self.model.id == id).first()
        if not db_obj:
            return None
        
        for field, value in obj_in.items():
            if hasattr(db_obj, field) and value is not None:
                setattr(db_obj, field, value)
        
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, id: int) -> bool:
        db_obj = self.db.query(self.model).filter(self.model.id == id).first()
        if not db_obj:
            return False
        
        self.db.delete(db_obj)
        self.db.commit()
        return True
