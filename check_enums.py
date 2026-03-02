#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def check_enum_values():
    """Check what enum values exist in the database"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as connection:
        print("Checking enum values in database...")
        
        # Check CargoType enum values
        try:
            result = connection.execute(text("""
                SELECT enumlabel as value 
                FROM pg_enum 
                WHERE enumtypid = (
                    SELECT oid FROM pg_type WHERE typname = 'cargotype'
                )
                ORDER BY value;
            """))
            cargo_types = [row[0] for row in result.fetchall()]
            print(f"CargoType enum values: {cargo_types}")
        except Exception as e:
            print(f"Could not get CargoType enum: {e}")
        
        # Check CargoStatus enum values
        try:
            result = connection.execute(text("""
                SELECT enumlabel as value 
                FROM pg_enum 
                WHERE enumtypid = (
                    SELECT oid FROM pg_type WHERE typname = 'cargostatus'
                )
                ORDER BY value;
            """))
            cargo_statuses = [row[0] for row in result.fetchall()]
            print(f"CargoStatus enum values: {cargo_statuses}")
        except Exception as e:
            print(f"Could not get CargoStatus enum: {e}")

if __name__ == "__main__":
    check_enum_values()
