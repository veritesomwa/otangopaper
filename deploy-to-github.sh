#!/usr/bin/env bash
# One-shot: initialise the repo, commit everything, push to GitHub.
#
# Before running this:
#   1. Create an empty repo at https://github.com/<your-username>/otangopaper
#      (don't init it with a README — we'll push our own first commit).
#   2. Make sure you're authenticated with GitHub (gh auth login OR an SSH key
#      / personal access token configured for git).
#   3. Edit GH_USER below or pass it as $1:   ./deploy-to-github.sh your-name
#
# Then:
#   chmod +x deploy-to-github.sh
#   ./deploy-to-github.sh

set -euo pipefail

GH_USER="${1:-veritesomwa}"
REPO_NAME="otangopaper"
REMOTE_URL="https://github.com/${GH_USER}/${REPO_NAME}.git"

cd "$(dirname "$0")"

echo "→ Cleaning up stale build artefacts"
rm -rf dist dist[0-9A-Z]* distEdit* distRes distRevert 2>/dev/null || true
rm -rf .git

echo "→ Initialising new git repo"
git init -q -b main
git config user.email "veritesomwa@gmail.com"
git config user.name  "Verite"

echo "→ Staging"
git add -A

echo "→ Sanity check: no .env files about to be committed"
if git ls-files | grep -E '(^|/)\.env$'; then
  echo "✗ Aborting — an .env file would be committed. Fix .gitignore first." >&2
  exit 1
fi
echo "  ✓ clean"

echo "→ Committing"
git commit -q -m "Initial commit: OtangoPaper document builder

- React + Vite frontend with 46 templates across 9 categories
- Click-to-edit inline editing across every template
- Magic Tool wizard with 9 category-specific flows
- AI Tools panel: 9 client-side transformations + live suggestions
- Editing tools: font/size/spacing/bold/italic/underline/alignment/color/bullet
- Section manager with drag-drop reorder + visibility toggles
- References section across all 14 resume templates
- Export to PDF / DOCX / PNG / share link
- Undo/redo with snapshot autosave
- Express + MongoDB backend with Google + email/password auth (in /server)
- OtangoPaper logo, favicon, blue brand palette"

echo "→ Setting remote $REMOTE_URL"
git remote add origin "$REMOTE_URL"

echo "→ Pushing"
git push -u origin main

echo ""
echo "✓ Pushed to $REMOTE_URL"
