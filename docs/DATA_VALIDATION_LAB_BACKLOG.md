# Data Validation Lab Backlog

## Objective

Build a reusable, read-only validation workflow that compares candidate data
sources against the current source of record, writes local CSV outputs, supports
Excel dashboards, and can run daily with one command.

## Current Priority Dataset

`data-validation/datasets/snowflake-dms-shared-consumption`

Scope:

- Snowflake `REPAIR_ORDER_RAW`
- Snowflake `VEHICLE_SALES_RAW`
- SQL Server `DMS` strong candidate matches
- Jaguar Land Rover Santa Monica
- Mercedes-Benz of Calabasas

## Backlog

### DVL-001 - Project Scaffold

Status: completed

Create the reusable `data-validation` project structure, ADR, contract,
contributor guidance, dataset folder, config skeletons, SQL placeholders, and
work packet plan.

Acceptance:

- reusable project folder exists;
- local business CSV outputs are ignored;
- first dataset has README/config/sql/current/runs/excel/scripts folders;
- workbook template exists.

### DVL-002 - Live Profiling SQL

Status: completed

Write read-only Snowflake and SQL Server profiling SQL for both subject areas.

Acceptance:

- row counts by dealer and day;
- candidate key null and duplicate checks;
- date min/max;
- load/update timestamp discovery;
- material amount/status field inventory;
- no DDL/DML.

Completion note:

- Added Snowflake profile SQL for `VEHICLE_SALES_RAW` and `REPAIR_ORDER_RAW`.
- Added SQL Server DMS profile SQL for `vehiclesales`, `vehiclesalescurrent`,
  `servicesalesdetailsclosed`, and `appointments`.
- Repair/service SQL keeps service detail and appointment grains separate until
  live profiling proves the correct comparison grain.

### DVL-003 - Profiling Runner

Status: completed

Build the first `run_validation.py` profile mode and `run_validation.ps1`
wrapper.

Acceptance:

- one command runs profile extracts;
- outputs write to `current/audit`, `current/raw`, and `current/summaries`;
- run archive is created under `runs/<run-id>`;
- failed connectors produce a clear audit row.

Completion note:

- Added `run_validation.mjs` as the maintained connector runner.
- Updated `run_validation.ps1` to provide the one-command profile entry point.
- Kept `run_validation.py` as a compatibility wrapper.
- Runner supports `--plan-only` for SQL/output validation without live source
  connections.

### DVL-004 - Business Key Selection

Status: completed

Use profiling outputs to select vehicle sales and repair order business keys.

Acceptance:

- selected keys documented in `source-mapping.yml`;
- duplicate and null rates are acceptable or explicitly caveated;
- fallback tie-breakers are documented.

Completion note:

- Live profile run `20260624T181040Z` completed successfully for Snowflake and
  SQL Server DMS.
- Vehicle sales selected dealer plus deal number as the initial comparison key.
- Repair orders selected dealer plus RO number as the initial comparison key.
- SQL Server repair-order comparison will use `dbo.servicesalesclosed` and
  `dbo.servicesalesopen`; detail and appointment tables are supporting context,
  not the RO-level base.
- `PROFILE_FINDINGS.md` documents date caveats and the unresolved dealer-code
  to dealer-name mapping.

### DVL-005 - Daily Summary Comparison

Status: completed

Build dealer/day summary comparison CSVs for vehicle sales and repair orders.

Acceptance:

- current summary CSVs match `output-contract.yml`;
- DMS and Snowflake counts and material amounts are side by side;
- timing indicators are included where available.

Completion note:

- Added `daily_summary` runner mode, with `daily` accepted as a PowerShell
  alias.
- Added read-only daily summary SQL for Snowflake vehicle sales, Snowflake
  repair orders, SQL Server DMS vehicle sales, and SQL Server DMS repair-order
  headers.
- Live daily-summary run `20260624T182537Z` succeeded.
- Current summary outputs were written under `current/summaries/` and archived
  under `runs/20260624T182537Z/`.
- `DAILY_SUMMARY_FINDINGS.md` documents row counts, classifications, and the
  provisional repair-order dealer mapping caveat.

### DVL-006 - Detail Exception Extracts

Status: completed

Generate bounded missing/changed detail CSVs.

Acceptance:

- missing from Snowflake;
- Snowflake only;
- changed material values;
- configurable detail row limit;
- no unrestricted row dumps.

Completion note:

- Added `detail_exceptions` runner mode, with `detail` accepted as a
  PowerShell alias.
- Added read-only detail extracts for Snowflake vehicle sales, Snowflake repair
  orders, SQL Server DMS vehicle sales, and SQL Server DMS repair-order headers.
- Live detail-exception run `20260624T183406Z` succeeded with row limit `1000`.
- Current exception outputs were written under `current/exceptions/` and
  archived under `runs/20260624T183406Z/`.
- `DETAIL_EXCEPTION_FINDINGS.md` documents output counts and repair-order
  caveats.

### DVL-007 - Exception History

Status: completed

Track open, still-missing, and resolved exceptions across daily runs.

Acceptance:

- `open_exceptions.csv`;
- `resolved_since_last_run.csv`;
- first seen, last seen, days open, status, and resolution run.

Completion note:

- Added history handling to the `detail_exceptions` runner path.
- Live history-aware run `20260624T190123Z` succeeded.
- Wrote `current/exceptions/open_exceptions.csv` with `1558` rows.
- Wrote `current/exceptions/resolved_since_last_run.csv` with `0` rows because
  this was the first history-aware run.
- `EXCEPTION_HISTORY_FINDINGS.md` documents behavior, counts, and caveats.

### DVL-008 - Excel Dashboard Power Query Setup

Status: completed

Configure the workbook to refresh from stable local `current/` CSV paths.

Acceptance:

- dashboard pages refresh from CSVs;
- summary and exception tabs are usable by business reviewers;
- workbook contains no embedded credentials.

Completion note:

- Rebuilt `Snowflake_DMS_Shared_Consumption_Validation.xlsx` from stable
  `current/` CSV outputs.
- Added dashboard, source-path, summary, exception, history, changed-record,
  and run-status sheets.
- Native Power Query connections are not embedded because the available
  workbook authoring runtime does not expose Power Query/CSV connection
  creation.
- Workbook remains credential-free and is rebuilt from local CSVs.
- `EXCEL_REFRESH_FINDINGS.md` documents the refresh model and verification.

### DVL-009 - Daily Run Hardening

Status: completed

Make the daily process safe for low-intelligence execution.

Acceptance:

- one PowerShell command;
- idempotent archive handling;
- compact console status;
- clear failure codes;
- no AI required for normal execution.

Completion note:

- Added `run_daily_validation.ps1` as the top-level daily operator command.
- The daily command runs detail exception refresh, exception history, workbook
  rebuild, and compact operator status output.
- Live daily hardening verification run `20260624T195406Z` succeeded.
- Wrote `current/audit/daily_operator_status.json`.
- `DAILY_OPERATION_RUNBOOK.md` documents the one-command process and failure
  handling.

### DVL-010 - Validation Review Guide

Status: completed

Document how to review timing candidates, missing records, and changed values.

Acceptance:

- source-of-record language is clear;
- reviewers can distinguish timing, filtering, transformation, and unexplained
  differences;
- issue escalation process is documented.

Completion note:

- Added `VALIDATION_REVIEW_GUIDE.md` for the Snowflake DMS shared consumption
  dataset.
- Documented the source-of-record posture: SQL Server DMS remains the current
  source of record while Snowflake is evaluated as a candidate replacement or
  acceleration source.
- Added review classifications for timing, filtering, transformation, mapping,
  source-gap, and unexplained differences.
- Added repair-order caveats, changed-value caveats, daily review order, and
  the minimum escalation packet.

### DVL-011 - Source-Native Dealer Code Output Contract Repair

Status: completed

Replace temporary dealer-family aliases in the Snowflake/DMS shared-consumption
dataset with source-native `cora_acct_code` output language.

Acceptance:

- business-facing CSVs, workbook sheets, exception history, and reviewer docs
  use `cora_acct_code` instead of `dealer_name` or `dealer family`;
- DMS extracts source `cora_acct_code` from `DMS.dbo.dm_cora_account`;
- Snowflake extracts preserve their source dealer fields as supporting columns
  and map to the DMS `cora_acct_code` only through documented configuration;
- no output contains `SA466 family (dealer name pending)` or
  `SA476 family (dealer name pending)`;
- daily validation runs successfully after the output-contract change;
- old exception history is migrated or deliberately reset with a documented
  reason because the business key shape changes.

Completion note:

- Executed as `CORA-001` on 2026-06-25.
- Summary refresh run `20260625T110927Z` succeeded.
- Detail/workbook daily run `20260625T110943Z` succeeded.
- Active validation outputs now use `cora_acct_code`.
- The first corrected run intentionally reset exception identity because the
  business key changed from the retired dealership label to `cora_acct_code`.

### DVL-012 - Layered Exception Classification Taxonomy

Status: completed

Add raw exception type plus reviewer-facing classification fields so vendor and
business reviewers can distinguish true coverage gaps from mapping, timing,
key/grain, date/status, and amount issues.

Acceptance:

- ADR and contract define the classification model;
- output contract includes raw and reviewer classification fields;
- classification groups are stable and dashboard-friendly;
- review guide explains how to use the classes.

Completion note:

- Executed as `CLA-001A` on 2026-06-25.
- Added the taxonomy config, target output fields, sample headers, and review
  guide definitions.

### DVL-013 - Snowflake Broad-Presence Classifier

Status: completed

For DMS-present/Snowflake-missing repair orders, search Snowflake broadly by RO
number before calling the record truly missing.

Acceptance:

- rows found elsewhere in Snowflake classify as mapping/context issues;
- rows not found anywhere classify as true missing candidates;
- Snowflake evidence fields are captured for vendor research.

Completion note:

- Executed as `CLA-001B` on 2026-06-25.
- Live run `20260625T122333Z` succeeded.
- `525` of `526` repair-order scoped missing rows were found elsewhere in
  Snowflake and classified as dealer-context mapping issues.
- `1` row remained a true missing candidate.

### DVL-014 - Dealer/Store Mapping Classification Rules

Status: completed

Create deterministic classifications for wrong dealer context, blank primary
dealer with secondary match, ambiguous dealer context, and mapping-rule gaps.

Acceptance:

- SA476-style rows are classified as dealer/store/account mapping issues when
  supported by Snowflake fields;
- ambiguous rows are isolated;
- vendor handoff samples include `cora_acct_code`, RO number, and Snowflake
  dealer/store/account fields.

Completion note:

- Executed as `CLA-001C` on 2026-06-25.
- Live detail run `20260625T123018Z` succeeded.
- The main SA476 pattern is now classified as
  `blank_primary_dealer_with_secondary_match`.
- Vendor research sample was generated for mapping review.

### DVL-015 - Accuracy And Amount Reconciliation Classes

Status: completed

After presence and mapping are classified, split amount differences into
rounding, component gap, sign/credit, null-vs-zero, late update/restatement, and
unexplained material mismatches.

Acceptance:

- tolerances are explicit;
- repair-order customer-pay comparison remains auditable;
- dashboard separates amount definition issues from true unexplained accuracy
  issues.

Completion note:

- Executed as `CLA-001D` on 2026-06-25.
- Added `config/accuracy-thresholds.yml` and runtime amount classification for
  changed-value exceptions.
- Live detail run `20260625T123829Z` succeeded.
- Repair-order changed values are now separated into the amount bucket as
  `amount_component_gap`; vehicle-sales amount differences remain unexplained
  until stronger evidence identifies the cause.

### DVL-016 - Workbook Classification Definitions Tab

Status: completed

Add a workbook tab defining the classification model in plain English.

Acceptance:

- workbook includes a definitions tab;
- tab covers raw exception type, review classification, classification group,
  first check, and vendor handoff guidance;
- dashboard buckets align with the definitions.

Completion note:

- Executed as `CLA-001E` on 2026-06-25.
- The workbook builder now creates a `Classification Definitions` tab from the
  taxonomy config and dashboard classification bucket sections from
  `open_exceptions.csv`.
- Rebuilt and visually verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001E.xlsx`.

### DVL-017 - Classification Readback And Count Movement

Status: completed

Run the daily validation after the layered classification changes and document
how raw missing/changed counts move into mapping, amount, coverage, unexplained,
and unclassified buckets.

Acceptance:

- daily command succeeds;
- workbook rebuild succeeds;
- count movement is documented for business and vendor review;
- exception-history reset status is documented.

Completion note:

- Executed as `CLA-001F` on 2026-06-25.
- Daily detail run `20260625T125119Z` succeeded.
- Workbook rebuild succeeded to timestamped workbook
  `excel/Snowflake_DMS_Shared_Consumption_Validation_20260625_085118.xlsx`
  because the main workbook file was locked by Excel.
- Documented count movement in
  `CLASSIFICATION_READBACK_FINDINGS.md`.
- No exception-history reset occurred; `resolved_since_last_run` was `0`.

### DVL-018 - Snowflake-Only Timing Classification

Status: completed

Classify Snowflake-present/DMS-missing rows so they do not remain blank in
classification dashboards.

Acceptance:

- `missing_from_dms` rows receive a conservative timing/freshness or scope
  review classification;
- Snowflake-only rows are not called DMS defects by default;
- workbook dashboard no longer shows the current Snowflake-only row as
  unclassified.

Completion note:

- Executed as `CLA-001G` on 2026-06-25.
- Live detail run `20260625T125747Z` succeeded.
- `missing_from_dms` rows now classify as `timing_candidate` by default.
- The current Snowflake-only row `SA466-S|237319` moved from unclassified to
  timing.
- Open exceptions with blank review classification moved from `1` to `0`.
