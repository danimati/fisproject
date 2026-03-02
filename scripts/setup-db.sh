#!/bin/bash

# Database setup script for different ports

set -e

DEFAULT_PORT=5433
DEFAULT_DB="maritime_db"
DEFAULT_USER="postgres"
DEFAULT_PASS="postgres"

# Parse command line arguments
PORT=${1:-$DEFAULT_PORT}
DB_NAME=${2:-$DEFAULT_DB}
DB_USER=${3:-$DEFAULT_USER}
DB_PASS=${4:-$DEFAULT_PASS}

echo "Setting up PostgreSQL database on port $PORT..."

# Check if port is available
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "⚠️  Port $PORT is already in use!"
    echo "Choose a different port or stop the service using this port."
    echo ""
    echo "To find what's using port $PORT:"
    echo "  sudo lsof -i :$PORT"
    echo ""
    echo "To kill the process:"
    echo "  sudo fuser -k $PORT/tcp"
    exit 1
fi

# Create docker-compose override for custom port
cat > docker-compose.override.yml << EOF
version: '3.8'

services:
  db:
    ports:
      - "${PORT}:5432"
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}

  api:
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@db:5432/${DB_NAME}
EOF

echo "✅ Created docker-compose.override.yml for port $PORT"
echo ""
echo "🚀 Starting database on port $PORT..."
docker-compose up -d db

echo "⏳ Waiting for database to be ready..."
sleep 10

# Test connection
if docker-compose exec -T db pg_isready -U $DB_USER; then
    echo "✅ Database is ready on port $PORT!"
    echo ""
    echo "📋 Connection details:"
    echo "  Host: localhost"
    echo "  Port: $PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo "🔗 Connection URL:"
    echo "  postgresql://${DB_USER}:${DB_PASS}@localhost:${PORT}/${DB_NAME}"
    echo ""
    echo "🐳 Docker commands:"
    echo "  Connect: docker-compose exec db psql -U $DB_USER $DB_NAME"
    echo "  Stop: docker-compose down"
    echo "  Logs: docker-compose logs db"
else
    echo "❌ Database failed to start!"
    docker-compose logs db
    exit 1
fi
