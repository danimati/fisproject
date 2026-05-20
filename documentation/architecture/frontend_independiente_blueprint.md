# Frontend Independiente ERP - Blueprint Técnico

## 1. Objetivo

Definir un frontend independiente del gateway existente, enfocado en autenticación propia de sesión local y en la interacción con los endpoints del sistema marítimo/logístico. Este frontend debe ser cohesivo con las maquetas de `stitch escritorio` y respetar el flujo funcional descrito en `conceptualidad.txt`.

## 2. Alcance funcional

El nuevo frontend cubrirá:
- Inicio de sesión independiente.
- Dashboard global.
- CRUD completo por entidad.
- Vistas de detalle, listado, creación y edición.
- Consultas relacionales entre entidades.
- Manejo de errores y validaciones de negocio.
- Persistencia de sesión con token aislado del gateway principal.

## 3. Supuesto clave de integración

El backend core de `marine-api` no expone un login propio. La autenticación operacional del sistema hoy está centralizada en el gateway. Por tanto, el nuevo frontend independiente puede operar bajo uno de estos dos esquemas:

- Esquema recomendado actual: login contra el gateway, con sesión y almacenamiento local separados del frontend del gateway principal.
- Esquema futuro: agregar un auth service dedicado al backend core o un servicio de identidad propio.

Mientras el backend core no exponga login, el frontend independiente debe usar el gateway solo como proveedor de autenticación y proxy, sin compartir sesión con la UI existente.

## 4. Mapa completo de API

### 4.1 Backend core - `marine-api`

Todos los endpoints viven bajo `/api/v1`.

#### Health
- `GET /api/v1/health`
- Respuesta: estado del servicio, timestamp, nombre del servicio.
- Uso: indicador visual de salud del backend.

- `GET /api/v1/ready`
- Respuesta: estado de conectividad con la base de datos.
- Uso: validación del dashboard y página de estado.

#### Vessels
- `POST /api/v1/vessels/`
  - Body: `VesselCreate`
  - Validaciones: IMO de 7 dígitos, campos obligatorios, enum de estado.
- `GET /api/v1/vessels/`
  - Query: `page`, `size`, `status`, `vessel_type`, `flag_country`
  - Respuesta: paginada.
- `GET /api/v1/vessels/{vessel_id}`
  - Respuesta: `VesselResponse`.
- `PUT /api/v1/vessels/{vessel_id}`
  - Body: `VesselUpdate`
- `DELETE /api/v1/vessels/{vessel_id}`

#### Containers
- `POST /api/v1/containers/`
- `GET /api/v1/containers/`
  - Query: `page`, `size`, `status`, `container_type`, `current_location_id`
- `GET /api/v1/containers/{container_id}`
- `PUT /api/v1/containers/{container_id}`
- `DELETE /api/v1/containers/{container_id}`
- `GET /api/v1/containers/number/{container_number}`

#### Cargo
- `POST /api/v1/cargo/`
- `GET /api/v1/cargo/`
  - Query: `page`, `size`, `status`, `cargo_type`, `client_id`, `container_id`, `shipment_id`
- `GET /api/v1/cargo/{cargo_id}`
- `PUT /api/v1/cargo/{cargo_id}`
- `DELETE /api/v1/cargo/{cargo_id}`
- `GET /api/v1/cargo/tracking/{tracking_number}`

#### Clients
- `POST /api/v1/clients/`
- `GET /api/v1/clients/`
  - Query: `page`, `size`, `client_type`, `country`, `is_active`
- `GET /api/v1/clients/{client_id}`
- `PUT /api/v1/clients/{client_id}`
- `DELETE /api/v1/clients/{client_id}`
- `GET /api/v1/clients/email/{email}`
- `GET /api/v1/clients/tax/{tax_id}`

#### Ports
- `POST /api/v1/ports/`
- `GET /api/v1/ports/`
  - Query: `page`, `size`, `country`, `port_type`, `is_active`
- `GET /api/v1/ports/{port_id}`
- `PUT /api/v1/ports/{port_id}`
- `DELETE /api/v1/ports/{port_id}`
- `GET /api/v1/ports/code/{port_code}`

#### Routes
- `POST /api/v1/routes/`
- `GET /api/v1/routes/`
  - Query: `page`, `size`, `departure_port_id`, `arrival_port_id`, `status`
- `GET /api/v1/routes/{route_id}`
- `PUT /api/v1/routes/{route_id}`
- `DELETE /api/v1/routes/{route_id}`
- `GET /api/v1/routes/code/{route_code}`

#### Shipments
- `POST /api/v1/shipments/`
- `GET /api/v1/shipments/`
  - Query: `page`, `size`, `vessel_id`, `route_id`, `contract_id`, `status`
- `GET /api/v1/shipments/{shipment_id}`
- `PUT /api/v1/shipments/{shipment_id}`
- `DELETE /api/v1/shipments/{shipment_id}`
- `GET /api/v1/shipments/number/{shipment_number}`
- `GET /api/v1/shipments/bol/{bill_of_lading}`

#### Events
- `POST /api/v1/events/`
- `GET /api/v1/events/`
  - Query: `page`, `size`, `shipment_id`, `container_id`, `personnel_id`, `event_type`
- `GET /api/v1/events/{event_id}`
- `PUT /api/v1/events/{event_id}`
- `DELETE /api/v1/events/{event_id}`
- `GET /api/v1/events/shipment/{shipment_id}`
- `GET /api/v1/events/container/{container_id}`

#### Locations
- `POST /api/v1/locations/`
- `GET /api/v1/locations/`
  - Query: `page`, `size`, `location_type`, `country`, `city`, `is_active`
- `GET /api/v1/locations/{location_id}`
- `PUT /api/v1/locations/{location_id}`
- `DELETE /api/v1/locations/{location_id}`
- `GET /api/v1/locations/code/{location_code}`

#### Personnel
- `POST /api/v1/personnel/`
- `GET /api/v1/personnel/`
  - Query: `page`, `size`, `role`, `location_id`, `department`, `is_active`
- `GET /api/v1/personnel/{personnel_id}`
- `PUT /api/v1/personnel/{personnel_id}`
- `DELETE /api/v1/personnel/{personnel_id}`
- `GET /api/v1/personnel/email/{email}`
- `GET /api/v1/personnel/employee/{employee_id}`

#### Contracts
- `POST /api/v1/contracts/`
- `GET /api/v1/contracts/`
  - Query: `page`, `size`, `client_id`, `contract_type`, `status`
- `GET /api/v1/contracts/{contract_id}`
- `PUT /api/v1/contracts/{contract_id}`
- `DELETE /api/v1/contracts/{contract_id}`
- `GET /api/v1/contracts/number/{contract_number}`

### 4.2 Gateway - autenticación y administración

#### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

#### Admin
- `GET /admin/stats`
- `GET /admin/users`
- `GET /admin/users/{user_id}/sessions`
- `GET /admin/audit/logs`
- `GET /admin/security/blocked-ips`
- `POST /admin/security/unblock-ip/{ip_hash}`
- `DELETE /admin/users/{user_id}`
- `POST /admin/users/{user_id}/activate`
- `GET /admin/performance/metrics`

#### CRUD interno de seguridad
- `GET /crud/roles`
- `GET /crud/roles/{rol_id}`
- `POST /crud/roles`
- `PUT /crud/roles/{rol_id}`
- `DELETE /crud/roles/{rol_id}`
- `GET /crud/role-users`
- `GET /crud/role-users/{role_user_id}`
- `POST /crud/role-users`
- `PUT /crud/role-users/{role_user_id}`
- `DELETE /crud/role-users/{role_user_id}`
- `GET /crud/users/{user_id}/roles`
- `GET /crud/roles/{rol_id}/users`
- `GET /crud/user-permits`
- `GET /crud/user-permits/{user_permit_id}`
- `POST /crud/user-permits`
- `PUT /crud/user-permits/{user_permit_id}`
- `DELETE /crud/user-permits/{user_permit_id}`

## 5. Relaciones entre modelos

### Núcleo operativo
- `Shipment` depende de `Vessel` y `Route`.
- `Shipment` puede depender de `Contract`.
- `Cargo` depende de `Client` y opcionalmente de `Container` y `Shipment`.
- `Event` depende de `Shipment`, opcionalmente de `Container` y `Personnel`.
- `Route` depende de dos `Port`: salida y llegada.
- `Personnel` depende de `Location`.
- `Container` puede referenciar `Location` actual.

### Catálogos y trazabilidad
- `Port`, `Location`, `Personnel`, `Client`, `Contract` funcionan como catálogos maestros y entidades operativas.
- `Event` es el eje de trazabilidad auditable.

### Seguridad
- `User`, `Rol`, `Permission`, `RolUser`, `UserPermit`, `UserSession`, `AuditLog`, `RateLimit` viven en la BD del gateway.
- Estos modelos no deben mezclarse con el modelo operativo del backend core.

## 6. Esquema inicial del nuevo frontend

### Estructura sugerida
- `src/app/core/`
- `src/app/shared/`
- `src/app/auth/`
- `src/app/layout/`
- `src/app/dashboard/`
- `src/app/features/vessels/`
- `src/app/features/containers/`
- `src/app/features/cargo/`
- `src/app/features/clients/`
- `src/app/features/ports/`
- `src/app/features/routes/`
- `src/app/features/shipments/`
- `src/app/features/events/`
- `src/app/features/locations/`
- `src/app/features/personnel/`
- `src/app/features/contracts/`
- `src/app/features/security/`
- `src/app/features/admin/`

### Rutas de navegación
- `/login`
- `/dashboard`
- `/vessels`
- `/vessels/new`
- `/vessels/:id`
- `/vessels/:id/edit`
- `/containers`
- `/containers/new`
- `/containers/:id`
- `/containers/:id/edit`
- `/cargo`
- `/cargo/new`
- `/cargo/:id`
- `/cargo/:id/edit`
- `/clients`
- `/clients/new`
- `/clients/:id`
- `/clients/:id/edit`
- `/ports`
- `/ports/new`
- `/ports/:id`
- `/ports/:id/edit`
- `/routes`
- `/routes/new`
- `/routes/:id`
- `/routes/:id/edit`
- `/shipments`
- `/shipments/new`
- `/shipments/:id`
- `/shipments/:id/edit`
- `/events`
- `/events/new`
- `/events/:id`
- `/events/:id/edit`
- `/locations`
- `/locations/new`
- `/locations/:id`
- `/locations/:id/edit`
- `/personnel`
- `/personnel/new`
- `/personnel/:id`
- `/personnel/:id/edit`
- `/contracts`
- `/contracts/new`
- `/contracts/:id`
- `/contracts/:id/edit`
- `/security/users`
- `/security/roles`
- `/security/permissions`
- `/security/audit`
- `/admin/stats`
- `/admin/performance`
- `/admin/blocked-ips`

## 7. Asignación de componentes por entidad

### Autenticación
- `LoginPageComponent`
- `ForgotPasswordComponent` si se habilita luego.

### Dashboard
- `DashboardPageComponent`
- `KpiCardsComponent`
- `ActivityFeedComponent`
- `HealthStatusWidgetComponent`

### CRUD operativo
Cada entidad debería tener tres piezas reutilizables:
- `EntityListComponent`
- `EntityDetailComponent`
- `EntityFormComponent`

Y una página contenedora por módulo:
- `VesselsPageComponent`
- `ContainersPageComponent`
- `CargoPageComponent`
- `ClientsPageComponent`
- `PortsPageComponent`
- `RoutesPageComponent`
- `ShipmentsPageComponent`
- `EventsPageComponent`
- `LocationsPageComponent`
- `PersonnelPageComponent`
- `ContractsPageComponent`

### Seguridad y administración
- `UsersAdminPageComponent`
- `RolesAdminPageComponent`
- `PermissionsAdminPageComponent`
- `AuditLogPageComponent`
- `BlockedIpsPageComponent`
- `SystemStatsPageComponent`

## 8. Flujo de autenticación

1. El usuario entra a `/login`.
2. Envía credenciales al endpoint de login del gateway.
3. El frontend guarda `access_token` y `refresh_token` en una clave local propia, por ejemplo:
   - `erp_access_token`
   - `erp_refresh_token`
4. `AuthGuard` protege todas las rutas internas.
5. `HttpInterceptor` agrega `Authorization: Bearer <token>` a cada petición.
6. Si el token expira, el interceptor intenta refrescar usando `/auth/refresh`.
7. Si el refresh falla, se limpia la sesión local y se redirige a `/login`.
8. Al cerrar sesión, se invoca `/auth/logout`, pero la UI debe limpiar su sesión incluso si el backend falla para no quedar bloqueada.

## 9. Validaciones por entidad

### Vessels
- IMO de 7 dígitos.
- Tonelajes y medidas numéricas positivas.
- Estado obligatorio.

### Containers
- `container_number` de 11 caracteres.
- `current_weight` no puede exceder `max_weight`.
- `current_volume` no puede exceder `max_volume`.

### Cargo
- `weight` y `volume` positivos.
- `value` no negativo.
- `client_id` obligatorio.
- `container_id` y `shipment_id` opcionales según contexto.

### Clients
- Email con formato válido.
- `tax_id` único.
- `is_active` normalizado.

### Ports
- `code` de 5 caracteres.
- Latitud y longitud dentro de rango geográfico válido.
- Terminales mínimo 1.

### Routes
- Código de ruta entre 3 y 20 caracteres.
- Distancia y duración positivas.
- Puertos de salida y llegada obligatorios.

### Shipments
- Número entre 5 y 50 caracteres.
- Fechas coherentes: llegada estimada posterior a salida.
- `vessel_id` y `route_id` obligatorios.

### Events
- Descripción no vacía.
- `shipment_id` obligatorio.
- `event_date` obligatorio.

### Locations
- Código entre 3 y 20 caracteres.
- Coordenadas opcionales, pero válidas si existen.

### Personnel
- Email válido.
- `employee_id` entre 3 y 20 caracteres.
- `location_id` opcional pero vinculable.

### Contracts
- Número entre 5 y 50 caracteres.
- `total_value` positivo.
- Moneda ISO 4217 de 3 letras.
- `end_date` posterior a `start_date`.

## 10. Guía visual basada en `stitch escritorio`

Las maquetas marcan una identidad visual consistente:
- Barra lateral compacta, clara, con navegación por módulos.
- Header superior con buscador y accesos rápidos.
- Tarjetas KPI con acento amarillo y verde/gris suaves.
- Fondos claros con paneles blancos y bordes suaves.
- Secciones de detalle con paneles laterales y vistas maestras/detalle.
- Formularios con jerarquía visual limpia y CTA claros.

Paleta sugerida:
- Primario: amarillo/logístico.
- Secundario: gris petróleo / verde azulado.
- Estado OK: verde suave.
- Estado alerta: ámbar/naranja.
- Fondo: gris muy claro o marfil.

## 11. Independencia frente al gateway existente

Este frontend debe ser independiente del frontend actual del gateway en:
- URLs del frontend.
- Clave local de sesión.
- Estado global.
- Menú y layout.
- Ciclo de vida de la sesión.

Pero es interoperable con el mismo ecosistema porque:
- Usa el gateway como autenticador o proxy de sesión.
- Consume los mismos endpoints del backend core.
- Comparte el modelo de negocio y validaciones.

## 12. Prioridad de implementación

Orden recomendado para construir el frontend:
1. Login y sesión.
2. Shell de layout y dashboard.
3. Vessels, Containers, Cargo.
4. Clients, Ports, Routes.
5. Shipments, Events.
6. Locations, Personnel, Contracts.
7. Security admin y auditoría.
8. Health, ready y métricas.

## 13. Observación técnica

Hoy el backend core no tiene un login propio, así que el frontend independiente no puede autenticarse contra el backend sin ayuda del gateway o sin un auth service adicional. El mapa anterior deja lista la estructura para el frontend, pero la autenticación real debe apoyarse en el gateway o en una futura capa de identidad dedicada.
