#!/bin/bash

# Migration script for running Alembic migrations

set -e

echo "Running database migrations..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations
alembic upgrade head

echo "Migrations completed successfully!"
