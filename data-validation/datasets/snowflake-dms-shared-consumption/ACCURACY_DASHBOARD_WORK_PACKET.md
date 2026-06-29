# Accuracy Dashboard Work Packet

## Packet Goal

Build the accuracy dashboard for the Snowflake versus DMS shared-consumption
validation without changing source databases and without requiring AI for daily
execution.

## Execution Order

### ACC-001 - Metric Contract And Thresholds

Status: completed

Scope:

- add accuracy metric definitions;
- define denominators;
- define conservative decision statuses;
- add threshold configuration for candidate-ready, review-needed, and not-ready
  states.

Acceptance:

- metric names match ADR-025 and ADR-026;
- denominator logic is documented;
- thresholds are explicit and easy to tune;
- no source queries or workbook changes are required in this packet.

Completion note:

- Executed as `WP-DVL-019` on 2026-06-26.
- Added `ACCURACY_METRIC_CONTRACT.md`.
- Added `config/accuracy-dashboard-thresholds.yml`.
- Expanded `config/accuracy-dashboard-contract.yml` with denominators, metric
  formulas, threshold references, and classification-to-accuracy mappings.
- No source queries were run and no workbook was rebuilt.

### ACC-002 - Accuracy CSV Builder

Status: completed

Scope:

- read current summary and exception CSVs;
- produce `current/accuracy/accuracy_scorecard.csv`;
- produce `current/accuracy/accuracy_metric_definitions.csv`;
- produce `current/accuracy/accuracy_blockers.csv`;
- archive the same files under the current run folder.

Acceptance:

- daily workflow can generate accuracy CSVs deterministically;
- outputs include vehicle-sales and repair-order subject areas;
- formula-definition gaps and mapping/timing issues are not counted as
  certified value defects;
- run status records accuracy output paths.

Completion note:

- Executed as `WP-DVL-020` on 2026-06-26.
- Added accuracy CSV generation to `detail_exceptions` mode in
  `scripts/run_validation.mjs`.
- Live validation run `20260626T111348Z` succeeded and wrote:
  - `current/accuracy/accuracy_scorecard.csv`;
  - `current/accuracy/accuracy_metric_definitions.csv`;
  - `current/accuracy/accuracy_blockers.csv`;
  - `current/accuracy/accuracy_review_samples_manifest.csv`.
- The same files were archived under
  `runs/20260626T111348Z/accuracy/`.
- Vehicle sales scored `review_needed`; repair orders scored `not_ready`.

### ACC-003 - Accuracy Workbook Tab

Status: completed

Scope:

- add an `Accuracy Dashboard` worksheet;
- show run context, decision status, key match rate, raw value match rate,
  readiness rate, blockers, and next-review guidance;
- keep existing dashboard, exceptions, and classification definitions tabs.

Acceptance:

- workbook opens cleanly;
- tab is readable without asking Codex what it means;
- dashboard does not hide caveats behind a single score;
- output refresh remains one command.

Completion note:

- Executed as `WP-DVL-021` on 2026-06-26.
- Added an `Accuracy Dashboard` worksheet as the first workbook tab.
- Added raw accuracy CSV table tabs for scorecard, blockers, metric
  definitions, and review samples.
- Rebuilt the canonical workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`.
- Rendered and reviewed:
  `excel/previews/accuracy_dashboard.png`.
- The dashboard shows overall `not_ready`, vehicle sales as `review_needed`,
  and repair orders as `not_ready`.

### ACC-004 - Bounded Accuracy Drilldowns

Status: completed

Scope:

- generate bounded review samples for candidate defects and review buckets;
- create a sample manifest used by the workbook;
- avoid unrestricted raw row export.

Acceptance:

- reviewer can open the sample files needed for vendor research;
- samples include source-native identifiers such as `cora_acct_code`;
- manifest shows which samples exist and which classification each supports.

Completion note:

- Executed as `WP-DVL-022` on 2026-06-26.
- Live validation run `20260626T112257Z` succeeded.
- Added bounded sample generation for mapping review, amount component gap,
  unexplained amount mismatch, true missing from Snowflake, and timing review.
- Generated five sample files under `current/accuracy/samples/` and archived
  them under `runs/20260626T112257Z/accuracy/samples/`.
- Rebuilt the canonical workbook so the accuracy dashboard and sample manifest
  list all five drilldowns.

### ACC-005 - Full Refresh And Readback

Status: completed

Scope:

- run the daily workflow;
- verify accuracy CSVs, workbook tab, and audit status;
- write a plain-English readback of whether the new dashboard lines up with the
  known current reality.

Acceptance:

- daily run succeeds;
- workbook is rebuilt;
- readback explains rates, blockers, and suspicious items;
- any remaining implementation gaps become new backlog items.

Completion note:

- Executed as `WP-DVL-023` on 2026-06-26.
- First daily attempt failed during Snowflake connection setup with
  `connect ECONNREFUSED 127.0.0.1:9`.
- Reran the daily workflow with elevated execution; run `20260626T112910Z`
  succeeded.
- Detail validation, accuracy CSV generation, bounded samples, and workbook
  rebuild all succeeded.
- Wrote `ACCURACY_DAILY_READBACK_FINDINGS.md`.
- Current dashboard status remains overall `not_ready`; vehicle sales is
  `review_needed`; repair orders is `not_ready`.

### ACC-006 - Vendor Accuracy Handoff Packet

Status: completed

Scope:

- summarize accuracy blockers by question type;
- include bounded sample references;
- keep language aligned to vendor/source-native fields.

Acceptance:

- packet separates formula, dealer-context, timing, and candidate-defect
  questions;
- packet avoids internal implementation details;
- packet is suitable for business or vendor research.

Completion note:

- Executed as `WP-DVL-024` on 2026-06-26.
- Added `VENDOR_ACCURACY_HANDOFF_PACKET.md`.
- The packet separates vehicle-sales amount questions, repair-order
  `PAYCPTOTAL` formula questions, repair-order dealer/account mapping,
  true-missing candidate review, and timing review.
- The packet references bounded local CSV samples under `current/accuracy/`.
