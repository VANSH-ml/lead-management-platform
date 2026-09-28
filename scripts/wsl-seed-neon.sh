#!/usr/bin/env bash
set -e
export DATABASE_URL="postgresql://neondb_owner:npg_ZGhMyY7P1HmI@ep-purple-mode-b4rr36n6-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
cd ~/vansh-crm
node scripts/seed-main-db.mjs
