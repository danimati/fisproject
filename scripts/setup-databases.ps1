# Script para configurar bases de datos desde cero en Windows
# Uso: .\setup-databases.ps1

param(
    [string]$PgPassword = "postgres",
    [string]$BackendUser = "maritime_user",
    [string]$BackendPass = "maritime_pass123",
    [string]$GatewayUser = "felatiko_user",
    [string]$GatewayPass = "felatiko_pass123"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🗄️  Configuración de Bases de Datos" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $version = & psql --version
    Write-Host "   PostgreSQL encontrado: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}

function Invoke-Psql {
    param(
        [string]$Database,
        [string[]]$Commands
    )

    foreach ($command in $Commands) {
        & psql -U postgres -h localhost -d $Database -v ON_ERROR_STOP=1 -c $command
    }
}

function Ensure-Role {
    param(
        [string]$User,
        [string]$Password
    )

    $exists = & psql -U postgres -h localhost -d postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname = '$User';"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo consultar si existe el usuario $User"
    }

    if ($exists.Trim() -ne "1") {
        & psql -U postgres -h localhost -d postgres -v ON_ERROR_STOP=1 -c "CREATE ROLE $User WITH LOGIN PASSWORD '$Password';"
    } else {
        & psql -U postgres -h localhost -d postgres -v ON_ERROR_STOP=1 -c "ALTER ROLE $User WITH LOGIN PASSWORD '$Password';"
    }
}

function Ensure-Database {
    param(
        [string]$Database,
        [string]$Owner
    )

    $exists = & psql -U postgres -h localhost -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$Database';"
    if ($LASTEXITCODE -ne 0) {
        throw "No se pudo consultar si existe la base de datos $Database"
    }

    if ($exists.Trim() -ne "1") {
        & psql -U postgres -h localhost -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $Database OWNER $Owner;"
    } else {
        & psql -U postgres -h localhost -d postgres -v ON_ERROR_STOP=1 -c "ALTER DATABASE $Database OWNER TO $Owner;"
    }
}

Write-Host ""
Write-Host "📊 PASO 1: Crear Base de Datos Backend (maritime_db)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Ensure-Role -User $BackendUser -Password $BackendPass
Ensure-Database -Database "maritime_db" -Owner $BackendUser
Invoke-Psql -Database "maritime_db" -Commands @(
    "GRANT ALL PRIVILEGES ON DATABASE maritime_db TO $BackendUser;",
    "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";",
    "GRANT ALL PRIVILEGES ON SCHEMA public TO $BackendUser;",
    "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $BackendUser;",
    "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $BackendUser;",
    "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $BackendUser;",
    "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $BackendUser;"
)
Write-Host "✅ Base de datos 'maritime_db' lista" -ForegroundColor Green

Write-Host ""
Write-Host "📊 PASO 2: Crear Base de Datos Gateway (felatiko)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Ensure-Role -User $GatewayUser -Password $GatewayPass
Ensure-Database -Database "felatiko" -Owner $GatewayUser
Invoke-Psql -Database "felatiko" -Commands @(
    "GRANT ALL PRIVILEGES ON DATABASE felatiko TO $GatewayUser;",
    "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";",
    "GRANT ALL PRIVILEGES ON SCHEMA public TO $GatewayUser;",
    "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $GatewayUser;",
    "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $GatewayUser;",
    "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $GatewayUser;",
    "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $GatewayUser;"
)
Write-Host "✅ Base de datos 'felatiko' lista" -ForegroundColor Green

Write-Host ""
Write-Host "🔐 PASO 3: Verificar conexiones" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

& psql -U $BackendUser -d maritime_db -h localhost -p 5432 -c "SELECT now();"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conexión a maritime_db exitosa" -ForegroundColor Green
} else {
    Write-Host "⚠️  Advertencia al conectar a maritime_db" -ForegroundColor Yellow
}

& psql -U $GatewayUser -d felatiko -h localhost -p 5432 -c "SELECT now();"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conexión a felatiko exitosa" -ForegroundColor Green
} else {
    Write-Host "⚠️  Advertencia al conectar a felatiko" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Configuración completada" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Credenciales creadas:" -ForegroundColor Yellow
Write-Host "   Backend DB User: $BackendUser" -ForegroundColor White
Write-Host "   Backend DB Pass: $BackendPass" -ForegroundColor White
Write-Host "   Gateway DB User: $GatewayUser" -ForegroundColor White
Write-Host "   Gateway DB Pass: $GatewayPass" -ForegroundColor White
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Actualiza los archivos .env en ambos proyectos" -ForegroundColor White
Write-Host "   2. Ejecuta las migraciones:" -ForegroundColor White
Write-Host "      - cd marine-api; alembic upgrade head" -ForegroundColor Gray
Write-Host "      - cd gateway; alembic upgrade head" -ForegroundColor Gray
Write-Host "   3. Crea el usuario admin del gateway:" -ForegroundColor White
Write-Host "      - cd gateway; python create_admin.py" -ForegroundColor Gray
Write-Host ""
