#!/bin/bash

# Script to connect and setup cloud database

set -e

echo "🌐 Connecting to Cloud PostgreSQL Database"
echo "======================================"

# Database connection details
DB_HOST="dpg-d6hh5o15pdvs73diabc0-a.oregon-postgres.render.com"
DB_PORT="5432"
DB_NAME="prueba_t4dr"
DB_USER="prueba_t4dr_user"
DB_PASS="tt"

echo "📋 Connection Details:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Test connection
echo "🔍 Testing database connection..."
if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed!"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check if PostgreSQL client is installed:"
    echo "   sudo apt-get install postgresql-client"
    echo ""
    echo "2. Test connection manually:"
    echo "   PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
    echo ""
    echo "3. Check firewall/network settings"
    exit 1
fi

echo ""
echo "🚀 Setting up application..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME

# Application Configuration
APP_NAME=Maritime Trade Management API
APP_VERSION=1.0.0
DEBUG=true
ENVIRONMENT=development

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:8080"]

# Logging
LOG_LEVEL=INFO
EOF
    echo "✅ .env file created!"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "🗄️ Running database migrations..."
if command -v docker &> /dev/null; then
    echo "🐳 Using Docker for migrations..."
    docker-compose -f docker-compose.cloud.yml build api
    docker-compose -f docker-compose.cloud.yml run --rm api alembic upgrade head
else
    echo "🐍 Using local Python for migrations..."
    alembic upgrade head
fi

echo ""
echo "🌟 Starting application..."
if command -v docker &> /dev/null; then
    echo "🐳 Starting with Docker..."
    docker-compose -f docker-compose.cloud.yml up -d
    echo ""
    echo "📊 Application will be available at:"
    echo "  🌐 API: http://localhost:8000"
    echo "  📚 Documentation: http://localhost:8000/docs"
    echo "  ❤️  Health Check: http://localhost:8000/api/v1/health"
    echo ""
    echo "🐳 Docker commands:"
    echo "  View logs: docker-compose -f docker-compose.cloud.yml logs -f"
    echo "  Stop: docker-compose -f docker-compose.cloud.yml down"
else
    echo "🐍 Starting locally..."
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔗 Direct database connection:"
echo "   PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
