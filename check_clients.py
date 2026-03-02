#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def check_clients():
    """Check what clients exist in the database"""
    engine = create_engine(settings.database_url)
    
    with engine.connect() as connection:
        print("Checking clients table structure...")
        
        # Check table structure
        try:
            result = connection.execute(text("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'clients' 
                ORDER BY ordinal_position;
            """))
            columns = result.fetchall()
            print("Clients table structure:")
            for col in columns:
                print(f"  {col[0]}: {col[1]}")
                
            print("\nChecking clients in database...")
            
            # Get all clients
            result = connection.execute(text("""
                SELECT * FROM clients ORDER BY id
            """))
            clients = result.fetchall()
            
            if clients:
                print(f"Found {len(clients)} clients:")
                for client in clients:
                    print(f"  {client}")
            else:
                print("No clients found in database")
                print("You need to create a client first before creating cargo")
                
        except Exception as e:
            print(f"Error checking clients: {e}")

if __name__ == "__main__":
    check_clients()
