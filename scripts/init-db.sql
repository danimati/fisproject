-- Initialize database with extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created by Alembic migrations, but we can add some basic ones here

-- Set timezone
SET timezone = 'UTC';
