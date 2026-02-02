#!/bin/bash

# Configuration
CONTAINER_NAME="malaysian-callbook-db-1"
DB_USER="postgres"
# Find the latest backup file if one isn't specified
if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "Searching for latest backup file (checking current directory and ./backups/)..."
    # Look for .sql and .sql.gz files in current dir and backups/, sort by time desc
    LATEST_BACKUP=$(ls -t *.sql *.sql.gz backups/*.sql backups/*.sql.gz 2>/dev/null | head -n 1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_FILE="$LATEST_BACKUP"
        echo "Found latest backup: $BACKUP_FILE"
    else
        echo "Error: No .sql or .sql.gz backup files found in current directory or ./backups/"
        echo "Please place your backup file here."
        exit 1
    fi
fi

# Restore command

echo "Ensuring required roles and extensions exist..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "
-- Create roles if they don't exist
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN CREATE ROLE anon NOLOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN CREATE ROLE authenticated NOLOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'dashboard_user') THEN CREATE ROLE dashboard_user NOLOGIN NOINHERIT; END IF;
  -- Fixed: Removed conflicting NOLOGIN flag for roles that need LOGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_admin') THEN CREATE ROLE supabase_admin LOGIN CREATEROLE NOINHERIT PASSWORD 'password'; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_auth_admin') THEN CREATE ROLE supabase_auth_admin LOGIN NOINHERIT CREATEROLE PASSWORD 'password'; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_storage_admin') THEN CREATE ROLE supabase_storage_admin LOGIN NOINHERIT CREATEROLE PASSWORD 'password'; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticator') THEN CREATE ROLE authenticator LOGIN NOINHERIT PASSWORD 'password'; END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'supabase_functions_admin') THEN CREATE ROLE supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION; END IF;
END
\$\$;

GRANT anon TO postgres;
GRANT authenticated TO postgres;
GRANT service_role TO postgres;
GRANT supabase_admin TO postgres;
GRANT supabase_auth_admin TO postgres;
GRANT supabase_storage_admin TO postgres;
GRANT supabase_functions_admin TO postgres;
ALTER USER postgres WITH SUPERUSER;

-- Enable extensions (Matching schemas from backup dump)
CREATE EXTENSION IF NOT EXISTS \"pg_cron\" WITH SCHEMA \"pg_catalog\";
CREATE EXTENSION IF NOT EXISTS \"pg_net\" WITH SCHEMA \"public\";
"

echo "Cleaning up existing schemas to prevent conflicts..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "
DROP SCHEMA IF EXISTS auth CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;
DROP SCHEMA IF EXISTS realtime CASCADE;
DROP SCHEMA IF EXISTS vault CASCADE;
DROP SCHEMA IF EXISTS graphql CASCADE;
DROP SCHEMA IF EXISTS graphql_public CASCADE;
DROP SCHEMA IF EXISTS extensions CASCADE;
DROP SCHEMA IF EXISTS pgbouncer CASCADE;
"

echo "Starting restore... Filtering incompatible commands..."

# Filter out transaction_timeout, ownership changes, and privileges to avoid errors
FILTER_CMD="sed -e 's/^SET transaction_timeout/-- &/' -e 's/^ALTER OWNER/-- &/' -e 's/^GRANT/-- &/' -e 's/^REVOKE/-- &/'"

if [[ "$BACKUP_FILE" == *.gz ]]; then
    zcat "$BACKUP_FILE" | eval "$FILTER_CMD" | docker exec -i -u "$DB_USER" "$CONTAINER_NAME" psql -U "$DB_USER" -v ON_ERROR_STOP=0
else
    cat "$BACKUP_FILE" | eval "$FILTER_CMD" | docker exec -i -u "$DB_USER" "$CONTAINER_NAME" psql -U "$DB_USER" -v ON_ERROR_STOP=0
fi

echo "Restore process completed."

echo "Updating cron job to use local functions container..."
# Update the cron job to point to http://functions:8000 instead of Supabase Cloud
docker exec -i -u "$DB_USER" "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "
UPDATE cron.job 
SET command = replace(command, 'https://cyhvmzreenhvxiwuqahb.supabase.co/functions/v1/license-reminder', 'http://functions:8000') 
WHERE jobname = 'license-reminder-daily';
"

echo "Database preparation finished."
