from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import List, Dict, Any
from uuid import UUID

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.models.session import UserSession
from app.models.audit import AuditLog
from app.models.rate_limit import RateLimit
from app.schemas.user import UserResponse
from app.core.config import settings
from app.models import Permission
from app.models.Permission import TypePermission, HttpType
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """Get current user from token"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == UUID(user_id)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


def require_admin(current_user: User = Depends(get_current_user)):
    """Require admin privileges"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user


@router.get("/stats")
async def get_admin_stats(db: Session = Depends(get_db)):
    """Get administrative statistics"""
    # User statistics
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    admin_users = db.query(User).filter(User.is_admin == True).count()
    
    # Session statistics
    active_sessions = db.query(UserSession).filter(
        UserSession.is_active == "active",
        UserSession.expires_at > datetime.utcnow()
    ).count()
    
    # Recent activity (last 24 hours)
    yesterday = datetime.utcnow() - timedelta(days=1)
    recent_requests = db.query(AuditLog).filter(
        AuditLog.created_at >= yesterday
    ).count()
    
    # Security events (last 24 hours)
    blocked_requests = db.query(AuditLog).filter(
        AuditLog.created_at >= yesterday,
        AuditLog.event_type == "blocked"
    ).count()
    
    failed_logins = db.query(AuditLog).filter(
        AuditLog.created_at >= yesterday,
        AuditLog.event_type == "login_failed"
    ).count()
    
    # Rate limit statistics
    active_rate_limits = db.query(RateLimit).filter(
        RateLimit.is_blocked == "blocked"
    ).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "admin": admin_users
        },
        "sessions": {
            "active": active_sessions
        },
        "activity": {
            "requests_24h": recent_requests,
            "blocked_24h": blocked_requests,
            "failed_logins_24h": failed_logins
        },
        "security": {
            "currently_blocked": active_rate_limits
        }
    }


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(db: Session = Depends(get_db)):
    """Get all users (admin only)"""
    users = db.query(User).all()
    return users


@router.get("/users/{user_id}/sessions")
async def get_user_sessions(user_id: UUID, db: Session = Depends(get_db)):
    """Get user sessions (admin only)"""
    sessions = db.query(UserSession).filter(
        UserSession.user_id == user_id
    ).order_by(desc(UserSession.created_at)).limit(50).all()
    
    return [
        {
            "id": session.id,
            "created_at": session.created_at,
            "expires_at": session.expires_at,
            "is_active": session.is_active,
            "ip_address": session.ip_address,
            "user_agent": session.user_agent
        }
        for session in sessions
    ]


@router.get("/audit/logs")
async def get_audit_logs(
    limit: int = 100,
    offset: int = 0,
    event_type: str = None,
    db: Session = Depends(get_db)
):
    """Get audit logs (admin only)"""
    query = db.query(AuditLog)
    
    if event_type:
        query = query.filter(AuditLog.event_type == event_type)
    
    logs = query.order_by(desc(AuditLog.created_at)).offset(offset).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "ip_address": log.ip_address,
            "endpoint": log.endpoint,
            "method": log.method,
            "status_code": log.status_code,
            "response_time": log.response_time,
            "event_type": log.event_type,
            "created_at": log.created_at,
            "details": log.get_details()
        }
        for log in logs
    ]


@router.get("/security/blocked-ips")
async def get_blocked_ips(db: Session = Depends(get_db)):
    """Get currently blocked IP addresses (admin only)"""
    blocked = db.query(RateLimit).filter(
        RateLimit.is_blocked == "blocked",
        RateLimit.block_expires > datetime.utcnow()
    ).all()
    
    return [
        {
            "ip_address": rate_limit.ip_address,
            "request_count": rate_limit.request_count,
            "block_expires": rate_limit.block_expires,
            "window_size": rate_limit.window_size
        }
        for rate_limit in blocked
    ]


@router.post("/security/unblock-ip/{ip_hash}")
async def unblock_ip(ip_hash: str, db: Session = Depends(get_db)):
    """Unblock an IP address (admin only)"""
    rate_limit = db.query(RateLimit).filter(
        RateLimit.ip_address == ip_hash,
        RateLimit.is_blocked == "blocked"
    ).first()
    
    if not rate_limit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="IP address not found or not blocked"
        )
    
    rate_limit.is_blocked = "active"
    rate_limit.block_expires = None
    db.commit()
    
    return {"message": "IP address unblocked successfully"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: UUID, db: Session = Depends(get_db)):
    """Delete a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Soft delete by deactivating
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}


@router.post("/users/{user_id}/activate")
async def activate_user(user_id: UUID, db: Session = Depends(get_db)):
    """Activate a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}


@router.get("/performance/metrics")
async def get_performance_metrics(db: Session = Depends(get_db)):
    """Get performance metrics (admin only)"""
    # Average response times over last hour
    last_hour = datetime.utcnow() - timedelta(hours=1)
    
    avg_response_time = db.query(func.avg(AuditLog.response_time)).filter(
        AuditLog.created_at >= last_hour,
        AuditLog.response_time.isnot(None)
    ).scalar() or 0
    
    # Request count by status code
    status_counts = db.query(
        AuditLog.status_code,
        func.count(AuditLog.id).label('count')
    ).filter(
        AuditLog.created_at >= last_hour
    ).group_by(AuditLog.status_code).all()
    
    # Top endpoints by request count
    top_endpoints = db.query(
        AuditLog.endpoint,
        func.count(AuditLog.id).label('count')
    ).filter(
        AuditLog.created_at >= last_hour
    ).group_by(AuditLog.endpoint).order_by(
        desc('count')
    ).limit(10).all()
    
    return {
        "avg_response_time_ms": round(avg_response_time, 2),
        "status_distribution": [
            {"status_code": status, "count": count}
            for status, count in status_counts
        ],
        "top_endpoints": [
            {"endpoint": endpoint, "count": count}
            for endpoint, count in top_endpoints
        ]
    }


@router.get("/synchronization")
async def get_synchronization_status(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
    ):
    """Synchronize permissions from backend OpenAPI schema (admin only)"""
    url = settings.backend_url + '/openapi.json'
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            
            openapi_data = response.json()
            paths = openapi_data.get("paths", {})
            
            added_count = 0
            skipped_count = 0
            
            for endpoint, body in paths.items():
                for kindHttp, body2 in body.items():
                    if not isinstance(body2, dict):
                        continue
                    
                    tempEndpoint = endpoint.replace("{","**").replace("}","**")
                    
                    tags = body2.get("tags", [])
                    description = body2.get("summary", "")
                    operationId = body2.get("operationId", "")
                    
                    logger.info(f"Processing: {tempEndpoint} {kindHttp}")
                    
                    # Check if permission already exists
                    existing = db.query(Permission).filter(
                        Permission.endpoint == tempEndpoint,
                        Permission.httpType == HttpType[kindHttp.upper()]
                    ).first()
                    
                    if existing:
                        logger.info(f"Permission already exists: {tempEndpoint} {kindHttp}")
                        skipped_count += 1
                        continue
                    
                    try:
                        permission = Permission(
                            endpoint=tempEndpoint,
                            description=description,
                            tag=" ".join(tags) if tags else "",
                            operationId=operationId
                        )
                        
                        match kindHttp:
                            case "get":
                                permission.httpType = HttpType.GET
                                permission.type = TypePermission.READ
                            case "post":
                                permission.httpType = HttpType.POST
                                permission.type = TypePermission.WRITE
                            case "put":
                                permission.httpType = HttpType.PUT
                                permission.type = TypePermission.UPDATE
                            case "delete":
                                permission.httpType = HttpType.DELETE
                                permission.type = TypePermission.DELETE
                            case "patch":
                                permission.httpType = HttpType.PATCH
                                permission.type = TypePermission.UPDATE
                            case _:
                                logger.warning(f"Unknown HTTP method: {kindHttp}")
                                continue
                        print(permission)
                        db.add(permission)
                        db.commit()
                        db.refresh(permission)
                        print(vars(permission))
                        added_count += 1
                        logger.info(f"Added permission: {tempEndpoint} {kindHttp}")
                        
                    except Exception as e:
                        logger.error(f"Error creating permission for {tempEndpoint} {kindHttp}: {str(e)}")
                        db.rollback()
                        continue
            
            logger.info(f"Synchronization completed: {added_count} added, {skipped_count} skipped")
            return {
                "message": "Synchronization completed",
                "added": added_count,
                "skipped": skipped_count,
                "total_paths": len(paths)
            }
            
    except httpx.RequestError as e:
        logger.error(f"Failed to fetch OpenAPI schema: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Backend service unavailable: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Synchronization failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Synchronization failed: {str(e)}"
        )


