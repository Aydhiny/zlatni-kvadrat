#!/usr/bin/env bash
# Warn if .env files are missing before running backend or frontend commands.
# This runs before every bash tool call.

BACKEND_ENV="backend/.env"
FRONTEND_ENV="frontend/.env"

MISSING=()

if [ ! -f "$BACKEND_ENV" ]; then
  MISSING+=("backend/.env")
fi

if [ ! -f "$FRONTEND_ENV" ]; then
  MISSING+=("frontend/.env")
fi

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "WARNING: The following .env files are missing:" >&2
  for f in "${MISSING[@]}"; do
    echo "   - $f (copy from ${f%.env}/.env.example)" >&2
  done
  echo "" >&2
fi

# Always exit 0 — this is a warning, not a blocker.
exit 0
