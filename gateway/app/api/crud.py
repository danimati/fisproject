from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import verify_token
from app.models import User, Rol, RolUser, UserPermit, Permission
from app.schemas.rol import RolCreate, RolUpdate, RolResponse, RolWithUsers
from app.schemas.rol_user import RolUserCreate, RolUserUpdate, RolUserResponse, RolUserWithDetails
from app.schemas.user_permit import UserPermitCreate, UserPermitUpdate, UserPermitResponse, UserPermitWithDetails
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/crud", tags=["crud"])
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == UUID(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user

def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user

# Rol CRUD endpoints
@router.get("/roles", response_model=List[RolResponse])
async def get_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    roles = db.query(Rol).offset(skip).limit(limit).all()
    return roles

@router.get("/roles/{rol_id}", response_model=RolResponse)
async def get_role(rol_id: UUID, db: Session = Depends(get_db)):
    role = db.query(Rol).filter(Rol.id == rol_id).first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    return role

@router.post("/roles", response_model=RolResponse)
async def create_role(
    role: RolCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_role = db.query(Rol).filter(Rol.nombre == role.nombre).first()
    if existing_role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role name already exists")
    
    db_role = Rol(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.put("/roles/{rol_id}", response_model=RolResponse)
async def update_role(
    rol_id: UUID,
    role: RolUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_role = db.query(Rol).filter(Rol.id == rol_id).first()
    if not db_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    if role.nombre and role.nombre != db_role.nombre:
        existing_role = db.query(Rol).filter(Rol.nombre == role.nombre).first()
        if existing_role:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role name already exists")
    
    update_data = role.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_role, field, value)
    
    db.commit()
    db.refresh(db_role)
    return db_role

@router.delete("/roles/{rol_id}")
async def delete_role(
    rol_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_role = db.query(Rol).filter(Rol.id == rol_id).first()
    if not db_role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    db_role.activo = False
    db.commit()
    return {"message": "Role deactivated successfully"}

# RolUser CRUD endpoints
@router.get("/role-users", response_model=List[RolUserWithDetails])
async def get_role_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    role_users = db.query(RolUser).offset(skip).limit(limit).all()
    
    result = []
    for ru in role_users:
        user = db.query(User).filter(User.id == ru.user_id).first()
        role = db.query(Rol).filter(Rol.id == ru.rol_id).first()
        result.append({
            "id": ru.id,
            "user_id": ru.user_id,
            "rol_id": ru.rol_id,
            "is_active": ru.is_active,
            "created_at": ru.created_at,
            "updated_at": ru.updated_at,
            "user_username": user.username if user else None,
            "rol_nombre": role.nombre if role else None
        })
    return result

@router.get("/role-users/{role_user_id}", response_model=RolUserWithDetails)
async def get_role_user(role_user_id: UUID, db: Session = Depends(get_db)):
    role_user = db.query(RolUser).filter(RolUser.id == role_user_id).first()
    if not role_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role user assignment not found")
    
    user = db.query(User).filter(User.id == role_user.user_id).first()
    role = db.query(Rol).filter(Rol.id == role_user.rol_id).first()
    
    return {
        "id": role_user.id,
        "user_id": role_user.user_id,
        "rol_id": role_user.rol_id,
        "is_active": role_user.is_active,
        "created_at": role_user.created_at,
        "updated_at": role_user.updated_at,
        "user_username": user.username if user else None,
        "rol_nombre": role.nombre if role else None
    }

@router.post("/role-users", response_model=RolUserResponse)
async def create_role_user(
    role_user: RolUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_assignment = db.query(RolUser).filter(
        RolUser.user_id == role_user.user_id,
        RolUser.rol_id == role_user.rol_id
    ).first()
    
    if existing_assignment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role assignment already exists")
    
    user_exists = db.query(User).filter(User.id == role_user.user_id).first()
    if not user_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    role_exists = db.query(Rol).filter(Rol.id == role_user.rol_id).first()
    if not role_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    db_role_user = RolUser(**role_user.dict())
    db.add(db_role_user)
    db.commit()
    db.refresh(db_role_user)
    return db_role_user

@router.put("/role-users/{role_user_id}", response_model=RolUserResponse)
async def update_role_user(
    role_user_id: UUID,
    role_user: RolUserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_role_user = db.query(RolUser).filter(RolUser.id == role_user_id).first()
    if not db_role_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role user assignment not found")
    
    update_data = role_user.dict(exclude_unset=True)
    
    if "user_id" in update_data:
        user_exists = db.query(User).filter(User.id == update_data["user_id"]).first()
        if not user_exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if "rol_id" in update_data:
        role_exists = db.query(Rol).filter(Rol.id == update_data["rol_id"]).first()
        if not role_exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    for field, value in update_data.items():
        setattr(db_role_user, field, value)
    
    db.commit()
    db.refresh(db_role_user)
    return db_role_user

@router.delete("/role-users/{role_user_id}")
async def delete_role_user(
    role_user_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_role_user = db.query(RolUser).filter(RolUser.id == role_user_id).first()
    if not db_role_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role user assignment not found")
    
    db_role_user.is_active = False
    db.commit()
    return {"message": "Role user assignment deactivated successfully"}

@router.get("/users/{user_id}/roles", response_model=List[RolResponse])
async def get_user_roles(user_id: UUID, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.id == user_id).first()
    if not user_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    role_assignments = db.query(RolUser).filter(
        RolUser.user_id == user_id,
        RolUser.is_active == True
    ).all()
    
    role_ids = [ra.rol_id for ra in role_assignments]
    roles = db.query(Rol).filter(Rol.id.in_(role_ids)).all()
    return roles

@router.get("/roles/{rol_id}/users", response_model=List[RolUserWithDetails])
async def get_role_users_by_role(rol_id: UUID, db: Session = Depends(get_db)):
    role_exists = db.query(Rol).filter(Rol.id == rol_id).first()
    if not role_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    
    role_assignments = db.query(RolUser).filter(
        RolUser.rol_id == rol_id,
        RolUser.is_active == True
    ).all()
    
    result = []
    for ra in role_assignments:
        user = db.query(User).filter(User.id == ra.user_id).first()
        result.append({
            "id": ra.id,
            "user_id": ra.user_id,
            "rol_id": ra.rol_id,
            "is_active": ra.is_active,
            "created_at": ra.created_at,
            "updated_at": ra.updated_at,
            "user_username": user.username if user else None,
            "rol_nombre": role_exists.nombre
        })
    return result

# UserPermit CRUD endpoints
@router.get("/user-permits", response_model=List[UserPermitWithDetails])
async def get_user_permits(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    user_permits = db.query(UserPermit).offset(skip).limit(limit).all()
    
    result = []
    for up in user_permits:
        user = db.query(User).filter(User.id == up.user_id).first()
        permit = db.query(Permission).filter(Permission.id == up.permit_id).first()
        result.append({
            "id": up.id,
            "user_id": up.user_id,
            "permit_id": up.permit_id,
            "is_active": up.is_active,
            "created_at": up.created_at,
            "updated_at": up.updated_at,
            "user_username": user.username if user else None,
            "permit_endpoint": permit.endpoint if permit else None,
            "permit_description": permit.description if permit else None
        })
    return result

@router.get("/user-permits/{user_permit_id}", response_model=UserPermitWithDetails)
async def get_user_permit(user_permit_id: UUID, db: Session = Depends(get_db)):
    user_permit = db.query(UserPermit).filter(UserPermit.id == user_permit_id).first()
    if not user_permit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User permit assignment not found")
    
    user = db.query(User).filter(User.id == user_permit.user_id).first()
    permit = db.query(Permission).filter(Permission.id == user_permit.permit_id).first()
    
    return {
        "id": user_permit.id,
        "user_id": user_permit.user_id,
        "permit_id": user_permit.permit_id,
        "is_active": user_permit.is_active,
        "created_at": user_permit.created_at,
        "updated_at": user_permit.updated_at,
        "user_username": user.username if user else None,
        "permit_endpoint": permit.endpoint if permit else None,
        "permit_description": permit.description if permit else None
    }

@router.post("/user-permits", response_model=UserPermitResponse)
async def create_user_permit(
    user_permit: UserPermitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_assignment = db.query(UserPermit).filter(
        UserPermit.user_id == user_permit.user_id,
        UserPermit.permit_id == user_permit.permit_id
    ).first()
    
    if existing_assignment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User permit assignment already exists")
    
    user_exists = db.query(User).filter(User.id == user_permit.user_id).first()
    if not user_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    permit_exists = db.query(Permission).filter(Permission.id == user_permit.permit_id).first()
    if not permit_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    
    db_user_permit = UserPermit(**user_permit.dict())
    db.add(db_user_permit)
    db.commit()
    db.refresh(db_user_permit)
    return db_user_permit

@router.put("/user-permits/{user_permit_id}", response_model=UserPermitResponse)
async def update_user_permit(
    user_permit_id: UUID,
    user_permit: UserPermitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_user_permit = db.query(UserPermit).filter(UserPermit.id == user_permit_id).first()
    if not db_user_permit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User permit assignment not found")
    
    update_data = user_permit.dict(exclude_unset=True)
    
    if "user_id" in update_data:
        user_exists = db.query(User).filter(User.id == update_data["user_id"]).first()
        if not user_exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if "permit_id" in update_data:
        permit_exists = db.query(Permission).filter(Permission.id == update_data["permit_id"]).first()
        if not permit_exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    
    for field, value in update_data.items():
        setattr(db_user_permit, field, value)
    
    db.commit()
    db.refresh(db_user_permit)
    return db_user_permit

@router.delete("/user-permits/{user_permit_id}")
async def delete_user_permit(
    user_permit_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    db_user_permit = db.query(UserPermit).filter(UserPermit.id == user_permit_id).first()
    if not db_user_permit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User permit assignment not found")
    
    db_user_permit.is_active = False
    db.commit()
    return {"message": "User permit assignment deactivated successfully"}

@router.get("/users/{user_id}/permits", response_model=List[UserPermitWithDetails])
async def get_user_permits_by_user(user_id: UUID, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(User.id == user_id).first()
    if not user_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    permit_assignments = db.query(UserPermit).filter(
        UserPermit.user_id == user_id,
        UserPermit.is_active == True
    ).all()
    
    result = []
    for pa in permit_assignments:
        permit = db.query(Permission).filter(Permission.id == pa.permit_id).first()
        result.append({
            "id": pa.id,
            "user_id": pa.user_id,
            "permit_id": pa.permit_id,
            "is_active": pa.is_active,
            "created_at": pa.created_at,
            "updated_at": pa.updated_at,
            "user_username": user_exists.username,
            "permit_endpoint": permit.endpoint if permit else None,
            "permit_description": permit.description if permit else None
        })
    return result

@router.get("/permits/{permit_id}/users", response_model=List[UserPermitWithDetails])
async def get_permit_users_by_permit(permit_id: UUID, db: Session = Depends(get_db)):
    permit_exists = db.query(Permission).filter(Permission.id == permit_id).first()
    if not permit_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    
    permit_assignments = db.query(UserPermit).filter(
        UserPermit.permit_id == permit_id,
        UserPermit.is_active == True
    ).all()
    
    result = []
    for pa in permit_assignments:
        user = db.query(User).filter(User.id == pa.user_id).first()
        result.append({
            "id": pa.id,
            "user_id": pa.user_id,
            "permit_id": pa.permit_id,
            "is_active": pa.is_active,
            "created_at": pa.created_at,
            "updated_at": pa.updated_at,
            "user_username": user.username if user else None,
            "permit_endpoint": permit_exists.endpoint,
            "permit_description": permit_exists.description
        })
    return result
