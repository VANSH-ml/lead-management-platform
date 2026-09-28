#!/usr/bin/env bash
set -e

echo "==> Starting PostgreSQL..."
sudo service postgresql start

echo "==> Creating DB user and database..."
sudo -u postgres psql <<'SQL'
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'crm_user') THEN
    CREATE USER crm_user WITH PASSWORD 'crm_local_pass';
  END IF;
END $$;
SELECT 'user ok';

SELECT 'creating db...' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'vansh_crm');
SQL

sudo -u postgres psql -c "CREATE DATABASE vansh_crm OWNER crm_user;" 2>/dev/null || echo "DB already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vansh_crm TO crm_user;"
sudo -u postgres psql -d vansh_crm -c "GRANT CREATE ON SCHEMA public TO crm_user;"

echo "==> DB_READY"
echo "Connection string: postgresql://crm_user:crm_local_pass@localhost:5432/vansh_crm"
