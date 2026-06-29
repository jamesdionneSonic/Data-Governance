# ADR-026: Accuracy Dashboard Local CSV And Workbook Contract

## Status

Accepted

## Date

2026-06-26

## Context

The Data Validation Lab intentionally stores repeatable validation outputs as
local CSV files. Excel workbooks and dashboards consume those CSVs so the user
can refresh, review, and share results without creating source database objects.

The new accuracy dashboard needs the same repeatable pattern. It must be built
from deterministic CSV outputs, refreshed by the daily runner, and visible in
the workbook without requiring AI or manual spreadsheet construction.

## Decision

Every validation dataset that supports an accuracy dashboard will write
scorecard outputs under:

```text
current/accuracy/
runs/<run-id>/accuracy/
```

The workbook builder will read those CSVs and create a dedicated accuracy
dashboard tab.

The dashboard must be generated from the CSV contract, not from hidden manual
formulas typed into Excel.

## Required Accuracy Output Files

When implemented for a dataset, the following stable files are required:

```text
current/accuracy/accuracy_scorecard.csv
current/accuracy/accuracy_metric_definitions.csv
current/accuracy/accuracy_blockers.csv
current/accuracy/accuracy_review_samples_manifest.csv
```

`accuracy_scorecard.csv` is the primary dataset-level and subject-area-level
summary.

`accuracy_metric_definitions.csv` explains each metric in plain English and
states whether the metric is a coverage, key, amount, readiness, or risk metric.

`accuracy_blockers.csv` lists issues preventing a stronger accuracy conclusion,
such as unconfirmed amount formulas or unresolved dealer-context mapping.

`accuracy_review_samples_manifest.csv` lists bounded detail sample files
available for review. It must not contain unrestricted row data.

## Required Scorecard Columns

The scorecard must include these columns when the metric applies:

```text
run_id
subject_area
business_date_start
business_date_end
cora_acct_code_scope
dms_scoped_records
snowflake_scoped_records
eligible_records
matched_key_records
validated_value_matches
missing_from_snowflake
snowflake_only
mapping_review_records
timing_review_records
formula_definition_review_records
candidate_defect_records
not_scored_records
key_match_rate
raw_value_match_rate
classification_adjusted_readiness_rate
migration_blocker_count
decision_status
confidence
plain_english_readout
```

## Decision Status Values

The dashboard must use conservative status values:

- `candidate_ready`: strong key and value agreement, no material open blockers;
- `review_needed`: usable evidence exists, but mapping, timing, amount formula,
  or unexplained differences require review;
- `not_ready`: material candidate defects or unsupported formula/key evidence
  prevent a migration-readiness claim;
- `not_scored`: insufficient evidence or out-of-scope result.

Thresholds must be configurable and documented. The first implementation may
start with conservative defaults rather than business-approved cutoffs.

## Workbook Contract

The workbook must include an `Accuracy Dashboard` tab when accuracy outputs
exist.

The tab must answer these questions plainly:

- What is the current run id and date range?
- How much of the scoped population matched by key?
- Of the matched keys, how many material values agreed?
- Which differences are reviewable versus candidate defects?
- What prevents a stronger Snowflake-readiness statement?
- What should the reviewer look at next?

The workbook must continue to include the existing classification and exception
tabs. Accuracy is an additional view, not a replacement for detailed review.

## Daily Operation

The existing one-command daily workflow remains the user-facing entry point.

For the current dataset:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1
```

The command should generate or refresh accuracy CSVs and rebuild the workbook
once the accuracy dashboard implementation is complete.

## Consequences

This gives Excel a stable source contract and lets future datasets reuse the
same scorecard shape. It also keeps the implementation honest: if the workflow
cannot compute a metric from controlled evidence, the dashboard must show that
as not scored or review needed instead of filling a misleading value.
