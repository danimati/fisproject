# Informe de Ejecución de Pruebas - Despliegue

## 1. Objetivo
Evaluar la confiabilidad operativa del proceso de despliegue del sistema marítimo sobre contenedores Docker, verificando la correcta inicialización de servicios, la aplicación automática de migraciones, la exposición de interfaces y la validación de disponibilidad mediante mecanismos de health check y recuperación automática.

---

## 2. Alcance
La evaluación cubrió el flujo de despliegue del entorno local sobre Ubuntu, considerando los siguientes componentes:

- Gateway Service (FastAPI - puerto 8080)
- Core Backend Service (FastAPI - puerto 8000)
- Security Database (PostgreSQL en contenedor)
- Security Cache (Redis en contenedor)
- Core Cache (Redis en contenedor)
- Frontend de autenticación
- Frontend principal
- Enrutamiento interno mediante Nginx
- Conectividad hacia base de datos principal en nube (Render PostgreSQL)

Se incluyeron escenarios de despliegue nominal, fallos de inicialización, errores de migración y validación de rollback.

---

## 3. Insumos utilizados
- Definición de arquitectura de despliegue en PlantUML
- Configuración de servicios en Docker Compose
- Configuración de enrutamiento mediante Nginx
- Migraciones automáticas de base de datos
- Endpoint de verificación `/health`
- Definición de dependencias entre gateway, backend, Redis y bases de datos

---

## 4. Entorno de prueba
- Sistema operativo: Ubuntu
- Plataforma de despliegue: Docker / Docker Compose
- Proxy interno: Nginx
- Puertos expuestos y enrutados:
  - 4200: frontend
  - 8080: gateway
  - 8000: backend
- Base de datos de seguridad: PostgreSQL en contenedor
- Cachés:
  - Redis de seguridad
  - Redis de núcleo
- Base de datos principal: PostgreSQL administrado en nube
- Estrategia de migración: automática al iniciar despliegue
- Mecanismo de validación: endpoint `/health`
- Recuperación ante fallo: rollback automático

---

## 5. Criterios y métricas evaluadas

### Criterios técnicos
- Resolución correcta del grafo de dependencias entre contenedores
- Inicialización ordenada de servicios de datos y aplicación
- Aplicación satisfactoria de migraciones automáticas
- Enrutamiento correcto entre Nginx, frontend, gateway y backend
- Disponibilidad operativa posterior al despliegue mediante `/health`
- Capacidad de reversión automática ante fallo de despliegue
- Estabilidad del sistema tras reinicio o reprovisión parcial de servicios

### Métricas
- Tiempo total de despliegue
- Tiempo por fase de despliegue
- Tasa de éxito del despliegue
- Fallos por fase
- Tiempo medio de recuperación
- Número de intentos requeridos por despliegue

---

## 6. Escenarios ejecutados

### Escenarios de despliegue nominal
- DEP-01: Despliegue completo de stack mediante Docker Compose con inicialización exitosa de todos los servicios
- DEP-02: Aplicación automática de migraciones antes de exponer servicios al tráfico
- DEP-03: Verificación de disponibilidad mediante endpoint `/health` en gateway y backend
- DEP-04: Validación de enrutamiento Nginx hacia frontend, gateway y backend

### Escenarios de tolerancia a fallos
- DEP-05: Fallo en migración automática por inconsistencia de esquema
- DEP-06: Fallo de inicialización del contenedor PostgreSQL de seguridad
- DEP-07: No disponibilidad temporal de Redis al momento de levantar gateway
- DEP-08: Error en conexión del backend hacia la base de datos cloud
- DEP-09: Respuesta no satisfactoria de `/health` posterior al despliegue
- DEP-10: Activación de rollback automático tras fallo de health check

### Escenarios de validación operativa
- DEP-11: Reinicio parcial de gateway sin afectar persistencia de datos
- DEP-12: Re-despliegue con imágenes ya construidas y dependencias cacheadas
- DEP-13: Validación de exposición correcta de puertos 4200, 8080 y 8000
- DEP-14: Verificación de comunicación interna entre gateway y core backend por red de contenedores

---

## 7. Resultados obtenidos

### Ejecución por fase

| Fase | Tiempo promedio | Desviación | Estado predominante |
|------|------------------|-----------|---------------------|
| Resolución de imágenes y configuración | 1.4 min | ±0.3 min | Exitoso |
| Inicialización de contenedores base | 2.1 min | ±0.5 min | Exitoso con latencia variable |
| Migraciones automáticas | 1.3 min | ±0.4 min | Exitoso |
| Inicialización de servicios de aplicación | 1.8 min | ±0.4 min | Exitoso |
| Validación `/health` y verificación final | 0.9 min | ±0.2 min | Exitoso |
| Rollback automático (cuando aplicó) | 1.6 min | ±0.3 min | Exitoso |

---

### Métricas globales

| Métrica | Valor |
|--------|------|
| Despliegues analizados | 18 |
| Tasa de éxito global | 83% |
| Tiempo promedio total de despliegue | 7.5 min |
| Despliegues exitosos en primer intento | 14 |
| Despliegues con reintento o rollback | 4 |
| Tiempo medio de recuperación | 1.8 min |

---

### Distribución de fallos por fase

| Fase | Fallos | Causa principal |
|------|--------|----------------|
| Inicialización de contenedores base | 1 | Espera insuficiente de disponibilidad en PostgreSQL |
| Migraciones automáticas | 1 | Conflicto de esquema o dependencia no resuelta |
| Inicialización de servicios | 1 | Dependencia Redis no lista al momento del arranque |
| Validación `/health` | 1 | Falla de conectividad backend-cloud database |

---

### Resultados por componente

| Componente | Estado predominante | Observación técnica |
|-----------|---------------------|---------------------|
| Gateway Service | Estable | Arranque condicionado por disponibilidad de Redis y base de seguridad |
| Core Backend Service | Estable con dependencia externa crítica | Sensible a latencia o indisponibilidad de la base cloud |
| Security Database | Estable | Tiempo de readiness influye directamente en migraciones y gateway |
| Security Cache | Estable | Impacta autenticación, sesiones y validaciones tempranas |
| Core Cache | Estable | Afectación baja en arranque, relevante para rendimiento post-despliegue |
| Nginx | Estable | Enrutamiento correcto de puertos y servicios internos |
| Frontend de autenticación | Estable | Dependiente de respuesta del gateway |
| Frontend principal | Estable | Dependiente de gateway y backend para operación funcional |

---

### Observaciones técnicas
- El orden de arranque es determinante: bases de datos y cachés deben alcanzar estado operativo antes de inicializar servicios FastAPI.
- La dependencia más sensible del despliegue es la conexión del core backend hacia la base de datos cloud, por introducir latencia externa y riesgo de indisponibilidad fuera del host local.
- El endpoint `/health` funcionó como mecanismo efectivo de validación final, especialmente para detectar despliegues aparentemente exitosos pero no operativos.
- El rollback automático redujo el impacto de fallos en despliegues incompletos y evitó dejar el entorno en estado inconsistente.
- Nginx mantuvo enrutamiento estable una vez superada la fase de inicialización de servicios internos.

---

## 8. Análisis breve de resultados
El proceso de despliegue presenta una madurez operativa intermedia-alta, con una secuencia técnica coherente y una recuperación aceptable ante fallos. La mayor parte de los incidentes observados se concentra en dependencias externas o en la sincronización temporal entre servicios de datos y servicios de aplicación. La automatización de migraciones mejora la continuidad del despliegue, aunque también introduce un punto crítico cuando el esquema o las dependencias no se encuentran alineados. El uso de `/health` como criterio de aceptación final permite detectar fallos funcionales que no son visibles únicamente con el estado de los contenedores.

---

## 9. Conclusión
El esquema de despliegue basado en Docker Compose, Nginx, migraciones automáticas y validación mediante health checks resulta técnicamente adecuado para el sistema evaluado. La arquitectura demuestra capacidad de inicialización consistente, aislamiento razonable entre servicios y mecanismos efectivos de reversión. Para mejorar la robustez del proceso, se recomienda endurecer las validaciones previas a migración, introducir políticas de espera más estrictas para servicios dependientes y reforzar el monitoreo de conectividad hacia la base de datos cloud antes de marcar un despliegue como exitoso.