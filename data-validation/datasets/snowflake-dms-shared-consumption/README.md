# Snowflake DMS Shared Consumption Validation

## Purpose

Validate whether the Snowflake shared consumption tables align with SQL Server
DMS, which is the current source of record.

The test is also intended to measure whether Snowflake is fresher or more
complete because it is expected to update more often.

## Sources

Candidate source:

- Snowflake database:
  `CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE`
- Snowflake schema:
  `CONSUMPTION_SHARED_E100030`
- Snowflake tables:
  - `REPAIR_ORDER_RAW`
  - `VEHICLE_SALES_RAW`

Source of record:

- SQL Server: `L1-DWASQL-02,12010`
- Database: `DMS`
- Connector id: `sqlserver-l1-dwasql-02-12010-dms`

## Dealer Scope

- Jaguar Land Rover Santa Monica
- Mercedes-Benz of Calabasas

Reviewer-facing outputs identify the stores by the DMS source-native
`cora_acct_code` field. The current validation scope uses `SA466-S` and
`SA476-S`.

## Current Known SQL Server Candidate Matches

Vehicle sales:

- `dbo.vehiclesales`
- `dbo.vehiclesalescurrent`
- `dbo.vehiclesalescurrent_bkp15022024`
- `dbo.VSC_NWMS580Archive`
- `dbo.vsc_fiproducts_union_stage`
- `dbo.vw_cte_vscBookStage*`

Repair/service:

- `dbo.servicesalesclosed`
- `dbo.servicesalesopen`
- `dbo.servicesalesdetailsclosed`
- `dbo.servicesalesdetailsclosed_new`
- `dbo.appointments`
- `dbo.appointments_staging`
- `dbo.vw_FactServiceDetail_staging`
- `dbo.vw_FactServiceOpen_staging_18082015`
- `dbo.vw_FactService_staging_18082015`
- `dbo.vw_FactServiceDetailSlim_staging`

Repair order matching uses the service-sales header tables for RO-level
comparison. Service detail and appointment tables are supporting context, not
the primary comparison grain. DMS repair-order validation now collapses
open/closed overlap to one row per `cora_acct_code` plus RO number, preferring
closed rows when both exist.

Repair-order amount comparison uses DMS customer-pay core fields against
Snowflake `PAYCPTOTAL`:

```text
laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay
```

The active changed-value materiality threshold is documented in
`config/accuracy-thresholds.yml`.

## Output Model

Excel dashboards read from:

```text
current/summaries/
current/exceptions/
current/audit/
```

Historical run snapshots are archived under:

```text
runs/<run-id>/
```

## Current Build State

Profiling, daily summary comparison, bounded detail exception output,
exception history, the Excel review workbook, and daily operation hardening are
implemented. The validation review guide is implemented.

The current output contract uses `cora_acct_code` for dealer grouping. Older
non-source-native wording was retired because it did not match the DMS or
vendor ecosystem.

## Daily Operation

Run the daily validation workflow from the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1
```

This refreshes detail exceptions, updates exception history, rebuilds the Excel
workbook, and writes `current/audit/daily_operator_status.json`.

See `DAILY_OPERATION_RUNBOOK.md` for optional arguments, success signals, and
failure handling.

## Review Guidance

Use `VALIDATION_REVIEW_GUIDE.md` to classify exceptions as timing, filtering,
transformation, mapping, source-gap, or unexplained differences. The guide also
documents DMS source-of-record language, repair-order caveats, and the minimum
escalation packet for follow-up work.

Repair-order logic repair evidence is documented in:

- `REPAIR_ORDER_REBUILD_FINDINGS.md`
- `REPAIR_ORDER_READBACK_FINDINGS.md`
