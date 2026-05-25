# Marine API - Diccionario de Datos

## Descripción General
Sistema de gestión marítima para el control de buques, contenedores, carga, envíos, contratos y personal. El sistema utiliza PostgreSQL como base de datos con SQLAlchemy ORM.

## Tablas del Sistema

### 1. vessels
**Descripción:** Información de buques marítimos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| name | VARCHAR(100) | NOT NULL, Indexed | Nombre del buque |
| imo_number | VARCHAR(10) | UNIQUE, NOT NULL, Indexed | Número IMO del buque (7 dígitos) |
| flag_country | VARCHAR(50) | NOT NULL | País de bandera |
| vessel_type | VARCHAR(50) | NOT NULL | Tipo de buque |
| deadweight_tonnage | INTEGER | NOT NULL | Tonelaje de peso muerto |
| gross_tonnage | INTEGER | NOT NULL | Tonelaje bruto |
| length_overall | FLOAT | Nullable | Eslora total (metros) |
| beam | FLOAT | Nullable | Manga (metros) |
| draft | FLOAT | Nullable | Calado (metros) |
| max_containers | INTEGER | Nullable | Capacidad máxima de contenedores |
| max_cargo_weight | FLOAT | Nullable | Peso máximo de carga (toneladas) |
| status | ENUM | NOT NULL, Default: ACTIVE | Estado del buque |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum VesselStatus:**
- `ACTIVE` - Activo
- `INACTIVE` - Inactivo
- `MAINTENANCE` - En mantenimiento
- `DECOMMISSIONED` - Descomisionado

**Relaciones:**
- `shipments` - Uno a muchos con Shipment

---

### 2. containers
**Descripción:** Contenedores de transporte marítimo

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| container_number | VARCHAR(11) | UNIQUE, NOT NULL, Indexed | Número de contenedor |
| container_type | ENUM | NOT NULL | Tipo de contenedor |
| max_weight | FLOAT | NOT NULL | Peso máximo (kg) |
| max_volume | FLOAT | NOT NULL | Volumen máximo (m³) |
| current_weight | FLOAT | Default: 0.0 | Peso actual (kg) |
| current_volume | FLOAT | Default: 0.0 | Volumen actual (m³) |
| status | ENUM | NOT NULL, Default: EMPTY | Estado del contenedor |
| current_location_id | UUID | FK → locations.id | Ubicación actual |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum ContainerType:**
- `DRY_20` - Contenedor seco 20 pies
- `DRY_40` - Contenedor seco 40 pies
- `REEFER_20` - Refrigerado 20 pies
- `REEFER_40` - Refrigerado 40 pies
- `OPEN_TOP` - Techo abierto
- `FLAT_RACK` - Plataforma plana
- `TANK` - Tanque

**Enum ContainerStatus:**
- `EMPTY` - Vacío
- `LOADED` - Cargado
- `IN_TRANSIT` - En tránsito
- `AT_PORT` - En puerto
- `DELIVERED` - Entregado
- `DAMAGED` - Dañado
- `MAINTENANCE` - En mantenimiento

**Relaciones:**
- `current_location` - Muchos a uno con Location
- `cargo_items` - Uno a muchos con Cargo

---

### 3. cargo
**Descripción:** Información de carga y mercancías

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| tracking_number | VARCHAR(50) | UNIQUE, NOT NULL, Indexed | Número de seguimiento |
| description | TEXT | NOT NULL | Descripción de la carga |
| cargo_type | ENUM | NOT NULL | Tipo de carga |
| weight | FLOAT | NOT NULL | Peso (kg) |
| volume | FLOAT | NOT NULL | Volumen (m³) |
| is_fragile | BOOLEAN | Default: False | Es frágil |
| is_dangerous | BOOLEAN | Default: False | Es peligroso |
| temperature_required | FLOAT | Nullable | Temperatura requerida (°C) |
| packaging_type | VARCHAR(50) | Nullable | Tipo de embalaje |
| value | FLOAT | Nullable | Valor en USD |
| status | ENUM | NOT NULL, Default: PENDING | Estado de la carga |
| client_id | UUID | FK → clients.id, NOT NULL | Cliente propietario |
| container_id | UUID | FK → containers.id | Contenedor asignado |
| shipment_id | UUID | FK → shipments.id | Envío asignado |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum CargoType:**
- `GENERAL` - General
- `PERISHABLE` - Perecedero
- `DANGEROUS` - Peligroso
- `FRAGILE` - Frágil
- `LIQUID` - Líquido
- `BULK` - A granel

**Enum CargoStatus:**
- `PENDING` - Pendiente
- `LOADED` - Cargado
- `IN_TRANSIT` - En tránsito
- `DELIVERED` - Entregado
- `DAMAGED` - Dañado
- `LOST` - Perdido

**Relaciones:**
- `client` - Muchos a uno con Client
- `container` - Muchos a uno con Container
- `shipment` - Muchos a uno con Shipment

---

### 4. clients
**Descripción:** Información de clientes

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| name | VARCHAR(100) | NOT NULL, Indexed | Nombre del cliente |
| client_type | ENUM | NOT NULL | Tipo de cliente |
| tax_id | VARCHAR(50) | UNIQUE, Indexed | Identificación fiscal |
| email | VARCHAR(100) | UNIQUE, Indexed | Correo electrónico |
| phone | VARCHAR(20) | Nullable | Teléfono |
| address | TEXT | Nullable | Dirección |
| country | VARCHAR(50) | NOT NULL | País |
| contact_person | VARCHAR(100) | Nullable | Persona de contacto |
| is_active | VARCHAR(10) | NOT NULL, Default: "true" | Estado activo |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum ClientType:**
- `INDIVIDUAL` - Individual
- `COMPANY` - Empresa

**Relaciones:**
- `cargo_items` - Uno a muchos con Cargo
- `contracts` - Uno a muchos con Contract

---

### 5. ports
**Descripción:** Puertos marítimos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| name | VARCHAR(100) | NOT NULL, Indexed | Nombre del puerto |
| code | VARCHAR(5) | UNIQUE, NOT NULL, Indexed | Código UN/LOCODE |
| country | VARCHAR(50) | NOT NULL | País |
| city | VARCHAR(100) | NOT NULL | Ciudad |
| latitude | FLOAT | NOT NULL | Latitud |
| longitude | FLOAT | NOT NULL | Longitud |
| port_type | ENUM | NOT NULL | Tipo de puerto |
| max_vessel_draft | FLOAT | Nullable | Calado máximo de buques (m) |
| container_terminals | INTEGER | Default: 1 | Número de terminales |
| is_active | BOOLEAN | NOT NULL, Default: True | Estado activo |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum PortType:**
- `SEA` - Marítimo
- `RIVER` - Fluvial
- `LAKE` - Lacustre

**Relaciones:**
- `departure_routes` - Uno a muchos con Route (como puerto de salida)
- `arrival_routes` - Uno a muchos con Route (como puerto de llegada)

---

### 6. routes
**Descripción:** Rutas marítimas entre puertos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| name | VARCHAR(100) | NOT NULL, Indexed | Nombre de la ruta |
| route_code | VARCHAR(20) | UNIQUE, NOT NULL, Indexed | Código de ruta |
| departure_port_id | UUID | FK → ports.id, NOT NULL | Puerto de salida |
| arrival_port_id | UUID | FK → ports.id, NOT NULL | Puerto de llegada |
| distance | FLOAT | NOT NULL | Distancia (millas náuticas) |
| estimated_duration | INTEGER | NOT NULL | Duración estimada (horas) |
| status | ENUM | NOT NULL, Default: ACTIVE | Estado de la ruta |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum RouteStatus:**
- `ACTIVE` - Activa
- `INACTIVE` - Inactiva
- `SEASONAL` - Estacional

**Relaciones:**
- `departure_port` - Muchos a uno con Port
- `arrival_port` - Muchos a uno con Port
- `shipments` - Uno a muchos con Shipment

---

### 7. shipments
**Descripción:** Envíos y embarques

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| shipment_number | VARCHAR(50) | UNIQUE, NOT NULL, Indexed | Número de envío |
| bill_of_lading | VARCHAR(50) | UNIQUE, Indexed | Conocimiento de embarque |
| vessel_id | UUID | FK → vessels.id, NOT NULL | Buque asignado |
| route_id | UUID | FK → routes.id, NOT NULL | Ruta asignada |
| contract_id | UUID | FK → contracts.id | Contrato asociado |
| departure_date | DATETIME | NOT NULL | Fecha de salida |
| estimated_arrival | DATETIME | NOT NULL | Llegada estimada |
| actual_arrival | DATETIME | Nullable | Llegada real |
| status | ENUM | NOT NULL, Default: PLANNED | Estado del envío |
| total_containers | INTEGER | Default: 0 | Total de contenedores |
| total_weight | FLOAT | Default: 0.0 | Peso total (toneladas) |
| special_instructions | TEXT | Nullable | Instrucciones especiales |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum ShipmentStatus:**
- `PLANNED` - Planificado
- `BOOKED` - Reservado
- `LOADING` - Cargando
- `IN_TRANSIT` - En tránsito
- `AT_PORT` - En puerto
- `UNLOADING` - Descargando
- `COMPLETED` - Completado
- `CANCELLED` - Cancelado
- `DELAYED` - Retrasado

**Relaciones:**
- `vessel` - Muchos a uno con Vessel
- `route` - Muchos a uno con Route
- `contract` - Muchos a uno con Contract
- `cargo_items` - Uno a muchos con Cargo
- `events` - Uno a muchos con Event

---

### 8. contracts
**Descripción:** Contratos con clientes

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| contract_number | VARCHAR(50) | UNIQUE, NOT NULL, Indexed | Número de contrato |
| title | VARCHAR(200) | NOT NULL | Título del contrato |
| client_id | UUID | FK → clients.id, NOT NULL | Cliente |
| contract_type | VARCHAR(50) | NOT NULL | Tipo de contrato |
| total_value | FLOAT | NOT NULL | Valor total (USD) |
| currency | VARCHAR(3) | Default: "USD" | Moneda |
| start_date | DATETIME | NOT NULL | Fecha de inicio |
| end_date | DATETIME | NOT NULL | Fecha de fin |
| terms_and_conditions | TEXT | Nullable | Términos y condiciones |
| status | ENUM | NOT NULL, Default: DRAFT | Estado del contrato |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum ContractStatus:**
- `DRAFT` - Borrador
- `ACTIVE` - Activo
- `COMPLETED` - Completado
- `TERMINATED` - Terminado
- `SUSPENDED` - Suspendido

**Relaciones:**
- `client` - Muchos a uno con Client
- `shipments` - Uno a muchos con Shipment

---

### 9. locations
**Descripción:** Ubicaciones físicas (puertos, almacenes, depósitos, etc.)

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| name | VARCHAR(100) | NOT NULL, Indexed | Nombre de la ubicación |
| location_code | VARCHAR(20) | UNIQUE, NOT NULL, Indexed | Código de ubicación |
| location_type | ENUM | NOT NULL | Tipo de ubicación |
| address | TEXT | Nullable | Dirección |
| city | VARCHAR(100) | NOT NULL | Ciudad |
| country | VARCHAR(50) | NOT NULL | País |
| latitude | FLOAT | Nullable | Latitud |
| longitude | FLOAT | Nullable | Longitud |
| contact_phone | VARCHAR(20) | Nullable | Teléfono de contacto |
| contact_email | VARCHAR(100) | Nullable | Email de contacto |
| is_active | BOOLEAN | NOT NULL, Default: True | Estado activo |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum LocationType:**
- `PORT` - Puerto
- `WAREHOUSE` - Almacén
- `DEPOT` - Depósito
- `YARD` - Patio
- `OFFICE` - Oficina

**Relaciones:**
- `personnel` - Uno a muchos con Personnel
- `containers` - Uno a muchos con Container

---

### 10. personnel
**Descripción:** Personal y empleados del sistema

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| first_name | VARCHAR(50) | NOT NULL | Nombre |
| last_name | VARCHAR(50) | NOT NULL | Apellido |
| email | VARCHAR(100) | UNIQUE, NOT NULL, Indexed | Correo electrónico |
| phone | VARCHAR(20) | Nullable | Teléfono |
| role | ENUM | NOT NULL | Rol del empleado |
| employee_id | VARCHAR(20) | UNIQUE, NOT NULL, Indexed | ID de empleado |
| department | VARCHAR(50) | Nullable | Departamento |
| location_id | UUID | FK → locations.id | Ubicación asignada |
| responsibilities | TEXT | Nullable | Responsabilidades |
| is_active | BOOLEAN | NOT NULL, Default: True | Estado activo |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum PersonnelRole:**
- `GLOBAL_ADMIN` - Administrador global
- `LOCATION_MANAGER` - Gerente de ubicación
- `LOGISTICS_OPERATOR` - Operador logístico
- `PORT_PERSONNEL` - Personal de puerto
- `ADMINISTRATIVE` - Administrativo
- `AUDITOR` - Auditor

**Relaciones:**
- `location` - Muchos a uno con Location
- `events` - Uno a muchos con Event

---

### 11. events
**Descripción:** Registro de eventos en el sistema

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | UUID | PK, Indexed | Identificador único autogenerado |
| event_type | ENUM | NOT NULL | Tipo de evento |
| shipment_id | UUID | FK → shipments.id, NOT NULL | Envío relacionado |
| container_id | UUID | FK → containers.id | Contenedor relacionado |
| personnel_id | UUID | FK → personnel.id | Personal responsable |
| event_date | DATETIME | NOT NULL | Fecha del evento |
| location | VARCHAR(200) | Nullable | Ubicación del evento |
| description | TEXT | NOT NULL | Descripción del evento |
| observations | TEXT | Nullable | Observaciones |
| created_at | DATETIME | NOT NULL, Default: NOW() | Fecha de creación |
| updated_at | DATETIME | NOT NULL, Default: NOW() | Fecha de última actualización |

**Enum EventType:**
- `BOOKING_CREATED` - Reserva creada
- `CONTAINER_LOADED` - Contenedor cargado
- `CONTAINER_UNLOADED` - Contenedor descargado
- `VESSEL_DEPARTURE` - Salida de buque
- `VESSEL_ARRIVAL` - Llegada de buque
- `INSPECTION` - Inspección
- `DAMAGE_REPORTED` - Daño reportado
- `CUSTOMS_CLEARANCE` - Aduana
- `DELAY_REPORTED` - Retraso reportado
- `STATUS_CHANGE` - Cambio de estado

**Relaciones:**
- `shipment` - Muchos a uno con Shipment
- `container` - Muchos a uno con Container
- `responsible_person` - Muchos a uno con Personnel

---

## Diagrama de Relaciones

```
clients (1) ────────< (N) cargo
  │                     │
  │                     ├─> container (1)
  │                     └─> shipment (1)
  │
  └─> contracts (1) ────< (N) shipments
                           │
                           ├─> vessel (1)
                           ├─> route (1)
                           └─> events (N)

vessels (1) ──────────────< (N) shipments

ports (1) ────────────────< (N) routes
  │                         │
  │                         └─> shipments (N)
  │

routes (1) ────────────────< (N) shipments

locations (1) ────────────< (N) personnel
  │
  └─> containers (N)

personnel (1) ────────────< (N) events
```

## Convenciones

- **PK**: Primary Key (Clave primaria)
- **FK**: Foreign Key (Clave foránea)
- **UNIQUE**: Valor único
- **INDEXED**: Campo indexado
- **NOT NULL**: Campo obligatorio
- **Default**: Valor por defecto
- **Nullable**: Campo opcional

## Tipos de Datos

- **UUID**: Identificador único universal (PostgreSQL UUID)
- **VARCHAR(n)**: Cadena de texto de longitud máxima n
- **TEXT**: Cadena de texto de longitud variable
- **INTEGER**: Número entero
- **FLOAT**: Número decimal (precisión simple)
- **BOOLEAN**: Valor booleano (true/false)
- **DATETIME**: Fecha y hora
- **ENUM**: Enumeración de valores predefinidos

## Notas

1. Todos los modelos heredan de `BaseModel` que incluye:
   - `id`: UUID autogenerado como clave primaria
   - `created_at`: Fecha de creación automática
   - `updated_at`: Fecha de última actualización automática

2. Los valores de los ENUMs se almacenan en mayúsculas en PostgreSQL.

3. Los campos con FK son opcionales a menos que se especifique NOT NULL.

4. Los campos de texto (TEXT) no tienen límite de longitud específico.

5. Las relaciones bidireccionales están configuradas con `back_populates` en SQLAlchemy.
