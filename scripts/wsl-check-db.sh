#!/usr/bin/env bash
sudo service postgresql start 2>/dev/null || true
psql postgresql://crm_user:crm_local_pass@localhost:5432/vansh_crm -c "
SELECT 'users' as tbl, COUNT(*) FROM users
UNION ALL SELECT 'companies', COUNT(*) FROM companies
UNION ALL SELECT 'contacts', COUNT(*) FROM contacts
UNION ALL SELECT 'activity_events', COUNT(*) FROM activity_events;
"
