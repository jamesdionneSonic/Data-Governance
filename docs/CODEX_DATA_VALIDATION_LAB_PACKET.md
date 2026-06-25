# Codex Data Validation Lab Packet

Use this packet for building or changing a Data Validation Lab dataset.

## Required Pre-Flight

Read these first:

1. `docs/adr/ADR-023-Repeatable-Read-Only-Data-Validation-Lab.md`
2. `docs/DATA_VALIDATION_LAB_CONTRACT.md`
3. `data-validation/AGENTS.md`
4. dataset `README.md`

For the first Snowflake/DMS dataset, also read:

1. `docs/SNOWFLAKE_BIPSLYV_TLB12786_CONNECTOR.md`
2. `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
3. `SQL_SERVER_QUICK_START.md`

## Hard Scope Boundary

This packet may create or update local validation scaffolding, SQL query files,
runner scripts, CSV schemas, local workbook templates, and documentation.

This packet must not:

- create database objects;
- write source-system data;
- publish business row extracts to Confluence or DevOps;
- commit credentials;
- make broad lineage ingestion or Confluence publication changes unless a
  separate packet approves that work.

## Work Packet

### Goal

One sentence:

### Dataset Id

`data-validation/datasets/<dataset-id>`

### Source Of Record

Name the baseline source:

### Candidate Source

Name the source being tested:

### Business Scope

Dealers, date window, subject areas, and explicit exclusions:

### Work Type

Choose one:

- project scaffold
- profiling
- key selection
- daily summary comparison
- detail exception comparison
- exception history
- Excel dashboard
- daily automation
- validation hardening

### Source Inputs

Saved connector ids:

- Snowflake:
- SQL Server:

Source objects:

-

### Target Outputs

CSV outputs:

-

Workbook outputs:

-

Audit outputs:

-

### SQL Plan

List SQL files to create or update. Confirm each is read-only.

-

### Command Plan

Discovery/profile:

-

Daily run:

-

Validation:

-

### Acceptance Criteria

- All source SQL is read-only.
- Outputs land under `current/` and archive under `runs/<run-id>/`.
- Business-data CSVs are ignored by Git.
- `run_status.csv` is produced.
- Excel workbook can be refreshed from stable `current/` CSV paths after first
  local Power Query setup.
- Exception history can identify open, resolved, and still-missing records.

### Stop Triggers

Stop and ask before:

- changing source-system permissions;
- creating source-system objects;
- expanding dealer/date scope beyond the packet;
- exporting unrestricted detail rows;
- publishing row-level outputs outside the local machine;
- replacing DMS as source of record in labels or dashboard wording.

### Completion Note

Report:

- files changed;
- commands run;
- generated workbook path;
- validation status;
- known assumptions;
- next packet recommendation.
