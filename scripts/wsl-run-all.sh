#!/usr/bin/env bash
set -e

echo "==> Starting PostgreSQL..."
sudo service postgresql start 2>/dev/null || true

echo "==> Migrating main DB (vansh_crm)..."
cd ~/vansh-crm
node scripts/db-migrate.mjs

echo "==> Migrating test DB (vansh_crm_test)..."
DATABASE_URL="postgresql://crm_user:crm_local_pass@localhost:5432/vansh_crm_test" node scripts/db-migrate.mjs

echo "==> Seeding users..."
node testing/functional/seed-users.mjs

echo "==> Seeding CRM data..."
node testing/functional/seed-crm.mjs

echo "==> Seeding activity..."
node testing/functional/seed-activity.mjs

echo ""
echo "============================================"
echo "  ALL SETUP COMPLETE!"
echo "  Login: founder.seed@vanshcrm.com"
echo "  Password: TestSeed123!"
echo "============================================"
