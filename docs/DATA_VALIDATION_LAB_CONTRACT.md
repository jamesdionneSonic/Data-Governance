# Data Validation Lab Contract

## Purpose

The Data Validation Lab is the reusable local project area for comparing data
across systems without creating or changing objects in source databases.

It exists for validation work such as:

- Snowflake versus SQL Server DMS source-of-record checks;
- current-state migration readiness testing;
- refresh-timing and completeness analysis;
- daily exception tracking;
- Excel-based business review dashboards.

## Non-Negotiable Rules

- Source systems are read-only.
- SQL files must not create, alter, drop, merge, insert, update, delete, or
  truncate data.
- Secrets must come from `.env` or saved connector runtime configuration.
- Local CSVs containing business data must not be committed.
- Excel is a consumer of stable CSV files, not the source of validation logic.
- Every daily run must have a run id and audit output.
- Vendor/source business identifiers must keep their source-native column names
  in CSVs, dashboards, and reviewer documentation.
- Raw exception types must be preserved separately from reviewer-facing
  classifications.

## Project Layout

```text
data-validation/
  README.md
  AGENTS.md
  CONTRIBUTING.md
  datasets/
    <dataset-id>/
      README.md
      config/
      sql/
      scripts/
      current/
      runs/
      excel/
```

## Dataset Naming Standard

Use lowercase kebab-case:

```text
<candidate-source>-<baseline-source>-<business-scope>
```

Examples:

- `snowflake-dms-shared-consumption`
- `api-sqlserver-service-contracts`
- `adf-snowflake-marketing-export`

The name should describe the validation, not only the first table in scope.

## Config Files

Each dataset must include:

- `validation-scope.yml`: dataset purpose, source systems, date window,
  dealership/business filters, and run modes;
- `source-mapping.yml`: source tables/objects, candidate keys, date fields,
  timestamp fields, and material value fields;
- `output-contract.yml`: stable CSV outputs and required columns.

Config files may include connector ids and database/schema/object names. They
must not include passwords, tokens, private keys, or connection strings with
credentials.

## SQL File Rules

SQL files must be source-specific and stored under:

```text
sql/<source-id>/*.sql
```

Each SQL file should:

- contain one read-only query;
- use parameters or clearly marked placeholders for date windows and dealer
  filters;
- return deterministic output columns that preserve source-native/vendor names
  for identifiers and support-facing concepts;
- avoid `SELECT *`;
- avoid row samples unless the output is a bounded detail extract;
- include comments for business-date and key assumptions.

## Source-Native Naming

Do not replace source-system column identity with invented friendly aliases in
validation outputs. If a vendor, source-system support team, or business reviewer
would use a column name to reconcile the result, keep that name visible.

Allowed:

- `cora_acct_code`
- `snowflake_dealercode`
- `business_date`
- `source_record_count`

Not allowed:

- replacing `cora_acct_code` with `dealer family`;
- replacing source dealer codes with labels such as
  `SA476 family (dealer name pending)`;
- using a friendly description as the only field available for vendor review.

Friendly wording may be added as separate explanatory documentation, but it must
not become the primary key, grouping field, or dashboard label when a
source-native term exists.

## Output Contract

The daily runner writes latest files under `current/` and archives the same
files under `runs/<run-id>/`.

Required output families:

- `raw/`: bounded source extracts when needed for debugging;
- `normalized/`: source-specific data normalized into common field names;
- `summaries/`: dealer/day comparison outputs;
- `exceptions/`: missing, changed, resolved, and open exception outputs;
- `audit/`: run status, row counts, inputs, and warnings.

## Exception Classification Contract

Exception outputs must keep the raw scoped comparison result and add review
classification fields when the dataset has enough evidence.

Recommended fields:

- `exception_type`: raw deterministic comparison result, such as
  `missing_from_snowflake_scoped_match`, `missing_from_dms`, or
  `changed_value`;
- `review_classification`: business/vendor-facing explanation, such as
  `found_in_snowflake_wrong_dealer_context` or `amount_component_gap`;
- `classification_group`: broad bucket for dashboarding, such as `coverage`,
  `mapping`, `timing`, `key_grain`, `date_status`, `amount`, or
  `unexplained`;
- `classification_reason`: short evidence-based explanation;
- source-specific evidence fields needed to reproduce the classification.

The workbook for each dataset must include a classification definition tab when
review classifications are active.

## Required Stable CSVs

Every implemented dataset should target these stable filenames when applicable:

```text
current/summaries/vehicle_sales_daily_compare.csv
current/summaries/repair_order_daily_compare.csv
current/exceptions/vehicle_sales_missing_from_snowflake.csv
current/exceptions/vehicle_sales_missing_from_dms.csv
current/exceptions/repair_orders_missing_from_snowflake.csv
current/exceptions/repair_orders_missing_from_dms.csv
current/exceptions/changed_records.csv
current/exceptions/open_exceptions.csv
current/exceptions/resolved_since_last_run.csv
current/audit/run_status.csv
```

Future datasets may add subject-area-specific outputs, but should keep the same
family structure.

## Daily Operation

The target daily command shape is:

```powershell
.\data-validation\datasets\<dataset-id>\scripts\run_validation.ps1
```

The script may call Python or Node internally, but the user-facing operation
should be one command.

## Profiling First

Every new dataset starts with a profiling packet before row-level validation.

Profiling must identify:

- source row counts by dealer and day;
- candidate business keys and duplicate rates;
- key null rates;
- date fields and min/max dates;
- update/load timestamp fields;
- important numeric/status fields;
- material source differences that affect matching.

## Exception History

Exception history must support:

- first seen;
- last seen;
- days open;
- resolved run;
- still missing;
- business key;
- source-native dealer/store/account identifier such as `cora_acct_code`;
- business date;
- exception type;
- review classification;
- classification reason;
- source presence flags;
- review notes when manually added.

## AI Use

AI may help design SQL, interpret profiling results, tune comparison rules, and
prepare review summaries.

Daily execution must not require AI. Once implemented, a low-intelligence run
should execute the same deterministic workflow.

## Accuracy Dashboard Contract

Validation datasets may add an accuracy dashboard when the comparison has enough
evidence to support decision scoring.

The accuracy dashboard is separate from exception triage. Exception triage
explains what is different. Accuracy scoring explains whether the candidate
source is trustworthy enough for business use or migration review.

Accuracy outputs must be generated from local CSVs and written to:

```text
current/accuracy/
runs/<run-id>/accuracy/
```

Required files:

- `accuracy_scorecard.csv`;
- `accuracy_metric_definitions.csv`;
- `accuracy_blockers.csv`;
- `accuracy_review_samples_manifest.csv`.

The dashboard must label denominator rules and decision status clearly. It must
separate key match, value match, classification-adjusted readiness, candidate
defects, and blockers. It must not use one unlabeled score to imply more
certainty than the evidence supports.

Source-native identifiers remain required in accuracy outputs. For the DMS
shared-consumption validation, reviewer-facing scorecards and samples must keep
`cora_acct_code` visible.
