#!/usr/bin/env bash
sudo service postgresql start 2>/dev/null || true
psql postgresql://crm_user:crm_local_pass@localhost:5432/vansh_crm -c "SELECT email, role FROM users ORDER BY role;"
