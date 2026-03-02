# Database Setup Guide

## 🚀 Quick Database Setup Options

### Option 1: Use the Setup Script (Recommended)

```bash
# Default setup on port 5433
./scripts/setup-db.sh

# Custom port and credentials
./scripts/setup-db.sh 5434 my_db my_user my_pass
```

### Option 2: Use Development Docker Compose

```bash
# Uses port 5434 for database, 8001 for API
docker-compose -f docker-compose.dev.yml up -d
```

### Option 3: Use Standard Docker Compose

```bash
# Uses port 5433 for database (updated from 5432)
docker-compose up -d
```

### Option 4: Manual Port Selection

```bash
# Check available ports
netstat -tulpn | grep :543

# Choose an available port and create override
cat > docker-compose.override.yml << EOF
version: '3.8'
services:
  db:
    ports:
      - "5435:5432"  # Use port 5435
EOF

docker-compose up -d
```

## 🔧 Database Connection Details

### Development Environments

| Environment | Database Port | API Port | Config File |
|-------------|----------------|-----------|--------------|
| Standard | 5433 | 8000 | docker-compose.yml |
| Development | 5434 | 8001 | docker-compose.dev.yml |
| Custom | Variable | Variable | docker-compose.override.yml |

### Connection URLs

```bash
# Port 5433 (Standard)
postgresql://postgres:postgres@localhost:5433/maritime_db

# Port 5434 (Development)
postgresql://postgres:postgres@localhost:5434/maritime_db

# Port 5435 (Custom)
postgresql://postgres:postgres@localhost:5435/maritime_db
```

## 🗄️ Running Migrations

### After Database is Ready

```bash
# Check database status
docker-compose ps

# Run migrations
docker-compose exec api alembic upgrade head

# Or for development compose
docker-compose -f docker-compose.dev.yml exec api alembic upgrade head
```

### Migration Commands

```bash
# Create new migration
docker-compose exec api alembic revision --autogenerate -m "Description"

# Check current version
docker-compose exec api alembic current

# View migration history
docker-compose exec api alembic history

# Rollback one migration
docker-compose exec api alembic downgrade -1
```

## 🐳 Docker Commands Reference

### Database Management

```bash
# Connect to database
docker-compose exec db psql -U postgres maritime_db

# View logs
docker-compose logs db

# Stop database
docker-compose stop db

# Restart database
docker-compose restart db

# Remove database (WARNING: deletes data)
docker-compose down -v
```

### Application Management

```bash
# View API logs
docker-compose logs api

# Restart API
docker-compose restart api

# Access container shell
docker-compose exec api bash

# Rebuild API
docker-compose build api
docker-compose up -d api
```

## 🔍 Troubleshooting

### Port Conflicts

```bash
# Find what's using a port
sudo lsof -i :5432
sudo lsof -i :5433
sudo lsof -i :5434

# Kill process on port
sudo fuser -k 5432/tcp

# Find available ports
netstat -tulpn | grep :543
```

### Database Connection Issues

```bash
# Check if database is ready
docker-compose exec db pg_isready -U postgres

# Test connection from API container
docker-compose exec api python -c "
from app.core.database import engine
try:
    with engine.connect() as conn:
        print('✅ Database connection successful')
except Exception as e:
    print(f'❌ Connection failed: {e}')
"
```

### Permission Issues

```bash
# Fix Docker permissions
sudo chown -R $USER:$USER /var/run/docker.sock

# Fix file permissions
sudo chown -R $USER:$USER ./postgres_data
```

## 📋 Environment Variables

Create `.env` file for your chosen setup:

```bash
# For port 5433 setup
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/maritime_db

# For port 5434 setup  
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/maritime_db

# Application settings
DEBUG=true
ENVIRONMENT=development
LOG_LEVEL=INFO
```

## 🚀 Quick Start Commands

```bash
# 1. Choose your setup option
./scripts/setup-db.sh                    # Option 1
# OR
docker-compose -f docker-compose.dev.yml up -d  # Option 2

# 2. Wait for database to be ready
sleep 15

# 3. Run migrations
docker-compose exec api alembic upgrade head

# 4. Check API health
curl http://localhost:8000/api/v1/health
# OR
curl http://localhost:8001/api/v1/health

# 5. Access documentation
open http://localhost:8000/docs
# OR  
open http://localhost:8001/docs
```

## 🔄 Switching Between Setups

```bash
# Stop current setup
docker-compose down
# OR
docker-compose -f docker-compose.dev.yml down

# Start different setup
docker-compose up -d
# OR
docker-compose -f docker-compose.dev.yml up -d
```

## 📊 Monitoring

### Database Health

```bash
# Check database size
docker-compose exec db psql -U postgres -c "
SELECT pg_size_pretty(pg_database_size('maritime_db')) as database_size;
"

# Check active connections
docker-compose exec db psql -U postgres -c "
SELECT count(*) as active_connections FROM pg_stat_activity;
"
```

### Application Health

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Readiness check
curl http://localhost:8000/api/v1/ready

# Application logs
docker-compose logs -f api
```

---

**Choose the setup that works best for your environment!**
