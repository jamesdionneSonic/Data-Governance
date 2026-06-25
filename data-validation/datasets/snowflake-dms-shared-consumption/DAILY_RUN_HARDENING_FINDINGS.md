# Daily Run Hardening Findings

Dataset: `snowflake-dms-shared-consumption`

## Implemented Command

Daily operation now has one top-level PowerShell command:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1
```

## Behavior

The command runs:

- live detail exception refresh;
- exception history update;
- Excel workbook rebuild from local `current/` CSV files;
- compact operator status output.

## Operator Status

The command writes:

- `current/audit/daily_operator_status.json`

The status file includes:

- start and completion timestamps;
- final status;
- detail run ID and status;
- workbook rebuild status;
- open exception count;
- resolved-since-last-run count;
- warning and error counts;
- error message if the command fails.

## Verification Run

The hardened daily command succeeded on run `20260624T195406Z`.

Result:

- detail status: `succeeded`;
- workbook status: `succeeded`;
- open exceptions: `1558`;
- resolved since last run: `0`;
- warning count: `0`;
- error count: `0`.

## Current Limitation

The workbook is rebuilt from stable local CSVs. Native Power Query connections
are not embedded.

## Next Build Step

`WP-DVL-010` should document the validation review guide: how to interpret
timing differences, missing records, changed values, and repair-order caveats.
