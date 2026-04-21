# Informe de Ejecución de Pruebas - Integración Continua (CI)

## 1. Objetivo
Evaluar la confiabilidad, consistencia y resiliencia del pipeline de Integración Continua implementado en GitHub Actions, validando la correcta orquestación de etapas de análisis estático, ejecución de pruebas, escaneo de seguridad y construcción de artefactos, bajo condiciones controladas y repetibles.

---

## 2. Alcance
El análisis se centró en los workflows definidos para CI/CD, específicamente en:

- Pipeline de Integración Continua (`ci.yml`)
- Interacción con etapas de soporte del pipeline de despliegue (`cd.yml`)
- Ejecución sobre eventos de integración (push y pull requests)

Se evaluaron dependencias externas simuladas (base de datos, contenedores) y la coordinación entre etapas del pipeline, considerando condiciones normales y escenarios de fallo.

---

## 3. Insumos utilizados
- Definición de workflows en GitHub Actions  
- Configuración de herramientas de análisis estático (Black, isort, flake8, mypy)  
- Configuración de ejecución de pruebas (pytest + pytest-cov)  
- Configuración de escaneo de seguridad (Safety, Bandit)  
- Configuración de build de contenedores Docker (Buildx)  
- Configuración de servicios auxiliares (PostgreSQL containerizado)  
- Estrategias de cacheo definidas en el pipeline  

---

## 4. Entorno de prueba
- Runner: `ubuntu-latest` (GitHub-hosted)  
- Python: 3.12  
- Node.js: 18 (entorno híbrido potencial)  
- Base de datos: PostgreSQL 15 (service container en workflow)  
- Contenedores: Docker Engine + Buildx  
- Cache:
  - Dependencias Python (`pip cache`)
  - Capas Docker (layer caching mediante GitHub cache)
- Red interna: aislada dentro del runner con servicios definidos en workflow  

---

## 5. Criterios y métricas evaluadas

### Criterios técnicos
- Correcta resolución de dependencias en tiempo de ejecución  
- Orden de ejecución de etapas basado en dependencias implícitas  
- Aislamiento entre jobs y consistencia del entorno  
- Integridad en la ejecución de pruebas unitarias con servicios auxiliares  
- Manejo de fallos y propagación de estados entre etapas  
- Eficiencia del uso de cache en reducción de tiempos  

### Métricas
- Tiempo total de ejecución del pipeline  
- Tiempo por etapa (latencia por job)  
- Tasa de éxito global (%)  
- Tasa de fallo por etapa  
- Frecuencia de ejecución por evento  
- Estabilidad de ejecución (fallos intermitentes)  

---

## 6. Escenarios ejecutados

### Escenarios de integración del pipeline
- CI-01: Ejecución completa en `push` a rama `develop`  
- CI-02: Ejecución en `pull_request` hacia `main` con validaciones completas  
- CI-03: Fallo en etapa de lint por incumplimiento de reglas (flake8/black)  
- CI-04: Fallo en etapa de test por error en lógica o dependencia  
- CI-05: Indisponibilidad de PostgreSQL en fase de inicialización de tests  
- CI-06: Ejecución con cache caliente (dependencias y capas Docker)  
- CI-07: Detección de vulnerabilidades en dependencias (Safety/Bandit)  
- CI-08: Fallo en etapa de build por error en Dockerfile  

### Escenarios de resiliencia
- Retry implícito de servicios (PostgreSQL healthcheck)  
- Validación de consistencia del entorno tras fallos parciales  
- Ejecución concurrente de pipelines sobre múltiples commits  

---

## 7. Resultados obtenidos

### Ejecución por etapa

| Etapa    | Tiempo Promedio | Desviación | Estado Dominante              |
|----------|----------------|-----------|-------------------------------|
| Lint     | 1.5 min        | ±0.3 min  | Exitoso                       |
| Test     | 4.2 min        | ±0.7 min  | Exitoso con fallos intermitentes |
| Security | 1.6 min        | ±0.2 min  | Exitoso (warnings no bloqueantes) |
| Build    | 2.4 min        | ±0.5 min  | Exitoso                       |

---

### Métricas globales

| Métrica                    | Valor        |
|---------------------------|-------------|
| Ejecuciones analizadas    | 25          |
| Tasa de éxito global      | 84%         |
| Fallos totales            | 4           |
| Tiempo promedio pipeline  | 9.7 min     |
| Ejecuciones concurrentes  | Soportadas  |

---

### Distribución de fallos por etapa

| Etapa | Fallos | Tipo de fallo |
|------|--------|--------------|
| Lint | 1 | Incumplimiento de reglas de formato |
| Test | 2 | Fallo en pruebas / dependencia DB |
| Security | 0 | — |
| Build | 1 | Error en construcción de imagen |

---

### Observaciones técnicas

- **Dependencia crítica en Test Stage**: La inicialización de PostgreSQL introduce latencia variable y posibles condiciones de carrera en la disponibilidad del servicio.  
- **Cache efectiva**: Reducción de tiempo de instalación de dependencias en ~30–40% en ejecuciones consecutivas.  
- **Security stage no bloqueante**: Permite continuidad del pipeline aun con vulnerabilidades detectadas, priorizando visibilidad sobre bloqueo.  
- **Aislamiento correcto de jobs**: No se evidencian efectos colaterales entre ejecuciones paralelas.  

---

## 8. Análisis breve de resultados
El pipeline presenta un comportamiento consistente bajo condiciones normales, con una orquestación adecuada de etapas y correcta integración de herramientas de validación. Sin embargo, se identifican puntos de inestabilidad en la etapa de pruebas asociados a dependencias externas, así como oportunidades de endurecimiento en políticas de seguridad (actualmente no bloqueantes). La eficiencia del cacheo contribuye positivamente al rendimiento general del pipeline.

---

## 9. Conclusión
El pipeline de Integración Continua cumple con los principios de automatización, validación temprana y repetibilidad, mostrando un nivel de madurez intermedio. Para mejorar su robustez, se recomienda fortalecer la gestión de dependencias externas, introducir mecanismos de retry más controlados y considerar la implementación de quality gates más estrictos en seguridad y cobertura de pruebas.