# CLA-001: Layered Classification And Accuracy Review

Dataset: `snowflake-dms-shared-consumption`

## Goal

Move the validation from blunt missing/changed labels to classifications that
support vendor research and source-accuracy decisions.

The workflow must keep raw exception types for audit, then add a reviewer-facing
classification that explains whether a row is truly missing, found under the
wrong dealer context, timing-related, a key/grain problem, a date/status issue,
or an amount reconciliation issue.

## Current Driver

The SA476 repair-order investigation showed that many ROs classified as missing
from Snowflake were actually present in Snowflake when searched broadly by RO
number. The problem appears to be dealer/store/account context, not true feed
coverage.

## Target Output Fields

Add these fields to applicable exception outputs:

- `raw_exception_type`
- `review_classification`
- `classification_group`
- `classification_reason`
- `snowflake_found_elsewhere`
- `snowflake_dealercode`
- `snowflake_storenumber`
- `snowflake_eis_store_id`
- `snowflake_accountingaccount`
- `accuracy_check_status`

Keep source-native fields such as `cora_acct_code`.

## Classification Groups

- coverage
- mapping
- timing
- key_grain
- date_status
- amount
- unexplained

## Work Packages

### CLA-001A - Taxonomy And Output Contract

Status: completed

Define the classification list, output fields, sample headers, and workbook
definition-tab content.

Acceptance:

- `output-contract.yml` includes the new classification fields;
- reviewer guide explains the classification groups;
- sample headers are updated;
- no source-system queries are required.

Completion note:

- Added `config/review-classification-taxonomy.yml`.
- Updated `config/output-contract.yml` with raw exception and review
  classification fields.
- Updated sample exception CSV headers.
- Updated `VALIDATION_REVIEW_GUIDE.md` with classification groups and reviewer
  definitions.

### CLA-001B - Broad Snowflake Presence Classifier

Status: completed

For DMS-present/Snowflake-missing repair orders, add a broad Snowflake RO search
step that ignores the current dealer mapping and classifies whether the RO is
truly absent or present elsewhere.

Acceptance:

- SA476-style rows classify as found in Snowflake outside scoped dealer context;
- truly absent rows remain true missing candidates;
- classifier output includes Snowflake dealer/store/account evidence fields.

Completion note:

- Added broad Snowflake RO lookup to the `detail_exceptions` runner path.
- Live run `20260625T122333Z` succeeded.
- `repair_orders_missing_from_snowflake.csv` now carries broad-presence
  evidence fields and review classifications.
- Of `526` repair orders missing from the scoped Snowflake match, `525` were
  found elsewhere in Snowflake and classified as
  `found_in_snowflake_wrong_dealer_context`.
- `1` repair order remained `true_missing_from_snowflake`.
- Main workbook overwrite was blocked because the workbook file was open/locked;
  a verified packet workbook was written as
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001B.xlsx`.

### CLA-001C - Mapping Classification Rules

Status: completed

Add deterministic mapping classifications for wrong dealer context, blank
primary dealer with secondary match, ambiguous dealer context, and mapping rule
gap.

Acceptance:

- SA476 rows with blank `DEALERCODE`, `EIS_STORE_ID = S000500622`, and
  `ACCOUNTINGACCOUNT = SA476-A` classify as mapping/context issues instead of
  true missing rows;
- ambiguous multi-context rows are separated for human review;
- vendor handoff sample explains why each row was classified.

Completion note:

- Added refined mapping classifications to the `detail_exceptions` runner path.
- Live run `20260625T123018Z` succeeded.
- Repair-order scoped missing rows classified as:
  - `495` `blank_primary_dealer_with_secondary_match`;
  - `30` `found_in_snowflake_wrong_dealer_context`;
  - `1` `true_missing_from_snowflake`.
- Generated vendor research sample:
  `current/exceptions/research_samples/repair_orders_mapping_research_sample.csv`.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001C.xlsx`.

### CLA-001D - Accuracy And Amount Classifications

Status: completed

Add amount-focused classifications after presence and mapping are resolved.

Acceptance:

- amount differences are split into rounding, component gap, sign/credit,
  null-vs-zero, late update/restatement, or unexplained amount mismatch;
- tolerances are explicit and configurable;
- repair-order customer-pay comparison remains visible.

Completion note:

- Added `config/accuracy-thresholds.yml` documenting the active one-dollar
  absolute amount tolerance.
- Added deterministic amount classification to the changed-value runner path.
- Live detail run `20260625T123829Z` succeeded.
- Changed-value rows classified as:
  - `665` repair-order rows as `amount_component_gap`;
  - `2` vehicle-sales rows as `material_amount_mismatch_unexplained`.
- Open exception classification groups now include `665` amount rows, `525`
  mapping rows, `2` unexplained amount rows, and `1` true Snowflake coverage
  candidate, with one Snowflake-only row still pending a later coverage/timing
  classification cleanup.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001D.xlsx`.

### CLA-001E - Workbook Definition Tab And Dashboard Buckets

Status: completed

Add a workbook tab that defines raw exception types, reviewer classifications,
plain-English meaning, first checks, vendor handoff guidance, and classification
group.

Acceptance:

- workbook includes a `Definitions` or `Classification Definitions` tab;
- dashboard uses grouped buckets instead of only missing/changed labels;
- tab content matches the ADR and review guide.

Completion note:

- Updated the workbook builder to add a `Classification Definitions` tab from
  `config/review-classification-taxonomy.yml`.
- Updated the dashboard to show open exceptions by classification group and by
  review classification.
- Rebuilt and visually verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001E.xlsx`.
- Current dashboard buckets show `665` amount rows, `525` mapping rows, `2`
  unexplained rows, `1` coverage row, and `1` unclassified Snowflake-only row
  left for the readback/coverage cleanup packet.

### CLA-001F - Daily Run Readback

Status: completed

Run the daily package after the classification change and document how counts
move from raw missing labels into mapping, timing, accuracy, and true coverage
buckets.

Acceptance:

- daily command succeeds;
- workbook rebuild succeeds;
- counts are documented;
- any exception-history reset is explicitly documented.

Completion note:

- Ran the daily operator command successfully on 2026-06-25.
- Daily detail run id: `20260625T125119Z`.
- Workbook rebuild succeeded to timestamped workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_20260625_085118.xlsx`.
- The main workbook overwrite was skipped because
  `Snowflake_DMS_Shared_Consumption_Validation.xlsx` was locked by Excel; the
  daily status recorded `warning_count = 1` and `error_count = 0`.
- Documented count movement in `CLASSIFICATION_READBACK_FINDINGS.md`.
- Raw `changed_value` rows now split into `665` repair-order
  `amount_component_gap` rows and `2` vehicle-sales unexplained amount rows.
- Raw `missing_from_snowflake` rows now split into `525` mapping rows and `1`
  true Snowflake coverage candidate.
- One `missing_from_dms` vehicle-sales row remains unclassified and should be
  handled by the next Snowflake-only timing/coverage classifier.
- No exception-history reset occurred; `resolved_since_last_run` was `0`.

### CLA-001G - Snowflake-Only Timing Classification

Status: completed

Classify `missing_from_dms` rows so Snowflake-only records do not appear as
blank/unclassified dashboard buckets.

Acceptance:

- `missing_from_dms` rows receive a review classification;
- Snowflake-only rows are not called DMS defects by default;
- reviewer-facing reason explains timing/freshness and scope review;
- workbook dashboard no longer has a blank/unclassified bucket when the only
  unclassified row is Snowflake-only.

Completion note:

- Added conservative default classification for `missing_from_dms` rows.
- Live detail run `20260625T125747Z` succeeded.
- The Snowflake-only vehicle-sales row `SA466-S|237319` now classifies as
  `timing_candidate` with group `timing`.
- Open exceptions with blank review classification moved from `1` to `0`.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001G.xlsx`.

## Out Of Scope

- Creating database objects.
- Changing source data.
- Claiming Snowflake is wrong before mapping, key/grain, date/status, and amount
  classifications are evaluated.
