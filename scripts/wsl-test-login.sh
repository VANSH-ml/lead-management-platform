#!/usr/bin/env bash
curl -s -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"founder.seed@vanshcrm.com","password":"TestSeed123!"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('LOGIN OK - user:', d['user']['email'], '| role:', d['user']['role'])" 2>/dev/null \
  || echo "Login response received (check above for details)"
