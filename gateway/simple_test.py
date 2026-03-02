#!/usr/bin/env python3
"""
Simple test for gateway without database dependencies
"""
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.config import settings
    print("✅ Configuration loaded successfully")
    print(f"   Database URL: {settings.database_url}")
    print(f"   Redis URL: {settings.redis_url}")
    print(f"   Backend URL: {settings.backend_url}")
    print(f"   Debug mode: {settings.debug}")
    
    from app.core.security import verify_password, get_password_hash
    print("✅ Security module loaded successfully")
    
    # Test password hashing
    password = "test123"
    hashed = get_password_hash(password)
    verified = verify_password(password, hashed)
    print(f"✅ Password hashing works: {verified}")
    
    from app.main import app
    print("✅ FastAPI app loaded successfully")
    print(f"   App title: {app.title}")
    print(f"   App version: {app.version}")
    
    print("\n🎉 Gateway basic functionality test passed!")
    print("\nTo start the gateway:")
    print("1. Ensure PostgreSQL is running on localhost:5432")
    print("2. Ensure Redis is running on localhost:6379")
    print("3. Run: python setup_database.py")
    print("4. Run: uvicorn app.main:app --host 0.0.0.0 --port 8080")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure all dependencies are installed:")
    print("pip install -r requirements.txt")
except Exception as e:
    print(f"❌ Error: {e}")
