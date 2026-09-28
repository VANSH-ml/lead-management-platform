#!/usr/bin/env bash
cd ~/vansh-crm
node --import tsx/esm server/index.ts &
API_PID=$!
sleep 5
echo "Checking API health..."
curl -s http://localhost:4000/api/health
echo ""
kill $API_PID 2>/dev/null
