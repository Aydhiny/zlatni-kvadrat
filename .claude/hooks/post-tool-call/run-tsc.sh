#!/usr/bin/env bash
# After editing a .ts or .tsx file, run TypeScript type check.
# TOOL_INPUT_FILE_PATH is set by Claude Code to the file that was just edited.

FILE="${TOOL_INPUT_FILE_PATH:-}"

if [[ "$FILE" == *.tsx ]] || [[ "$FILE" == *.ts ]]; then
  echo "Running tsc --noEmit..." >&2

  if [ -f "frontend/package.json" ]; then
    cd frontend && npx tsc --noEmit 2>&1
  else
    echo "frontend/package.json not found — skipping tsc." >&2
  fi
fi

exit 0
