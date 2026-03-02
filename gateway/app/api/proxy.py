from fastapi import APIRouter, Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
import httpx
import time
from typing import Dict, Any
from urllib.parse import urljoin

from app.core.config import settings

router = APIRouter(prefix="/api/v1", tags=["proxy"])


class ProxyService:
    def __init__(self):
        self.backend_url = settings.backend_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def proxy_request(self, request: Request, path: str) -> Response:
        """Proxy request to backend API"""
        start_time = time.time()
        
        # Construct backend URL
        backend_url = urljoin(self.backend_url, f"/api/v1/{path}")
        
        # Prepare headers
        headers = dict(request.headers)
        # Remove hop-by-hop headers
        headers.pop("host", None)
        headers.pop("connection", None)
        headers.pop("content-length", None)
        
        # Add authentication if user is logged in
        if hasattr(request.state, 'user_id'):
            # Forward the original token to backend
            auth_header = request.headers.get("Authorization")
            if auth_header:
                headers["Authorization"] = auth_header
        
        try:
            # Make request to backend
            if request.method in ["GET", "DELETE"]:
                response = await self.client.request(
                    method=request.method,
                    url=backend_url,
                    headers=headers,
                    params=request.query_params
                )
            else:
                # For POST, PUT, PATCH requests
                body = await request.body()
                response = await self.client.request(
                    method=request.method,
                    url=backend_url,
                    headers=headers,
                    params=request.query_params,
                    content=body
                )
            
            # Process response
            process_time = time.time() - start_time
            
            # Create response
            proxy_response = Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
            
            # Add timing header
            proxy_response.headers["X-Gateway-Process-Time"] = str(process_time)
            proxy_response.headers["X-Backend-Response-Time"] = str(response.elapsed.total_seconds())
            
            return proxy_response
            
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Backend service timeout"
            )
        except httpx.ConnectError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Backend service unavailable"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Proxy error: {str(e)}"
            )


# Create proxy service instance
proxy_service = ProxyService()


# Dynamic route handlers for all backend endpoints
@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_to_backend(request: Request, path: str):
    """Proxy all requests to backend API"""
    return await proxy_service.proxy_request(request, path)


# Specific endpoint handlers for better documentation
@router.get("/vessels")
async def get_vessels(request: Request):
    """Proxy GET /api/v1/vessels to backend"""
    return await proxy_service.proxy_request(request, "vessels")


@router.post("/vessels")
async def create_vessel(request: Request):
    """Proxy POST /api/v1/vessels to backend"""
    return await proxy_service.proxy_request(request, "vessels")


@router.get("/vessels/{vessel_id}")
async def get_vessel(request: Request, vessel_id: int):
    """Proxy GET /api/v1/vessels/{id} to backend"""
    return await proxy_service.proxy_request(request, f"vessels/{vessel_id}")


@router.put("/vessels/{vessel_id}")
async def update_vessel(request: Request, vessel_id: int):
    """Proxy PUT /api/v1/vessels/{id} to backend"""
    return await proxy_service.proxy_request(request, f"vessels/{vessel_id}")


@router.delete("/vessels/{vessel_id}")
async def delete_vessel(request: Request, vessel_id: int):
    """Proxy DELETE /api/v1/vessels/{id} to backend"""
    return await proxy_service.proxy_request(request, f"vessels/{vessel_id}")


@router.get("/shipments")
async def get_shipments(request: Request):
    """Proxy GET /api/v1/shipments to backend"""
    return await proxy_service.proxy_request(request, "shipments")


@router.post("/shipments")
async def create_shipment(request: Request):
    """Proxy POST /api/v1/shipments to backend"""
    return await proxy_service.proxy_request(request, "shipments")


@router.get("/shipments/{shipment_id}")
async def get_shipment(request: Request, shipment_id: int):
    """Proxy GET /api/v1/shipments/{id} to backend"""
    return await proxy_service.proxy_request(request, f"shipments/{shipment_id}")


@router.put("/shipments/{shipment_id}")
async def update_shipment(request: Request, shipment_id: int):
    """Proxy PUT /api/v1/shipments/{id} to backend"""
    return await proxy_service.proxy_request(request, f"shipments/{shipment_id}")


@router.delete("/shipments/{shipment_id}")
async def delete_shipment(request: Request, shipment_id: int):
    """Proxy DELETE /api/v1/shipments/{id} to backend"""
    return await proxy_service.proxy_request(request, f"shipments/{shipment_id}")


@router.get("/containers")
async def get_containers(request: Request):
    """Proxy GET /api/v1/containers to backend"""
    return await proxy_service.proxy_request(request, "containers")


@router.post("/containers")
async def create_container(request: Request):
    """Proxy POST /api/v1/containers to backend"""
    return await proxy_service.proxy_request(request, "containers")


@router.get("/containers/{container_id}")
async def get_container(request: Request, container_id: int):
    """Proxy GET /api/v1/containers/{id} to backend"""
    return await proxy_service.proxy_request(request, f"containers/{container_id}")


@router.put("/containers/{container_id}")
async def update_container(request: Request, container_id: int):
    """Proxy PUT /api/v1/containers/{id} to backend"""
    return await proxy_service.proxy_request(request, f"containers/{container_id}")


@router.delete("/containers/{container_id}")
async def delete_container(request: Request, container_id: int):
    """Proxy DELETE /api/v1/containers/{id} to backend"""
    return await proxy_service.proxy_request(request, f"containers/{container_id}")


@router.get("/cargo")
async def get_cargo(request: Request):
    """Proxy GET /api/v1/cargo to backend"""
    return await proxy_service.proxy_request(request, "cargo")


@router.post("/cargo")
async def create_cargo(request: Request):
    """Proxy POST /api/v1/cargo to backend"""
    return await proxy_service.proxy_request(request, "cargo")


@router.get("/cargo/{cargo_id}")
async def get_cargo_item(request: Request, cargo_id: int):
    """Proxy GET /api/v1/cargo/{id} to backend"""
    return await proxy_service.proxy_request(request, f"cargo/{cargo_id}")


@router.put("/cargo/{cargo_id}")
async def update_cargo(request: Request, cargo_id: int):
    """Proxy PUT /api/v1/cargo/{id} to backend"""
    return await proxy_service.proxy_request(request, f"cargo/{cargo_id}")


@router.delete("/cargo/{cargo_id}")
async def delete_cargo(request: Request, cargo_id: int):
    """Proxy DELETE /api/v1/cargo/{id} to backend"""
    return await proxy_service.proxy_request(request, f"cargo/{cargo_id}")


@router.get("/clients")
async def get_clients(request: Request):
    """Proxy GET /api/v1/clients to backend"""
    return await proxy_service.proxy_request(request, "clients")


@router.post("/clients")
async def create_client(request: Request):
    """Proxy POST /api/v1/clients to backend"""
    return await proxy_service.proxy_request(request, "clients")


@router.get("/clients/{client_id}")
async def get_client(request: Request, client_id: int):
    """Proxy GET /api/v1/clients/{id} to backend"""
    return await proxy_service.proxy_request(request, f"clients/{client_id}")


@router.put("/clients/{client_id}")
async def update_client(request: Request, client_id: int):
    """Proxy PUT /api/v1/clients/{id} to backend"""
    return await proxy_service.proxy_request(request, f"clients/{client_id}")


@router.delete("/clients/{client_id}")
async def delete_client(request: Request, client_id: int):
    """Proxy DELETE /api/v1/clients/{id} to backend"""
    return await proxy_service.proxy_request(request, f"clients/{client_id}")


@router.get("/health")
async def health_check():
    """Gateway health check"""
    try:
        # Check backend health
        async with httpx.AsyncClient() as client:
            backend_response = await client.get(f"{settings.backend_url}/health", timeout=5.0)
            backend_healthy = backend_response.status_code == 200
    except:
        backend_healthy = False
    
    return {
        "status": "healthy",
        "gateway": "running",
        "backend": "healthy" if backend_healthy else "unhealthy",
        "timestamp": time.time()
    }
