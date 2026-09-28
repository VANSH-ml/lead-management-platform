#!/usr/bin/env bash
set -e
sudo service postgresql start 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE vansh_crm_test OWNER crm_user;" 2>/dev/null || echo "Test DB already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vansh_crm_test TO crm_user;"
sudo -u postgres psql -d vansh_crm_test -c "GRANT CREATE ON SCHEMA public TO crm_user;"
echo "==> Test DB ready: vansh_crm_test"
