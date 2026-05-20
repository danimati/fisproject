# 🗄️ Configuración de Bases de Datos desde Cero - Windows

Esta guía te ayudará a configurar ambas bases de datos (Backend API y Gateway) desde cero para que puedas ejecutar el proyecto completo.

---

## ✅ REQUISITOS PREVIOS

Asegúrate de tener instalado:

- **PostgreSQL 15+** (incluye pgAdmin y psql)
- **Python 3.12+**
- **Node.js 20+** con npm 10.9.4
- **Git Bash** o **PowerShell**

### 1️⃣ Verificar instalaciones

```powershell
# PowerShell
python --version          # Debe mostrar Python 3.12+
psql --version           # Debe mostrar PostgreSQL 15+
node --version           # Debe mostrar Node 20+
npm --version            # Debe mostrar npm 10.9.4+
```

---

## 📥 PASO 1: INSTALAR POSTGRESQL EN WINDOWS

### Si aún no lo tienes instalado:

1. Descarga desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador (recomendado versión 15 o superior)
3. Durante la instalación:
   - **Usuario superusuario**: `postgres`
   - **Contraseña**: `postgres` (puedes cambiarla después)
   - **Puerto**: `5432` (por defecto)
   - ✅ Marca las opciones: PostgreSQL Server, pgAdmin, Stack Builder, Command Line Tools

4. Verifica que se instaló correctamente:
```powershell
psql -U postgres -c "SELECT version();"
# Debe mostrar la versión de PostgreSQL
```

---

## 🗄️ PASO 2: CREAR BASES DE DATOS

### 2.1 Abrir pgAdmin o usar psql

**Opción A: Usando pgAdmin (Interfaz gráfica - Recomendado)**
1. Abre pgAdmin (se instaló con PostgreSQL)
2. Conecta al servidor postgres
3. Crea las bases de datos desde ahí

**Opción B: Usando psql (Línea de comandos)**

Abre PowerShell y ejecuta:

```powershell
# Conectar como usuario postgres
psql -U postgres

# Una vez conectado, verás: postgres=#
```

### 2.2 Crear la Base de Datos del Backend API (maritime_db)

En la consola psql, ejecuta:

```sql
-- Crear usuario con permisos
CREATE USER maritime_user WITH PASSWORD 'maritime_pass123';

-- Crear base de datos
CREATE DATABASE maritime_db OWNER maritime_user;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE maritime_db TO maritime_user;

-- Conectar a la BD y otorgar permisos en el schema
\c maritime_db
GRANT ALL PRIVILEGES ON SCHEMA public TO maritime_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO maritime_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO maritime_user;

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verificar que todo está bien
\l                 # Listar bases de datos
\du                # Listar usuarios
```

### 2.3 Crear la Base de Datos del Gateway (felatiko)

Continuando en psql:

```sql
-- Crear usuario con permisos
CREATE USER felatiko_user WITH PASSWORD 'felatiko_pass123';

-- Crear base de datos
CREATE DATABASE felatiko OWNER felatiko_user;

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE felatiko TO felatiko_user;

-- Conectar a la BD y otorgar permisos en el schema
\c felatiko
GRANT ALL PRIVILEGES ON SCHEMA public TO felatiko_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO felatiko_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO felatiko_user;

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Salir
\q
```

---

## ✅ PASO 3: VERIFICAR CONEXIONES

### 3.1 Verificar conexión a maritime_db

```powershell
psql -U maritime_user -d maritime_db -h localhost -p 5432 -c "SELECT now();"
# Debe mostrar la hora actual si todo está bien
```

### 3.2 Verificar conexión a felatiko

```powershell
psql -U felatiko_user -d felatiko -h localhost -p 5432 -c "SELECT now();"
# Debe mostrar la hora actual si todo está bien
```

---

## 🐍 PASO 4: CONFIGURAR VARIABLES DE ENTORNO

### 4.1 Backend API (marine-api)

Crea o edita el archivo `.env` en `marine-api/`:

```powershell
cd "marine-api"
```

Crea el archivo `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://maritime_user:maritime_pass123@localhost:5432/maritime_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=maritime_db
DB_USER=maritime_user
DB_PASS=maritime_pass123

# Application Configuration
APP_NAME=Maritime Trade Management API
APP_VERSION=1.0.0
DEBUG=true
ENVIRONMENT=development

# Security (CAMBIAR EN PRODUCCIÓN)
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:8080","http://localhost:4200"]

# Logging
LOG_LEVEL=INFO
```

### 4.2 Gateway

Crea o edita el archivo `.env` en `gateway/`:

```powershell
cd "gateway"
```

Crea el archivo `.env`:

```env
# Database Configuration
DATABASE_URL=postgresql://felatiko_user:felatiko_pass123@localhost:5432/felatiko
DB_HOST=localhost
DB_PORT=5432
DB_NAME=felatiko
DB_USER=felatiko_user
DB_PASS=felatiko_pass123

# Backend API
BACKEND_URL=http://localhost:8000

# Redis
REDIS_URL=redis://localhost:6379/0

# Security (CAMBIAR EN PRODUCCIÓN)
SECRET_KEY=gateway-super-secret-key-change-in-production
ENCRYPTION_KEY=32-character-encryption-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000
DOS_THRESHOLD=500

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:8080","http://localhost:4200"]

# Logging
LOG_LEVEL=INFO
DEBUG=true
ENVIRONMENT=development
```

---

## 🚀 PASO 5: EJECUTAR MIGRACIONES

### 5.1 Backend API - marine-api

```powershell
# Navegar al directorio
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\marine-api"

# Crear virtual environment
python -m venv venv

# Activar virtual environment
.\venv\Scripts\Activate.ps1

# Si tienes error de ejecución, ejecuta esto primero:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Verificar que se crearon las tablas
psql -U maritime_user -d maritime_db -c "\dt"
# Debe mostrar todas las tablas creadas

# Desactivar virtual environment (opcional por ahora)
deactivate
```

### 5.2 Gateway

```powershell
# Navegar al directorio
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\gateway"

# Crear virtual environment
python -m venv venv

# Activar virtual environment
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Verificar que se crearon las tablas
psql -U felatiko_user -d felatiko -c "\dt"
# Debe mostrar todas las tablas creadas

# Desactivar virtual environment (opcional por ahora)
deactivate
```

---

## 👤 PASO 6: CREAR USUARIOS DE PRUEBA

### 6.1 Crear Admin del Gateway

```powershell
# Aún en la carpeta gateway con el venv activado
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\gateway"

# Asegúrate que el venv esté activado
.\venv\Scripts\Activate.ps1

# Ejecutar el script de creación de admin
python create_admin.py

# Verás un mensaje como:
# Admin user created successfully!
# Username: admin
# Password: admin123
# Please change the password after first login.
```

### 6.2 Crear usuarios adicionales de prueba (Opcional)

Para crear usuarios adicionales, puedes ejecutar comandos SQL directamente:

```powershell
# Para el Gateway
psql -U felatiko_user -d felatiko

# Una vez conectado:
```

```sql
-- Insertar usuarios adicionales (sin encriptar solo para pruebas rápidas)
INSERT INTO "user" (username, email, password_hash, is_active, is_admin)
VALUES 
('testuser', 'test@example.com', 'hashed_password', true, false),
('admin2', 'admin2@example.com', 'hashed_password', true, true);

-- Ver usuarios creados
SELECT id, username, email, is_admin, is_active FROM "user";

-- Salir
\q
```

---

## 🧪 PASO 7: VERIFICAR QUE TODO FUNCIONA

### 7.1 Verificar Backend API

```powershell
# Terminal 1 - Backend API
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\marine-api"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Verifica en navegador: http://localhost:8000/docs
# Deberías ver la documentación interactiva de Swagger
```

### 7.2 Verificar Gateway

```powershell
# Terminal 2 - Gateway
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\gateway"
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

# Verifica en navegador: http://localhost:8080/docs
# Deberías ver la documentación del Gateway
```

### 7.3 Probar Login del Gateway

```powershell
# Terminal 3 - Prueba de login
# Usando curl de PowerShell

$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/auth/login" `
  -Method Post `
  -Body $body `
  -Headers @{"Content-Type" = "application/json"}

# Deberías recibir un token JWT
```

### 7.4 Verificar Frontend

```powershell
# Terminal 4 - Frontend
cd "c:\Users\tomas\OneDrive\Documentos\GitHub\fisproject\Front\adminConfigurations"
npm install
npm start

# Verifica en navegador: http://localhost:4200
```

---

## 📊 CREDENCIALES DE ACCESO

| Componente | Usuario | Contraseña | Puerto | URL |
|-----------|---------|-----------|--------|-----|
| **Backend API** | - | - | 8000 | http://localhost:8000 |
| **Backend Docs** | - | - | 8000 | http://localhost:8000/docs |
| **Gateway** | admin | admin123 | 8080 | http://localhost:8080 |
| **Gateway Docs** | - | - | 8080 | http://localhost:8080/docs |
| **Frontend** | - | - | 4200 | http://localhost:4200 |
| **PostgreSQL** | maritime_user | maritime_pass123 | 5432 | localhost |
| **PostgreSQL Gateway** | felatiko_user | felatiko_pass123 | 5432 | localhost |

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### Error: "role maritime_user does not exist"

**Solución:**
```sql
-- Asegúrate de estar como usuario postgres
psql -U postgres

-- Verifica que el usuario existe
\du

-- Si no existe, créalo
CREATE USER maritime_user WITH PASSWORD 'maritime_pass123';
```

### Error: "database maritime_db does not exist"

**Solución:**
```sql
psql -U postgres

-- Verifica bases de datos
\l

-- Si no existe, créala
CREATE DATABASE maritime_db OWNER maritime_user;
```

### Error: "password authentication failed"

**Solución:**
1. Verifica que las credenciales en `.env` coincidan
2. Reinicia el servidor PostgreSQL
3. En Windows: Servicios → PostgreSQL → Reiniciar

### Error: "port 5432 already in use"

**Solución:**
```powershell
# Encuentra qué está usando el puerto
Get-Process -Id (Get-NetTCPConnection -LocalPort 5432).OwningProcess

# O usa otro puerto en PostgreSQL
# Edita: C:\Program Files\PostgreSQL\15\data\postgresql.conf
# Cambia: port = 5432 → port = 5433
```

### Error en alembic: "No such table"

**Solución:**
```powershell
# Asegúrate de tener las extensiones
psql -U postgres -d maritime_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Vuelve a ejecutar las migraciones
alembic upgrade head
```

---

## 📝 CHECKLIST FINAL

- ✅ PostgreSQL instalado y corriendo
- ✅ Bases de datos `maritime_db` y `felatiko` creadas
- ✅ Usuarios creados con permisos (`maritime_user` y `felatiko_user`)
- ✅ Archivos `.env` configurados en ambos proyectos
- ✅ Migraciones ejecutadas en ambas BDs
- ✅ Usuario admin creado en el gateway
- ✅ Backend API corriendo en puerto 8000
- ✅ Gateway corriendo en puerto 8080
- ✅ Frontend corriendo en puerto 4200
- ✅ Todos los servicios conectándose correctamente

---

## 🚀 PRÓXIMOS PASOS

1. Usa las credenciales del admin para loguearte en el gateway
2. Explora la documentación de Swagger en `http://localhost:8000/docs`
3. Prueba los endpoints disponibles
4. Cambia las contraseñas en producción
5. Configura Redux/state management en el frontend

**¡Listo para comenzar el desarrollo! 🎉**
