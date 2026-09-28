#!/usr/bin/env bash
# Sync changed source files from Windows mount to WSL native copy
set -e
WIN=/mnt/e/zero-cost-crm-main/zero-cost-crm-main
WSL=~/vansh-crm

cp "$WIN/server/app.ts"                        "$WSL/server/app.ts"
cp "$WIN/src/App.tsx"                          "$WSL/src/App.tsx"
cp "$WIN/src/components/LoginPage.tsx"         "$WSL/src/components/LoginPage.tsx"
cp "$WIN/src/components/SignupPage.tsx"        "$WSL/src/components/SignupPage.tsx"
cp "$WIN/src/hooks/useAuth.ts"                 "$WSL/src/hooks/useAuth.ts"

echo "Sync complete."
