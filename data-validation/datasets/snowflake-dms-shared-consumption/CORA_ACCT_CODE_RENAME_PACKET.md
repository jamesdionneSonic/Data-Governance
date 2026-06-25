# CORA-001: Replace Dealer Family Aliases With `cora_acct_code`

Status: completed

Dataset: `snowflake-dms-shared-consumption`

## Reason

The validation output currently uses temporary labels such as `dealer_name`,
`dealer family`, and `SA476 family (dealer name pending)`.

That is not good enough for vendor-facing or support-facing review. The vendor
and DMS ecosystem know this identifier as `cora_acct_code`, and the dashboard
needs to show that term directly so reviewers know exactly what they are looking
at.

## Decision Guardrail

Do not alias source/vendor business identifiers into invented friendly names.
Use the source-native column name in CSVs, dashboards, exception files, and
review documentation.

Friendly explanation can be added next to the field, but it cannot replace the
source-native field.

## Required Output Contract Change

Replace business-facing `dealer_name` usage with:

```text
cora_acct_code
```

For this dataset:

- DMS `cora_acct_code` comes from `DMS.dbo.dm_cora_account`.
- `cora_acct_id = 445` maps to `cora_acct_code = SA466-S`.
- `cora_acct_id = 20246` maps to `cora_acct_code = SA476-S`.
- Snowflake dealer/source fields must remain visible as diagnostic source
  fields when needed, not hidden behind DMS labels.

## Files To Change In One Pass

SQL:

- `sql/sqlserver/dms_repair_order_daily_summary.sql`
- `sql/sqlserver/dms_repair_order_detail_extract.sql`
- `sql/sqlserver/dms_vehicle_sales_daily_summary.sql`
- `sql/sqlserver/dms_vehicle_sales_detail_extract.sql`
- `sql/snowflake/repair_order_daily_summary.sql`
- `sql/snowflake/repair_order_detail_extract.sql`
- `sql/snowflake/vehicle_sales_daily_summary.sql`
- `sql/snowflake/vehicle_sales_detail_extract.sql`

Runner and workbook:

- `scripts/run_validation.mjs`
- workbook rebuild/output logic that labels dashboard and sheet columns

Config and contracts:

- `config/output-contract.yml`
- `config/source-mapping.yml`
- sample header CSVs under `current/`

Reviewer docs:

- `README.md`
- `VALIDATION_REVIEW_GUIDE.md`
- repair-order findings/readback documents where the retired language still
  appears

## Implementation Steps

1. Update SQL Server DMS extracts to join or otherwise source
   `DMS.dbo.dm_cora_account.cora_acct_code`.
2. Replace all active `dealer_name` output fields with `cora_acct_code`.
3. Replace temporary `SA466 family...` and `SA476 family...` labels with
   actual `cora_acct_code` values.
4. Preserve Snowflake source dealer fields as separate diagnostic columns where
   they are needed for mapping review.
5. Update output contracts and sample headers.
6. Update exception-id and business-key generation to use `cora_acct_code`.
7. Rebuild the workbook so the dashboard and detail sheets show
   `cora_acct_code`.
8. Decide whether to migrate old exception history or reset it with a clear
   audit note, because the key shape changes.
9. Run the one-command daily validation and document the run id.
10. Run a text scan to prove the retired aliases are gone from active outputs.

## Acceptance

- Active outputs use `cora_acct_code`.
- Active reviewer docs use `cora_acct_code`.
- No active SQL or runner logic emits `dealer family` or
  `family (dealer name pending)`.
- The workbook dashboard is understandable to people who know the DMS/vendor
  ecosystem.
- The daily run succeeds after the change.
- The packet readout records the history migration/reset decision.

## Completion Readout

Completed on 2026-06-25.

Live runs:

- Summary refresh run id: `20260625T110927Z`
- Detail/workbook daily run id: `20260625T110943Z`

Changed:

- SQL Server DMS repair extracts now source `cora_acct_code` from
  `DMS.dbo.dm_cora_account`.
- SQL Server DMS vehicle extracts map branch patterns to DMS
  `cora_acct_code`.
- Snowflake extracts map source dealer fields to DMS `cora_acct_code` for
  comparison and keep raw source dealer fields as diagnostics where available.
- Summary CSVs, exception CSVs, open exception history, workbook sheets, and
  reviewer-facing documentation now use `cora_acct_code`.

History decision:

- Exception identity changed because the business key now uses
  `cora_acct_code`.
- The first corrected daily run intentionally records old open exceptions as
  resolved and creates the corrected open exception set under the new key shape.
- On the completion run, `resolved_since_last_run.csv` had `1194` rows and
  `open_exceptions.csv` had `1194` rows. Treat that as a contract migration
  effect, not a true data-resolution wave.

Verification:

- Plan-only guard passed with run id `20260625T103126Z`.
- Live summary refresh succeeded.
- Live detail refresh and workbook rebuild succeeded.
- Active SQL, config, runner logic, summary outputs, and exception outputs no
  longer contain `dealer_name` or the retired SA-family pending labels.

## Out Of Scope

- Changing source-system tables or creating database objects.
- Renaming unrelated catalog/lineage alias concepts.
- Inferring dealer display names that are not surfaced in the source metadata.
