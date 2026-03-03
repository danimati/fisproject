from fastapi import APIRouter
from app.api.v1 import (
    vessels, containers, cargo, clients, ports, routes,
    locations, personnel, contracts, shipments, events, health
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(vessels.router)
api_router.include_router(containers.router)
api_router.include_router(cargo.router)
api_router.include_router(clients.router)
api_router.include_router(ports.router)
api_router.include_router(routes.router)
api_router.include_router(locations.router)
api_router.include_router(personnel.router)
api_router.include_router(contracts.router)
api_router.include_router(shipments.router)
api_router.include_router(events.router)
api_router.include_router(health.router)