#!/bin/bash

# Fix installation issues for Python 3.14+

set -e

echo "🔧 Fixing Python 3.14+ Installation Issues"
echo "=========================================="

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "🐍 Python version: $PYTHON_VERSION"

# Clean up existing environment
echo "🧹 Cleaning up existing environment..."
if [ -d "env" ]; then
    rm -rf env
fi

# Create new virtual environment
echo "📦 Creating new virtual environment..."
python3 -m venv env
source env/bin/activate

# Upgrade pip first
echo "⬆️  Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install system dependencies
echo "🔧 Installing system dependencies..."
if command -v apt-get > /dev/null; then
    sudo apt-get update
    sudo apt-get install -y gcc postgresql-client libpq-dev
elif command -v dnf > /dev/null; then
    sudo dnf install -y gcc postgresql-devel libpq-devel
elif command -v yum > /dev/null; then
    sudo yum install -y gcc postgresql-devel libpq-devel
fi

# Install compatible versions
echo "📦 Installing compatible package versions..."

# For Python 3.14+, use newer pydantic
if [[ "$PYTHON_VERSION" == "3.14" ]] || [[ "$PYTHON_VERSION" > "3.13" ]]; then
    echo "🔍 Using Python 3.14+ compatible versions..."
    pip install "pydantic>=2.6.0"
    pip install "pydantic-core>=2.16.0"
else
    echo "🔍 Using standard versions..."
    pip install "pydantic==2.5.2"
fi

# Install remaining packages
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install sqlalchemy==2.0.23
pip install alembic==1.12.1
pip install psycopg2-binary==2.9.9
pip install pydantic-settings==2.1.0
pip install python-jose[cryptography]==3.3.0
pip install passlib[bcrypt]==1.7.4

# Install dev dependencies
pip install pytest==7.4.3
pip install pytest-asyncio==0.21.1
pip install pytest-cov==4.1.0
pip install httpx==0.25.2
pip install black==23.11.0
pip install isort==5.12.0
pip install flake8==6.1.0
pip install mypy==1.7.1
pip install python-multipart==0.0.6

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To activate environment:"
echo "   source env/bin/activate"
echo ""
echo "🧪 To run tests:"
echo "   pytest"
echo ""
echo "🚢 To start application:"
echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
