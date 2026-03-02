#!/bin/bash

echo "📦 Installing basic dependencies..."

pip install sqlalchemy fastapi uvicorn psycopg2-binary pydantic-settings pydantic alembic

echo "✅ Basic dependencies installed!"
echo ""
echo "🚀 Now run:"
echo "   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
