# ADR-023: Repeatable Read-Only Data Validation Lab

## Status

Accepted

## Date

2026-06-24

## Context

Sonic needs a repeatable way to validate candidate replacement or upstream data
sources against the current system of record without creating database objects in
source systems.

The first validation use case compares two Snowflake shared consumption tables:

- `CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW`
- `CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.VEHICLE_SALES_RAW`

against strong SQL Server DMS matches for two dealerships:

- Jaguar Land Rover Santa Monica
- Mercedes-Benz of Calabasas

SQL Server DMS remains the current source of record. Snowflake is a candidate
replacement or fresher source. Differences must be classified, not blindly
treated as errors, because timing and refresh cadence are part of the test.

The validation process must produce local CSV datasets that Excel dashboards can
refresh from. It must also be executable daily with minimal AI assistance.

## Decision

Create a reusable `data-validation` project area in this repository.

The project will support multiple validation datasets under:

```text
data-validation/datasets/<dataset-id>/
```

Each dataset must be read-only against source systems and must write outputs only
to local files under the dataset folder.

The validation workflow must:

- use saved connector configuration and `.env` secrets;
- run SQL statements from versioned `.sql` files;
- avoid creating tables, views, procedures, stages, tasks, or other database
  objects in source systems;
- preserve source-native/vendor column names for business identifiers and
  support-facing outputs;
- preserve raw exception types while adding reviewer-facing classification
  fields when evidence supports a more specific explanation;
- write stable CSV outputs under `current/` for Excel refresh;
- archive each run under `runs/<run-id>/`;
- track open, resolved, and still-missing exceptions across runs;
- include a compact audit file for each execution;
- be executable through one daily command after setup;
- keep business row data out of source control by default.

## Dataset Folder Contract

Each dataset folder must use this shape:

```text
data-validation/datasets/<dataset-id>/
  README.md
  config/
    validation-scope.yml
    source-mapping.yml
    output-contract.yml
  sql/
    <source-id>/
      *.sql
  scripts/
    run_validation.py
    run_validation.ps1
  current/
    raw/
    normalized/
    summaries/
    exceptions/
    audit/
  runs/
  excel/
    *.xlsx
```

`current/` contains the latest CSVs used by Excel.

`runs/` contains historical snapshots and must not be committed when it contains
business data.

## Source Of Record Rule

SQL Server DMS is the source of record for the first Snowflake/DMS validation
dataset.

Exception labels must reflect this rule:

- `missing_from_snowflake`: present in DMS, absent from Snowflake;
- `snowflake_only`: present in Snowflake, absent from DMS;
- `matched`: present in both systems;
- `changed`: same business key, different material values;
- `timing_candidate`: difference likely explained by refresh timing;
- `unexplained`: difference needs review.

Snowflake-only records are not automatically errors. They are evidence to review
for freshness, timing, filtering, or transformation differences.

Exception outputs should distinguish the raw scoped comparison result from the
review classification. For example, a row may be missing from the scoped
Snowflake comparison but found elsewhere in Snowflake under a different dealer,
store, or account context. In that case the raw exception remains auditable,
while the reviewer classification must explain the mapping issue.

## Source-Native Column Naming Rule

Validation outputs must not hide vendor or source-system column identity behind
invented friendly aliases when the output is used for vendor, support, or
business review.

For identifiers, grouping fields, keys, and source-specific business concepts,
the output column name must remain the source-native name or a clearly documented
canonical name that still preserves the source term. Friendly explanations may
be added in separate notes or companion columns, but they must not replace the
source-native identity.

For the Snowflake/DMS shared-consumption dataset, DMS dealer grouping must be
shown as `cora_acct_code` from `DMS.dbo.dm_cora_account`. Temporary labels such
as `dealer family`, `dealer_name`, or `SA476 family (dealer name pending)` must
not be used as the business-facing identifier because they cannot be reconciled
with the vendor ecosystem.

## Local Data Protection

Business data extracts, exception detail rows, and run archives must stay local
unless explicitly approved for publication.

The repository may track:

- SQL templates;
- configuration files without secrets;
- CSV schema contracts or sample header-only files;
- workbook templates;
- documentation, ADRs, backlog, and packets.

The repository must not track:

- raw customer, vehicle, repair order, deal, or financial row data;
- credentials or connection strings with secrets;
- unrestricted source-system extracts.

## Excel Role

Excel is the review and dashboard layer, not the validation engine.

Excel workbooks should point at stable CSV files under `current/`. The validation
runner owns data extraction, normalization, comparison, exception tracking, and
audit output.

After the first local CSVs exist, Excel Power Query connections can be configured
once against the stable `current/` file paths. Daily operation should then be:

1. run the one validation command;
2. open the workbook;
3. refresh Excel.

## First Dataset

The first dataset is:

```text
data-validation/datasets/snowflake-dms-shared-consumption
```

Initial scope:

- Snowflake shared consumption `VEHICLE_SALES_RAW` against DMS vehicle sales
  family objects;
- Snowflake shared consumption `REPAIR_ORDER_RAW` against DMS service/repair
  candidate objects;
- dealer filter limited to Jaguar Land Rover Santa Monica and Mercedes-Benz of
  Calabasas.

## Consequences

- Validation can run daily without database changes.
- Excel dashboards can refresh from stable local CSVs.
- Historical exceptions can prove whether missing data appears in later
  refreshes.
- The same project pattern can support future Snowflake, SQL Server, ADF, API,
  file, or reporting validation datasets.
- Stronger row-level validation can be added after profiling confirms business
  keys and date semantics.
- Output contracts may be less conversational, but they remain traceable to the
  vendor/source ecosystem. Any existing invented aliases must be remediated in a
  controlled package because changing column names affects CSVs, workbook tabs,
  exception history, and reviewer documentation.

## Validation

For each dataset implementation:

- dry-run/profile mode proves the connectors work and source filters are scoped;
- generated CSV headers match `output-contract.yml`;
- no SQL file contains DDL or write statements;
- `current/audit/run_status.csv` records source, run id, start/end timestamps,
  status, and row counts;
- a second run can classify prior open exceptions as still open or resolved.

## Related Documents

- `docs/DATA_VALIDATION_LAB_CONTRACT.md`
- `docs/DATA_VALIDATION_LAB_BACKLOG.md`
- `docs/CODEX_DATA_VALIDATION_LAB_PACKET.md`
- `data-validation/README.md`
- `data-validation/datasets/snowflake-dms-shared-consumption/README.md`
- `docs/adr/ADR-024-Validation-Exception-Classification-And-Accuracy-Taxonomy.md`
