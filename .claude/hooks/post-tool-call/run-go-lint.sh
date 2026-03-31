#!/usr/bin/env bash
# After editing a .go file, run golangci-lint on the changed package.
# TOOL_INPUT_FILE_PATH is set by Claude Code to the file that was just edited.

FILE="${TOOL_INPUT_FILE_PATH:-}"

if [[ "$FILE" == *.go ]]; then
  PACKAGE_DIR=$(dirname "$FILE")
  echo "Running golangci-lint on $PACKAGE_DIR..." >&2

  if command -v golangci-lint &>/dev/null; then
    cd backend && golangci-lint run "./${PACKAGE_DIR#backend/}/..." 2>&1
  else
    echo "golangci-lint not found — skipping lint. Install from https://golangci-lint.run/usage/install/" >&2
  fi
fi

exit 0
