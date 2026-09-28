#!/usr/bin/env bash
set -e
cd ~/vansh-crm

# Configure git identity
git config user.email "vansh.wadhwani@vanshcrm.com"
git config user.name "Vansh Wadhwani"

# Init and first commit
git init
git add .
git commit -m "feat: Vansh CRM — initial release with signup, rich seed data, Vercel config"

echo ""
echo "============================================"
echo "  Git repo initialized and committed."
echo "  Now run the following to push to GitHub:"
echo ""
echo "  git remote add origin https://github.com/YOUR_USERNAME/vansh-crm.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo "============================================"
