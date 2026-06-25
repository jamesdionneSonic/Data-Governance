# Excel Refresh Findings

Dataset: `snowflake-dms-shared-consumption`

Workbook:

- `excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`

Latest data run represented in workbook:

- `20260624T190123Z`

## Workbook Contents

The workbook now contains:

- `Dashboard`
- `Sources`
- `Vehicle Daily`
- `Repair Daily`
- `Open Exceptions`
- `Resolved`
- `Changed Records`
- `Veh Missing SF`
- `Veh Missing DMS`
- `RO Missing SF`
- `RO Missing DMS`
- `Run Status`

## Source CSVs

The workbook was rebuilt from stable local CSV outputs under `current/`:

- `current/summaries/vehicle_sales_daily_compare.csv`
- `current/summaries/repair_order_daily_compare.csv`
- `current/exceptions/open_exceptions.csv`
- `current/exceptions/resolved_since_last_run.csv`
- `current/exceptions/changed_records.csv`
- `current/exceptions/vehicle_sales_missing_from_snowflake.csv`
- `current/exceptions/vehicle_sales_missing_from_dms.csv`
- `current/exceptions/repair_orders_missing_from_snowflake.csv`
- `current/exceptions/repair_orders_missing_from_dms.csv`
- `current/audit/run_status.csv`

## Refresh Model

Native Excel Power Query connections are not embedded in this workbook. The
available workbook authoring runtime does not expose Power Query/CSV connection
creation.

The implemented refresh model is:

1. Run the validation script to refresh `current/` CSVs.
2. Rebuild the workbook from those stable CSVs.
3. Open the workbook for review.

This keeps the workbook credential-free and avoids storing any source-system
connection details inside Excel.

## Verification

The workbook build completed with:

- `12` worksheets;
- `12` Excel tables;
- no formula-error matches for `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, or
  `#N/A`;
- rendered previews for dashboard and representative data tabs.

## Next Build Step

`WP-DVL-009` should harden this into one operator command that runs data
refresh, exception history, and workbook rebuild together.
