#!/usr/bin/env bash
set -e
NEON_URL="postgresql://neondb_owner:npg_ZGhMyY7P1HmI@ep-purple-mode-b4rr36n6-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "==> Applying schema to Neon..."
cd ~/vansh-crm
DATABASE_URL="$NEON_URL" node scripts/db-migrate.mjs
echo "==> Schema done."
