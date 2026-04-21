# Informe de Ejecución de Pruebas - Rendimiento

## 1. Objetivo
Evaluar el comportamiento del sistema bajo carga operativa controlada, midiendo latencia, throughput, estabilidad de respuesta y consumo estimado de recursos en los flujos de autenticación, consulta y verificación de disponibilidad, con énfasis en la interacción entre gateway, backend y servicios de datos.

---

## 2. Alcance
La evaluación de rendimiento cubrió los siguientes flujos y componentes:

- Endpoints de autenticación:
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `GET /auth/me`
- Gateway general
- Rutas proxificadas hacia el backend:
  - `GET /api/v1/vessels`
  - `GET /api/v1/containers`
  - `GET /api/v1/cargo`
- Endpoint administrativo:
  - `GET /admin/stats`
- Endpoints de disponibilidad:
  - `GET /health`
  - `GET /ready`

La prueba se enfocó en operaciones de lectura predominante, con carga concurrente baja-media controlada entre 10 y 30 usuarios.

---

## 3. Insumos utilizados
- Arquitectura de despliegue del sistema en Docker
- Flujo de petición: frontend → gateway → backend → PostgreSQL / Redis
- Documentación de endpoints críticos
- Configuración de gateway, backend, Redis y PostgreSQL
- Patrón de enrutamiento `/api/v1/*` mediante proxy interno
- Herramienta de referencia para pruebas de carga: **k6**

---

## 4. Entorno de prueba
- Sistema operativo: Ubuntu
- Modelo de despliegue: Docker Compose
- Servicios involucrados:
  - Gateway API
  - Core Backend API
  - PostgreSQL de seguridad
  - PostgreSQL de negocio / nube
  - Redis de seguridad
  - Redis de núcleo
- Red: bridge network de Docker con descubrimiento interno de servicios
- Validación de rutas a través de gateway
- Entorno de ejecución: local controlado

---

## 5. Criterios y métricas evaluadas

### Criterios técnicos
- Tiempo de respuesta de endpoints expuestos por gateway
- Sobrecarga introducida por proxy interno hacia backend
- Impacto de validaciones de seguridad en endpoints autenticados
- Comportamiento de consultas de dominio bajo concurrencia moderada
- Sensibilidad de latencia frente a dependencia de base de datos externa
- Estabilidad de endpoints de salud bajo carga simultánea

### Métricas
- Tiempo promedio de respuesta
- Latencia percentil 95 (p95)
- Throughput (req/s)
- Tasa de error
- Uso estimado de CPU y RAM por contenedor
- Latencia por endpoint
- Degradación bajo 10, 20 y 30 usuarios concurrentes

---

## 6. Escenarios ejecutados

### Escenarios de autenticación
- PERF-01: Ejecución concurrente de `POST /auth/login`
- PERF-02: Ejecución concurrente de `POST /auth/refresh`
- PERF-03: Consulta autenticada de `GET /auth/me`

### Escenarios de consulta operativa
- PERF-04: Consulta concurrente de `GET /api/v1/vessels`
- PERF-05: Consulta concurrente de `GET /api/v1/containers`
- PERF-06: Consulta concurrente de `GET /api/v1/cargo`
- PERF-07: Consulta de `GET /admin/stats`

### Escenarios de disponibilidad
- PERF-08: Verificación repetida de `GET /health`
- PERF-09: Verificación repetida de `GET /ready`

### Escenarios de carga progresiva
- PERF-10: Carga con 10 usuarios concurrentes
- PERF-11: Carga con 20 usuarios concurrentes
- PERF-12: Carga con 30 usuarios concurrentes

---

## 7. Resultados obtenidos

### Resultados por endpoint

| Endpoint | Tiempo promedio | p95 | Throughput | Tasa de error | Observación técnica |
|----------|-----------------|-----|------------|---------------|---------------------|
| `POST /auth/login` | 420 ms | 810 ms | 18 req/s | 2.1% | Impactado por hashing, validación JWT y acceso a DB de seguridad |
| `POST /auth/refresh` | 310 ms | 620 ms | 21 req/s | 1.3% | Mejor desempeño que login, pero dependiente de validación de token |
| `GET /auth/me` | 260 ms | 540 ms | 24 req/s | 0.8% | Sobrecarga moderada por middleware de autenticación |
| `GET /api/v1/vessels` | 690 ms | 1320 ms | 12 req/s | 4.6% | Afectado por proxy y dependencia del backend |
| `GET /api/v1/containers` | 760 ms | 1490 ms | 11 req/s | 5.1% | Latencia acumulada gateway → backend → datos |
| `GET /api/v1/cargo` | 840 ms | 1680 ms | 9 req/s | 6.4% | Endpoint más sensible por volumen de datos consultados |
| `GET /admin/stats` | 510 ms | 980 ms | 15 req/s | 2.7% | Sobrecarga por consulta agregada y validaciones de acceso |
| `GET /health` | 95 ms | 180 ms | 40 req/s | 0.0% | Respuesta estable y rápida |
| `GET /ready` | 120 ms | 240 ms | 36 req/s | 0.4% | Ligera variación por chequeo de dependencias |

---

### Resultados por nivel de concurrencia

| Usuarios concurrentes | Latencia promedio global | p95 global | Throughput global | Tasa de error |
|-----------------------|--------------------------|------------|-------------------|---------------|
| 10 | 340 ms | 710 ms | 28 req/s | 1.2% |
| 20 | 590 ms | 1180 ms | 31 req/s | 3.8% |
| 30 | 810 ms | 1610 ms | 29 req/s | 6.1% |

---

### Uso estimado de recursos

| Componente | CPU estimada | RAM estimada | Observación técnica |
|-----------|--------------|--------------|---------------------|
| Gateway Service | 68% | 420 MB | Principal punto de presión por validación, proxy y control de seguridad |
| Core Backend Service | 74% | 510 MB | Afectado por consultas operativas concurrentes |
| PostgreSQL Seguridad | 41% | 290 MB | Carga moderada por autenticación y auditoría |
| PostgreSQL Core / Cloud DB | 77% | N/D administrado | Principal fuente de latencia externa |
| Redis Seguridad | 22% | 110 MB | Estable, con carga baja-media |
| Redis Core | 18% | 95 MB | Bajo impacto en esta carga |

---

### Hallazgos técnicos principales

| Hallazgo | Impacto |
|----------|---------|
| Centralización del tráfico en gateway | Alto |
| Sobrecarga por proxy interno `/api/v1/*` | Medio-Alto |
| Dependencia de base de datos externa para consultas de negocio | Alto |
| Incremento no lineal de latencia a partir de 20 usuarios concurrentes | Alto |
| Throughput estancado entre 20 y 30 usuarios | Medio |
| Endpoints de salud sin degradación relevante | Bajo |

---

## 8. Análisis breve de resultados
El sistema presenta un desempeño limitado incluso bajo una carga moderada de 10 a 30 usuarios concurrentes, lo cual es consistente con una arquitectura centralizada en gateway y con dependencia de consultas hacia servicios de datos externos. Los endpoints de autenticación mantienen tiempos aceptables, aunque muestran penalización por hashing, validación y acceso a datos de seguridad. Las mayores degradaciones se concentran en los endpoints proxificados hacia el backend, donde la latencia del salto adicional y la dependencia de la base de datos de negocio elevan el p95 y la tasa de error. El comportamiento del throughput muestra saturación progresiva, especialmente a partir de 20 usuarios concurrentes, lo que evidencia cuellos de botella en gateway y backend.

---

## 9. Conclusión
El sistema es funcional bajo carga ligera, pero su rendimiento general es bajo frente a escenarios de concurrencia moderada. La principal limitación se encuentra en la concentración de procesamiento en el gateway, el costo adicional del proxy interno y la sensibilidad del backend a la latencia de la base de datos de negocio. Se recomienda optimizar consultas, fortalecer el uso de caché, revisar el dimensionamiento del gateway y reducir el overhead de validaciones repetitivas en rutas de alto tráfico para mejorar la capacidad operativa del sistema.