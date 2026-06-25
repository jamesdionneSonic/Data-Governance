# Daily Operation Runbook

Dataset: `snowflake-dms-shared-consumption`

## One Command

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1
```

This command:

1. refreshes bounded detail exception outputs from Snowflake and SQL Server DMS;
2. updates exception history;
3. rebuilds the Excel review workbook from local `current/` CSV files;
4. writes compact operator status to `current/audit/daily_operator_status.json`.

The status JSON is written as UTF-8 without a byte-order mark so it can be read
by PowerShell, Python, Node.js, and Excel-adjacent tools.

## Optional Arguments

Use a different date window:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1 -DaysBack 14
```

Use a different exception row limit:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1 -RowLimit 500
```

Refresh CSVs/history without rebuilding the workbook:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1 -SkipWorkbook
```

## Success Signals

Check:

- `current/audit/daily_operator_status.json`
- `current/audit/run_status.csv`
- `current/audit/run_manifest.json`

Expected successful status:

- `status`: `succeeded`
- `detail_status`: `succeeded`
- `workbook_status`: `succeeded`
- `error_count`: `0`

Workbook:

- `excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`

## Failure Signals

If the command fails:

- read `error_message` in `current/audit/daily_operator_status.json`;
- keep the run ID from `current/audit/run_manifest.json` if one was written;
- do not edit source systems;
- hand the run ID and error message back to Codex for diagnosis.

## Review Order

1. Open the workbook.
2. Start with `Dashboard`.
3. Review `Vehicle Daily` and vehicle exception tabs first because vehicle
   sales has the strongest current match quality.
4. Treat repair-order exceptions as mapping and rule-discovery evidence until
   dealer-code crosswalk and amount semantics are confirmed.

## Guardrails

- SQL Server DMS remains the source of record during validation.
- The workflow writes local CSV and workbook files only.
- The workflow does not build objects in Snowflake or SQL Server.
- The workbook contains no credentials.
