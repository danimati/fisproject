#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def check_cargo_tracking_number(tracking_number):
    """Check if a cargo with the given tracking number exists in the database"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as connection:
        # Check if the cargo table exists and get its structure
        result = connection.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'cargo' 
            ORDER BY ordinal_position;
        """))
        columns = result.fetchall()
        print("Cargo table structure:")
        for col in columns:
            print(f"  {col[0]}: {col[1]}")
        
        print(f"\nChecking for tracking number: {tracking_number}")
        
        # Check if the tracking number exists
        result = connection.execute(text("""
            SELECT id, tracking_number, description, created_at 
            FROM cargo 
            WHERE tracking_number = :tracking_number
        """), {"tracking_number": tracking_number})
        
        cargo = result.fetchone()
        
        if cargo:
            print(f"FOUND: Cargo with tracking number '{tracking_number}' exists:")
            print(f"  ID: {cargo[0]}")
            print(f"  Tracking Number: {cargo[1]}")
            print(f"  Description: {cargo[2]}")
            print(f"  Created At: {cargo[3]}")
        else:
            print(f"NOT FOUND: No cargo with tracking number '{tracking_number}' found")
        
        # Show all existing tracking numbers for reference
        print("\nAll existing tracking numbers:")
        result = connection.execute(text("""
            SELECT tracking_number, description, created_at 
            FROM cargo 
            ORDER BY created_at DESC 
            LIMIT 10
        """))
        
        cargos = result.fetchall()
        if cargos:
            for cargo in cargos:
                print(f"  '{cargo[0]}' - {cargo[1]} (created: {cargo[2]})")
        else:
            print("  No cargo records found in database")

if __name__ == "__main__":
    tracking_number = sys.argv[1] if len(sys.argv) > 1 else "TRK-000125"
    check_cargo_tracking_number(tracking_number)
