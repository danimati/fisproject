#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def test_tracking_number_insert(tracking_number):
    """Test inserting a tracking number directly to see what happens"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as connection:
        print(f"Testing direct insert with tracking number: {tracking_number}")
        
        try:
            # Start a transaction
            trans = connection.begin()
            
            # Try to insert directly
            result = connection.execute(text("""
                INSERT INTO cargo (tracking_number, description, cargo_type, weight, volume, is_fragile, is_dangerous, value, client_id, status)
                VALUES (:tracking_number, :description, :cargo_type, :weight, :volume, :is_fragile, :is_dangerous, :value, :client_id, :status)
                RETURNING id
            """), {
                "tracking_number": tracking_number,
                "description": "Test cargo",
                "cargo_type": "general",
                "weight": 1500.0,
                "volume": 10.5,
                "is_fragile": False,
                "is_dangerous": False,
                "value": 50000.0,
                "client_id": 1,
                "status": "pending"
            })
            
            cargo_id = result.fetchone()[0]
            print(f"SUCCESS: Inserted cargo with ID: {cargo_id}")
            
            # Rollback the test insert
            trans.rollback()
            print("Test insert rolled back")
            
        except Exception as e:
            print(f"ERROR during direct insert: {e}")
            trans.rollback()
        
        # Check what tracking numbers exist
        print("\nCurrent tracking numbers in database:")
        result = connection.execute(text("SELECT tracking_number FROM cargo"))
        tracking_numbers = [row[0] for row in result.fetchall()]
        print(f"Found: {tracking_numbers}")

if __name__ == "__main__":
    tracking_number = sys.argv[1] if len(sys.argv) > 1 else "TRK-000125"
    test_tracking_number_insert(tracking_number)
