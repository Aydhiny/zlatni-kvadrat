#!/usr/bin/env bash
# After editing a Go domain model file, remind to create a migration.
# TOOL_INPUT_FILE_PATH is set by Claude Code to the file that was just edited.

FILE="${TOOL_INPUT_FILE_PATH:-}"

if [[ "$FILE" == *"/domain/"*.go ]]; then
  echo "" >&2
  echo "+-------------------------------------------------------------+" >&2
  echo "|  MIGRATION REMINDER                                          |" >&2
  echo "|                                                               |" >&2
  echo "|  You edited a domain model: $(basename "$FILE")" >&2
  echo "|                                                               |" >&2
  echo "|  Did you create a migration for this schema change?           |" >&2
  echo "|  Run: make migrate-create name=<your_migration_name>         |" >&2
  echo "|                                                               |" >&2
  echo "|  NEVER use GORM AutoMigrate — SQL migrations only.           |" >&2
  echo "+-------------------------------------------------------------+" >&2
fi

exit 0
