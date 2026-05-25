# Contexto del Proyecto Marine API

## Descripción General

El proyecto es un sistema de gestión logística marítima (Marine API) que permite gestionar:
- Flota de buques (vessels)
- Inventario de contenedores
- Registro de carga
- Directorio de clientes
- Catálogo de puertos
- Planificación de rutas
- Seguimiento de embarques
- Eventos de trazabilidad
- Catálogo de ubicaciones
- Directorio de personal
- Gestión de contratos

## Arquitectura del Proyecto

### Backend (FastAPI + SQLAlchemy + PostgreSQL)
- **Ubicación**: `/home/felatiko/Documentos/universidad/teoria de la informacion/Proyecto/marine-api/`
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Base de datos**: PostgreSQL
- **Modelos**: Ubicados en `/marine-api/app/models/`

### Frontend (Angular)
- **Ubicación**: `/home/felatiko/Documentos/universidad/teoria de la informacion/Proyecto/Front/adminConfigurations/`
- **Framework**: Angular
- **Componentes principales**:
  - `vessel-fleet` - Gestión de flota
  - `client-directory` - Directorio de clientes
  - `container-inventory` - Inventario de contenedores
  - `shipment-traceability` - Trazabilidad de embarques
  - `audit` - Logs de auditoría
  - `users` - Gestión de usuarios
  - `erp` - Sistema ERP general

## Dificultad Principal: Enums y Mayúsculas/Minúsculas

### El Problema

El backend utiliza enums en **MAYÚSCULAS** (según el diccionario de datos), pero hay una inconsistencia entre:
1. **Modelos SQLAlchemy**: Usan mayúsculas (ej: `ACTIVE`, `INACTIVE`, `MAINTENANCE`)
2. **Esquemas Pydantic/FastAPI**: Algunos aún esperan minúsculas (ej: `individual`, `company`)
3. **Frontend**: Debe enviar valores en el formato que espera el esquema Pydantic

### Esquema de Enums del Diccionario de Datos

Todos los enums deben almacenarse en **MAYÚSCULAS** en PostgreSQL:

#### Vessels
- `VesselStatus`: ACTIVE, INACTIVE, MAINTENANCE, DECOMMISSIONED

#### Containers
- `ContainerType`: DRY_20, DRY_40, REEFER_20, REEFER_40, OPEN_TOP, FLAT_RACK, TANK
- `ContainerStatus`: EMPTY, LOADED, IN_TRANSIT, AT_PORT, DELIVERED, DAMAGED, MAINTENANCE

#### Cargo
- `CargoType`: GENERAL, PERISHABLE, DANGEROUS, FRAGILE, LIQUID, BULK
- `CargoStatus`: PENDING, LOADED, IN_TRANSIT, DELIVERED, DAMAGED, LOST

#### Clients
- `ClientType`: INDIVIDUAL, COMPANY

#### Ports
- `PortType`: SEA, RIVER, LAKE

#### Routes
- `RouteStatus`: ACTIVE, INACTIVE, SEASONAL

#### Shipments
- `ShipmentStatus`: PLANNED, BOOKED, LOADING, IN_TRANSIT, AT_PORT, UNLOADING, COMPLETED, CANCELLED, DELAYED

#### Contracts
- `ContractStatus`: DRAFT, ACTIVE, COMPLETED, TERMINATED, SUSPENDED

#### Locations
- `LocationType`: PORT, WAREHOUSE, DEPOT, YARD, OFFICE

#### Personnel
- `PersonnelRole`: GLOBAL_ADMIN, LOCATION_MANAGER, LOGISTICS_OPERATOR, PORT_PERSONNEL, ADMINISTRATIVE, AUDITOR

#### Events
- `EventType`: BOOKING_CREATED, CONTAINER_LOADED, CONTAINER_UNLOADED, VESSEL_DEPARTURE, VESSEL_ARRIVAL, INSPECTION, DAMAGE_REPORTED, CUSTOMS_CLEARANCE, DELAY_REPORTED, STATUS_CHANGE

## Correcciones Realizadas

### Backend (SQLAlchemy Models)
✅ **Completado**: Todos los modelos SQLAlchemy han sido actualizados para usar mayúsculas:
- `vessel.py` - VesselStatus en mayúsculas
- `container.py` - ContainerType y ContainerStatus en mayúsculas
- `cargo.py` - CargoType y CargoStatus en mayúsculas
- `client.py` - ClientType en mayúsculas
- `port.py` - PortType en mayúsculas
- `route.py` - RouteStatus en mayúsculas
- `shipment.py` - ShipmentStatus en mayúsculas
- `contract.py` - ContractStatus en mayúsculas
- `location.py` - LocationType en mayúsculas
- `personnel.py` - PersonnelRole en mayúsculas
- `event.py` - EventType en mayúsculas

### Frontend (vessel-fleet Component)
✅ **Completado**: 
- Actualizada interfaz `NewVesselForm` para aceptar `'ACTIVE' | 'IN_DOCK'`
- Default status cambiado a `'ACTIVE'`
- Botones de selección en HTML actualizados a mayúsculas
- Servicio `vessel.service.ts` ya tenía conversión a mayúsculas en `updateVessel`

### Frontend (erp-config.ts)
✅ **Parcialmente completado**:
- `vesselStatuses`: ACTIVE, INACTIVE, MAINTENANCE, DECOMMISSIONED ✅
- `containerTypes`: DRY_20, DRY_40, REEFER_20, REEFER_40, OPEN_TOP, FLAT_RACK, TANK ✅
- `containerStatuses`: EMPTY, LOADED, IN_TRANSIT, AT_PORT, DELIVERED, DAMAGED, MAINTENANCE ✅
- `cargoTypes`: GENERAL, PERISHABLE, DANGEROUS, FRAGILE, LIQUID, BULK ✅
- `cargoStatuses`: PENDING, LOADED, IN_TRANSIT, DELIVERED, DAMAGED, LOST ✅
- `clientTypes`: individual, company ⚠️ (Revertido a minúsculas - ver problema abajo)
- `portTypes`: SEA, RIVER, LAKE ✅
- `routeStatuses`: ACTIVE, INACTIVE, SEASONAL ✅
- `shipmentStatuses`: PLANNED, BOOKED, LOADING, IN_TRANSIT, AT_PORT, UNLOADING, COMPLETED, CANCELLED, DELAYED ✅
- `eventTypes`: BOOKING_CREATED, CONTAINER_LOADED, CONTAINER_UNLOADED, VESSEL_DEPARTURE, VESSEL_ARRIVAL, INSPECTION, DAMAGE_REPORTED, CUSTOMS_CLEARANCE, DELAY_REPORTED, STATUS_CHANGE ✅
- `locationTypes`: PORT, WAREHOUSE, DEPOT, YARD, OFFICE ✅
- `personnelRoles`: GLOBAL_ADMIN, LOCATION_MANAGER, LOGISTICS_OPERATOR, PORT_PERSONNEL, ADMINISTRATIVE, AUDITOR ✅
- `contractStatuses`: DRAFT, ACTIVE, COMPLETED, TERMINATED, SUSPENDED ✅

- `is_active` en clients: Cambiado de text a checkbox ✅

## Problemas Pendientes

### 1. Inconsistencia en Esquemas Pydantic
**Problema**: El esquema de Pydantic/FastAPI para `client_type` aún espera minúsculas (`individual`, `company`), aunque el modelo SQLAlchemy usa mayúsculas (`INDIVIDUAL`, `COMPANY`).

**Error reportado**:
```json
{
    "detail": [
        {
            "type": "enum",
            "loc": ["body", "client_type"],
            "msg": "Input should be 'individual' or 'company'",
            "input": "INDIVIDUAL"
        }
    ]
}
```

**Solución temporal**: Revertir `clientTypes` en `erp-config.ts` a minúsculas.

**Solución definitiva**: Actualizar el esquema de Pydantic en el backend para usar mayúsculas consistentemente con el modelo SQLAlchemy.

### 2. Campo is_active
**Problema**: El campo `is_active` en el modelo de clientes es un String que espera "true" o "false", pero el frontend estaba enviando "Si" o "No" en español.

**Solución aplicada**: Cambiar el campo de `type: 'text'` a `type: 'checkbox'` en `erp-config.ts` para enviar un booleano.

## Estado Actual

- ✅ Todos los modelos SQLAlchemy usan mayúsculas
- ✅ Frontend erp-config.ts usa mayúsculas (excepto client_types por el problema de Pydantic)
- ✅ Componente vessel-fleet usa mayúsculas
- ⚠️ Esquemas Pydantic/FastAPI necesitan revisión para consistencia
- ⚠️ Necesita migración de base de datos para aplicar cambios de enums

## Próximos Pasos Recomendados

1. **Actualizar esquemas Pydantic**: Revisar y actualizar todos los esquemas Pydantic en el backend para usar mayúsculas consistentemente con los modelos SQLAlchemy.

2. **Ejecutar migración**: Ejecutar una migración de Alembic para actualizar los enums en la base de datos PostgreSQL.

3. **Validar endpoints**: Probar todos los endpoints de creación/actualización para asegurar que aceptan mayúsculas correctamente.

4. **Actualizar frontend**: Una vez que los esquemas Pydantic estén actualizados, cambiar `clientTypes` en `erp-config.ts` a mayúsculas.

## Archivos Clave

### Backend
- `/marine-api/app/models/vessel.py`
- `/marine-api/app/models/container.py`
- `/marine-api/app/models/cargo.py`
- `/marine-api/app/models/client.py`
- `/marine-api/app/models/port.py`
- `/marine-api/app/models/route.py`
- `/marine-api/app/models/shipment.py`
- `/marine-api/app/models/contract.py`
- `/marine-api/app/models/location.py`
- `/marine-api/app/models/personnel.py`
- `/marine-api/app/models/event.py`
- `/marine-api/app/models/base.py`

### Frontend
- `/Front/adminConfigurations/src/app/erp/erp-config.ts`
- `/Front/adminConfigurations/src/app/components/vessel-fleet/vessel-fleet.component.ts`
- `/Front/adminConfigurations/src/app/components/vessel-fleet/vessel-fleet.component.html`
- `/Front/adminConfigurations/src/app/services/vessel.service.ts`
