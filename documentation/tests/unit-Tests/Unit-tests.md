# Informe de Ejecución de Pruebas - Pruebas Unitarias

## 1. Objetivo
Validar el correcto funcionamiento de los componentes internos del backend, asegurando que la lógica de configuración, seguridad y gestión de base de datos opere correctamente de forma aislada mediante el uso de pruebas unitarias con dependencias simuladas.

---

## 2. Alcance
Se evaluaron los siguientes componentes del núcleo del sistema:

- Configuración (`config.py`)
- Gestión de base de datos (`database.py`)
- Seguridad (`security.py`)

Las pruebas se realizaron de forma aislada, utilizando mocks para dependencias externas como Redis y conexiones de base de datos.

---

## 3. Insumos utilizados
- Código fuente de los módulos `config`, `database` y `security`
- Diagrama de componentes del sistema
- Framework de pruebas: **pytest**
- Librerías de mocking: `pytest-mock`, `unittest.mock`

---

## 4. Entorno de prueba
- Sistema operativo: Linux Ubuntu  
- Lenguaje: Python 3.11+  
- Ejecución: CI/CD con GitHub Actions  
- Dependencias simuladas:
  - Redis (mock de `redis.Redis`)
  - Base de datos PostgreSQL (mock de `SessionLocal` y engine)

---

## 5. Criterios y métricas evaluadas
- Validación de configuración dinámica
- Construcción de parámetros derivados
- Integridad en el ciclo de vida de sesiones
- Seguridad en autenticación y tokens
- Manejo de errores en dependencias externas
- Correcta aplicación de cifrado y hashing

**Métricas:**
- Total de pruebas ejecutadas  
- Pruebas exitosas / fallidas  
- Cobertura de código (%)  
- Tiempo de ejecución  

---

## 6. Escenarios ejecutados

### Config (`config.py`)
- Validación de parsing de `allowed_origins` desde:
  - string JSON válido
  - string separado por comas
  - lista directa
- Construcción automática de `database_url` a partir de credenciales
- Uso de valor directo de `database_url` cuando está definido
- Validación de valores por defecto

### Database (`database.py`)
- Creación de sesión (`SessionLocal`)
- Liberación de recursos (`db.close()`)
- Comportamiento del generador `get_db()`
- Manejo correcto del contexto `try/finally`

### Security (`security.py`)

#### Password
- Hash de contraseña con Argon2
- Verificación correcta de contraseña válida
- Rechazo de contraseña inválida

#### JWT
- Creación de access token con expiración por defecto
- Creación de refresh token con tipo definido
- Validación de token válido
- Manejo de token inválido (JWTError)

#### Redis (Mock)
- Simulación de cliente Redis
- Validación de token no listado en blacklist
- Simulación de token en blacklist (`exists`)
- Manejo de excepción en Redis (retorno seguro)

#### Blacklist
- Inserción de token con expiración (`setex`)
- Cálculo de expiración desde payload
- Comportamiento ante payload inválido

#### Encryption
- Encriptación de datos sensibles
- Desencriptación válida
- Manejo de error en cifrado (retorno fallback)

#### Utilidades
- Hash de dirección IP (longitud y consistencia)

---

## 7. Resultados obtenidos

### Config

| Métrica | Valor |
|--------|------|
| Pruebas ejecutadas | 12 |
| Exitosas | 11 |
| Fallidas | 1 |
| Cobertura | 88% |

---

### Database

| Métrica | Valor |
|--------|------|
| Pruebas ejecutadas | 8 |
| Exitosas | 7 |
| Fallidas | 1 |
| Cobertura | 85% |

---

### Security

| Métrica | Valor |
|--------|------|
| Pruebas ejecutadas | 32 |
| Exitosas | 29 |
| Fallidas | 3 |
| Cobertura | 90% |

---

### Totales

| Métrica | Valor |
|--------|------|
| Total de pruebas | 52 |
| Pruebas exitosas | 47 |
| Pruebas fallidas | 5 |
| Cobertura global | 87% |
| Tiempo de ejecución | 3.5 segundos |

---

## 8. Análisis breve de resultados
Se evidencia una mejora en la cobertura al incluir escenarios más específicos y técnicos, especialmente en el módulo de seguridad. Las fallas se concentran en escenarios límite asociados a dependencias simuladas (Redis) y validaciones de configuración incompletas. El uso de mocks permitió aislar correctamente la lógica y detectar comportamientos no controlados.

---

## 9. Conclusión
El sistema presenta un nivel de calidad medio con tendencia a alto, mostrando estabilidad en la lógica principal. La cobertura es adecuada para el nivel actual del proyecto, aunque se recomienda reforzar escenarios de error y validaciones adicionales en componentes críticos para mejorar la robustez general.