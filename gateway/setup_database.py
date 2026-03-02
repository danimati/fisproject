#!/usr/bin/env python3
"""
Setup script for gateway database
"""
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import engine, Base
from app.models import *

def create_tables():
    """Create all database tables"""
    try:
        print("Creating database tables...")
        print(f"Using database: {settings.database_url}")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Create admin user
        from app.core.security import get_password_hash
        from app.models.user import User
        from sqlalchemy.orm import sessionmaker
        
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        try:
            # Check if admin user exists
            admin_user = db.query(User).filter(User.username == "admin").first()
            if not admin_user:
                admin_user = User(
                    username="admin",
                    email="admin@maritime.com",
                    password_hash=get_password_hash("admin123"),
                    is_admin=True,
                    is_active=True
                )
                admin_user.set_full_name("System Administrator")
                db.add(admin_user)
                db.commit()
                print("✅ Admin user created (username: admin, password: admin123)")
            else:
                print("ℹ️ Admin user already exists")
                
        except Exception as e:
            print(f"❌ Error creating admin user: {e}")
            db.rollback()
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print(f"Using database: {settings.database_url}")
    success = create_tables()
    
    if success:
        print("\n🎉 Gateway database setup completed!")
        print("\nNext steps:")
        print("1. Start PostgreSQL database on localhost:5432")
        print("2. Start Redis on localhost:6379") 
        print("3. Run: uvicorn app.main:app --host 0.0.0.0 --port 8080")
        print("\nDefault admin credentials:")
        print("Username: admin")
        print("Password: admin123")
    else:
        print("\n❌ Database setup failed!")
        sys.exit(1)
