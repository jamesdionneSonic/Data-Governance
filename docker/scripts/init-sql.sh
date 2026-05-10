#!/bin/bash
set -euo pipefail

if [ -x "/opt/mssql-tools/bin/sqlcmd" ]; then
  SQLCMD="/opt/mssql-tools/bin/sqlcmd"
elif [ -x "/opt/mssql-tools18/bin/sqlcmd" ]; then
  SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
else
  echo "[sql-init] sqlcmd not found in container image"
  exit 1
fi

if [ -z "${APP_DB_NAME:-}" ]; then
  echo "[sql-init] APP_DB_NAME is not set"
  exit 1
fi

echo "[sql-init] Waiting for SQL Server..."
for i in {1..60}; do
  "$SQLCMD" -S sqlserver -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" > /dev/null 2>&1 && break
  echo "[sql-init] SQL Server not ready yet... attempt $i/60"
  sleep 2
done

echo "[sql-init] Running initialization scripts..."
for script in /docker-entrypoint-initdb.d/*.sql; do
  echo "[sql-init] Executing $script"
  "$SQLCMD" -S sqlserver -U sa -P "$MSSQL_SA_PASSWORD" -v APP_DB_NAME="$APP_DB_NAME" -i "$script"
done

echo "[sql-init] Initialization complete."
