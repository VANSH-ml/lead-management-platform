#!/usr/bin/env bash
sudo service postgresql start 2>/dev/null || true
cd ~/vansh-crm
echo "Starting API..."
node --import tsx/esm server/index.ts 2>&1
