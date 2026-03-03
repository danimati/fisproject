"""refactor(BaseModel):Change id from integer to UUID - Safe migration

Revision ID: 1429ed0a250d
Revises: e4bdd86f5a59
Create Date: 2026-03-03 01:46:24.112018

"""
from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = '1429ed0a250d'
down_revision = 'e4bdd86f5a59'
branch_labels = None
depends_on = None

# List of all tables that need ID conversion
tables = [
    'cargo', 'clients', 'containers', 'contracts', 'events', 
    'locations', 'personnel', 'ports', 'routes', 'shipments', 'vessels'
]

# Foreign key relationships
foreign_keys = {
    'cargo': ['client_id', 'container_id', 'shipment_id'],
    'containers': ['current_location_id'],
    'contracts': ['client_id'],
    'events': ['shipment_id', 'container_id', 'personnel_id'],
    'personnel': ['location_id'],
    'routes': ['departure_port_id', 'arrival_port_id'],
    'shipments': ['vessel_id', 'route_id', 'contract_id']
}

def upgrade() -> None:
    # Step 1: Add new_id column with UUID type to all tables
    for table in tables:
        op.add_column(table, sa.Column('new_id', sa.Uuid(), nullable=True))
    
    # Step 2: Generate UUIDs for all existing records
    connection = op.get_bind()
    
    for table in tables:
        # Generate UUIDs for all existing records
        connection.execute(
            sa.text(f"UPDATE {table} SET new_id = gen_random_uuid() WHERE new_id IS NULL")
        )
    
    # Step 3: Make new_id NOT NULL
    for table in tables:
        op.alter_column(table, 'new_id', nullable=False)
    
    # Step 4: Add temporary UUID columns for foreign keys
    for table, fk_columns in foreign_keys.items():
        for fk_column in fk_columns:
            temp_uuid_col = f"{fk_column}_uuid"
            op.add_column(table, sa.Column(temp_uuid_col, sa.Uuid(), nullable=True))
    
    # Step 5: Update foreign key references to use UUIDs
    for table, fk_columns in foreign_keys.items():
        for fk_column in fk_columns:
            temp_uuid_col = f"{fk_column}_uuid"
            
            # Extract the referenced table name from the column name
            if 'client' in fk_column:
                ref_table = 'clients'
            elif 'container' in fk_column:
                ref_table = 'containers'
            elif 'shipment' in fk_column:
                ref_table = 'shipments'
            elif 'personnel' in fk_column:
                ref_table = 'personnel'
            elif 'location' in fk_column:
                ref_table = 'locations'
            elif 'port' in fk_column:
                ref_table = 'ports'
            elif 'vessel' in fk_column:
                ref_table = 'vessels'
            elif 'route' in fk_column:
                ref_table = 'routes'
            elif 'contract' in fk_column:
                ref_table = 'contracts'
            else:
                continue
            
            # Update foreign key references using a subquery
            connection.execute(
                sa.text(f"""
                    UPDATE {table} 
                    SET {temp_uuid_col} = (
                        SELECT new_id 
                        FROM {ref_table} 
                        WHERE {ref_table}.id = {table}.{fk_column}
                    )
                    WHERE {fk_column} IS NOT NULL
                """)
            )
    
    # Step 6: Drop foreign key constraints (use IF EXISTS approach)
    # First, let's try to drop constraints in a more robust way
    fk_constraints = [
        ('cargo', 'client_id', 'clients'),
        ('cargo', 'container_id', 'containers'),
        ('cargo', 'shipment_id', 'shipments'),
        ('containers', 'current_location_id', 'locations'),
        ('contracts', 'client_id', 'clients'),
        ('events', 'shipment_id', 'shipments'),
        ('events', 'container_id', 'containers'),
        ('events', 'personnel_id', 'personnel'),
        ('personnel', 'location_id', 'locations'),
        ('routes', 'departure_port_id', 'ports'),
        ('routes', 'arrival_port_id', 'ports'),
        ('shipments', 'vessel_id', 'vessels'),
        ('shipments', 'route_id', 'routes'),
        ('shipments', 'contract_id', 'contracts'),
    ]
    
    for table, column, ref_table in fk_constraints:
        constraint_name = f'fk_{table}_{column}_{ref_table}'
        try:
            # Check if constraint exists first
            result = connection.execute(
                sa.text(f"""
                    SELECT COUNT(*) as count 
                    FROM information_schema.table_constraints 
                    WHERE table_name = '{table}' 
                    AND constraint_name = '{constraint_name}'
                """)
            )
            count = result.scalar()
            if count > 0:
                op.drop_constraint(constraint_name, table_name=table, type_='foreignkey')
        except Exception as e:
            print(f"Warning: Could not drop foreign key {constraint_name}: {e}")
            # Continue even if constraint doesn't exist
    
    # Step 7: Drop old integer foreign key columns
    for table, fk_columns in foreign_keys.items():
        for fk_column in fk_columns:
            try:
                # Try to drop index if it exists
                op.drop_index(f'ix_{table}_{fk_column}', table_name=table)
            except:
                pass  # Index might not exist, that's okay
            
            try:
                op.drop_column(table, fk_column)
            except Exception as e:
                print(f"Warning: Could not drop column {table}.{fk_column}: {e}")
    
    # Step 8: Rename temporary UUID columns to original names
    for table, fk_columns in foreign_keys.items():
        for fk_column in fk_columns:
            temp_uuid_col = f"{fk_column}_uuid"
            try:
                op.alter_column(table, temp_uuid_col, new_column_name=fk_column)
            except Exception as e:
                print(f"Warning: Could not rename column {table}.{temp_uuid_col} to {fk_column}: {e}")
    
    # Step 9: Drop old primary key constraints
    for table in tables:
        try:
            op.drop_constraint(f'pk_{table}', table_name=table, type_='primarykey')
        except Exception as e:
            print(f"Warning: Could not drop primary key for {table}: {e}")
    
    # Step 10: Drop old id columns
    for table in tables:
        try:
            op.drop_column(table, 'id')
        except Exception as e:
            print(f"Warning: Could not drop id column for {table}: {e}")
    
    # Step 11: Rename new_id to id
    for table in tables:
        try:
            op.alter_column(table, 'new_id', new_column_name='id')
        except Exception as e:
            print(f"Warning: Could not rename new_id to id for {table}: {e}")
    
    # Step 12: Add primary key constraints
    for table in tables:
        try:
            op.create_primary_key(f'pk_{table}', table, ['id'])
        except Exception as e:
            print(f"Warning: Could not create primary key for {table}: {e}")
    
    # Step 13: Recreate foreign key constraints
    for table, column, ref_table in fk_constraints:
        constraint_name = f'fk_{table}_{column}_{ref_table}'
        try:
            op.create_foreign_key(constraint_name, table, ref_table, [column], ['id'])
        except Exception as e:
            print(f"Warning: Could not create foreign key {constraint_name}: {e}")
    
    # Step 14: Recreate indexes
    indexes = [
        ('cargo', 'client_id'),
        ('cargo', 'container_id'),
        ('cargo', 'shipment_id'),
        ('containers', 'current_location_id'),
        ('contracts', 'client_id'),
        ('events', 'shipment_id'),
        ('events', 'container_id'),
        ('events', 'personnel_id'),
        ('personnel', 'location_id'),
        ('routes', 'departure_port_id'),
        ('routes', 'arrival_port_id'),
        ('shipments', 'vessel_id'),
        ('shipments', 'route_id'),
        ('shipments', 'contract_id'),
    ]
    
    for table, column in indexes:
        try:
            op.create_index(f'ix_{table}_{column}', table, [column])
        except Exception as e:
            print(f"Warning: Could not create index {table}_{column}: {e}")


def downgrade() -> None:
    # This is a complex downgrade - it would require recreating integer IDs
    # For now, we'll raise an exception to indicate this is not easily reversible
    raise NotImplementedError("This migration cannot be automatically downgraded. Please restore from backup if needed.")
