#!/usr/bin/env bash
STAMP=$(date +%s)
curl -s -X POST http://localhost:4000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"test.signup.${STAMP}@example.com\",\"password\":\"TestPass123!\",\"name\":\"Test User\"}" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
if 'user' in d:
    u = d['user']
    print(f'SIGNUP OK  email={u[\"email\"]}  role={u[\"role\"]}')
else:
    print('SIGNUP ERROR:', d)
"
