



from sqlalchemy import Column, String, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum

from app.models.base import BaseModel


class TypePermission(Enum):
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    UPDATE = "update"
    
class HttpType(Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"

class Permission(BaseModel):
    __tablename__ = "permissions"
    
    endpoint = Column(String(1000), unique=False, nullable=False, index=True)
    type = Column(SQLEnum(TypePermission), unique=False, nullable=False)
    httpType = Column(SQLEnum(HttpType), unique=False, nullable=False)
    description = Column(String(1000), unique=False, nullable=True)
    tag = Column(String(1000), unique=False, nullable=True)
    operationId = Column(String(1000), unique=False, nullable=True)
    
    users = relationship("UserPermit", back_populates="permit")
    
    def __init__(self, endpoint=None, type=None, httpType=None, description=None, tag=None, operationId=None):
        super().__init__()
        if endpoint is not None:
            self.endpoint = endpoint
        if type is not None:
            self.type = TypePermission(type) if isinstance(type, str) else type
        if httpType is not None:
            self.httpType = HttpType(httpType) if isinstance(httpType, str) else httpType
        if description is not None:
            self.description = description
        if tag is not None:
            self.tag = tag
        if operationId is not None:
            self.operationId = operationId