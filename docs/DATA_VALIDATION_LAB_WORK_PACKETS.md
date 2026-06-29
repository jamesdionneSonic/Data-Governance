# Data Validation Lab Work Packets

## Packet Sequence

### WP-DVL-001 - Scaffold Reusable Validation Lab

Goal: establish the reusable project, docs, dataset scaffold, and workbook
template.

Scope:

- ADR and project contract;
- backlog and work packets;
- `data-validation` root docs;
- Snowflake/DMS dataset folder;
- config skeletons;
- SQL placeholders;
- Excel template.

Acceptance:

- no source-system queries required;
- no business data committed;
- project is ready for profiling work.

### WP-DVL-002 - Build Profiling Queries

Goal: write and review the first read-only profiling SQL statements.

Status: completed

Scope:

- Snowflake profile SQL for `VEHICLE_SALES_RAW`;
- Snowflake profile SQL for `REPAIR_ORDER_RAW`;
- SQL Server profile SQL for DMS vehicle sales candidates;
- SQL Server profile SQL for DMS repair/service candidates;
- SQL static safety check.

Acceptance:

- SQL is read-only;
- dealer filters and date windows are parameterized or clearly marked;
- profile outputs can identify keys, date fields, timestamps, and counts.

Completion note:

- Four read-only profiling SQL files are in place.
- Dealer scope remains intentionally unfiltered until live profile output maps
  dealer codes to Jaguar Land Rover Santa Monica and Mercedes-Benz of Calabasas.
- Static guardrail found no DDL/DML keywords and no `SELECT *`.

### WP-DVL-003 - Build Profile Runner

Goal: implement the one-command profile-mode runner.

Status: completed

Scope:

- `run_validation.py`;
- `run_validation.ps1`;
- connector loading;
- output folder archive/copy behavior;
- audit CSV.

Acceptance:

- one command runs profile mode;
- latest CSVs land under `current/`;
- archive copy lands under `runs/<run-id>/`;
- failures are captured without partial silent success.

Completion note:

- `scripts/run_validation.ps1` is the user-facing one-command runner.
- `scripts/run_validation.mjs` executes read-only profile SQL and writes CSV
  outputs.
- `-PlanOnly` validates SQL guardrails and output targets without source-system
  connections.

### WP-DVL-004 - Execute Profiling And Choose Keys

Goal: run profiling and select initial business keys.

Status: completed

Scope:

- execute profile mode;
- inspect row counts, nulls, duplicate rates, date fields, and timestamps;
- update `source-mapping.yml`.

Acceptance:

- vehicle sales key candidate selected;
- repair order key candidate selected or caveated;
- material comparison fields selected.

Completion note:

- Live profile run `20260624T181040Z` succeeded for all five profile jobs.
- Added SQL Server repair-order header profiling for `dbo.servicesalesclosed`
  and `dbo.servicesalesopen`.
- Selected vehicle sales key: dealer plus deal number.
- Selected repair order key: dealer plus RO number.
- Documented that SQL Server service detail and appointment tables are not the
  RO-level comparison base.
- Documented date-field caveats and unresolved dealer-code mapping in
  `data-validation/datasets/snowflake-dms-shared-consumption/PROFILE_FINDINGS.md`.

### WP-DVL-005 - Daily Summary Comparison

Goal: generate dealer/day comparison CSVs.

Status: completed

Scope:

- normalized summary extracts;
- summary comparison logic;
- timing/freshness fields;
- workbook data tabs updated if needed.

Acceptance:

- `vehicle_sales_daily_compare.csv`;
- `repair_order_daily_compare.csv`;
- summary-level differences classified.

Completion note:

- Added `daily_summary` mode to the one-command runner.
- Live daily-summary run `20260624T182537Z` succeeded.
- Wrote `current/summaries/vehicle_sales_daily_compare.csv` with `61` rows.
- Wrote `current/summaries/repair_order_daily_compare.csv` with `55` rows.
- Vehicle sales produced mostly matched summary rows; repair orders remain
  review-heavy and carry a provisional dealer-mapping caveat.

### WP-DVL-006 - Detail Exceptions

Goal: generate bounded detail exception outputs.

Status: completed

Scope:

- missing from Snowflake;
- Snowflake only;
- changed values;
- detail row limit configuration;
- source-of-record labels.

Acceptance:

- exception CSVs match the output contract;
- row limits are enforced;
- keys and dates are auditable.

Completion note:

- Added `detail_exceptions` mode to the one-command runner.
- Live detail-exception run `20260624T183406Z` succeeded.
- Wrote bounded missing-from-Snowflake, Snowflake-only, and changed-record
  exception CSVs under `current/exceptions/`.
- Vehicle sales produced compact exception output; repair orders hit the
  changed-record row limit and remain mapping/rule-discovery evidence.

### WP-DVL-007 - Exception History

Goal: track exceptions across daily refreshes.

Status: completed

Scope:

- compare current exceptions to prior open exceptions;
- first/last seen;
- days open;
- resolved since last run;
- still missing.

Acceptance:

- `open_exceptions.csv`;
- `resolved_since_last_run.csv`;
- status transitions are deterministic.

Completion note:

- Added exception history to the `detail_exceptions` runner path.
- Live history-aware run `20260624T190123Z` succeeded.
- Wrote `current/exceptions/open_exceptions.csv` with `1558` rows.
- Wrote `current/exceptions/resolved_since_last_run.csv` with `0` rows because
  this was the first history-aware run.
- Open rows preserve `first_seen_run`, update `last_seen_run`, and calculate
  `days_open` from run dates.

### WP-DVL-008 - Excel Refresh Workbook

Goal: finish the Excel workbook against live stable CSVs.

Status: completed

Scope:

- configure Excel Power Query against `current/` CSVs;
- validate Refresh All behavior;
- add dashboard charts/tables;
- preserve workbook without credentials.

Acceptance:

- workbook refreshes after the daily runner;
- summary and exception sheets are readable;
- no embedded credentials.

Completion note:

- Rebuilt `Snowflake_DMS_Shared_Consumption_Validation.xlsx` from the stable
  `current/` CSV outputs.
- Added a dashboard, source-path sheet, summary sheets, exception sheets,
  history sheets, changed-record sheet, and run-status sheet.
- Workbook is credential-free.
- Native Excel Power Query connections are not embedded; the implemented model
  is a workbook rebuild from stable local CSVs.
- Visual previews and workbook inspection passed.

### WP-DVL-009 - Daily Operation Runbook

Goal: make the workflow safe for daily low-intelligence execution.

Status: completed

Scope:

- operator instructions;
- expected runtime;
- success/failure signals;
- recovery steps;
- review cadence.

Acceptance:

- operator can run one command;
- reviewer can open Excel and refresh;
- failures can be handed to Codex with run id and audit files.

Completion note:

- Added `run_daily_validation.ps1` as the one-command daily operator entry
  point.
- Live daily hardening verification run `20260624T195406Z` succeeded.
- The command refreshed detail exceptions/history, rebuilt the workbook, and
  wrote `current/audit/daily_operator_status.json`.
- `DAILY_OPERATION_RUNBOOK.md` documents success signals, failure handling,
  optional arguments, and review order.

### WP-DVL-010 - Validation Review Guide

Goal: document how reviewers should interpret validation outputs.

Status: completed

Scope:

- timing differences;
- missing records;
- changed values;
- repair-order caveats;
- source-of-record language;
- escalation notes.

Acceptance:

- reviewers can distinguish timing, filtering, transformation, and unexplained
  differences;
- DMS source-of-record language is clear;
- repair-order caveats are visible.

Completion note:

- Added `VALIDATION_REVIEW_GUIDE.md` under the dataset folder.
- Documented daily review order, source-of-record posture, exception
  classifications, missing-record handling, changed-value handling, timing
  candidates, vehicle-sales notes, repair-order caveats, and escalation packet
  requirements.
- Updated the dataset README to point reviewers to the guide.

### WP-DVL-011 - Replace Dealer Family Aliases With `cora_acct_code`

Goal: repair the Snowflake/DMS shared-consumption output contract so reviewers
see the vendor/source-native DMS dealer identifier.

Status: completed

Scope:

- replace `dealer_name` grouping/output columns with `cora_acct_code` in
  summary CSVs, exception CSVs, normalized extracts, history handling, and
  workbook/dashboard tabs;
- replace `SA466 family (dealer name pending)` and
  `SA476 family (dealer name pending)` with actual `cora_acct_code` values;
- source DMS `cora_acct_code` from `DMS.dbo.dm_cora_account`;
- preserve Snowflake dealer/source fields as separate diagnostic columns where
  available, instead of hiding them behind DMS language;
- update `output-contract.yml`, dataset README, review guide, sample headers,
  workbook builder notes, and repair-order findings language;
- run the daily validation command once and rebuild the workbook.

Acceptance:

- `rg -i "dealer family|family \\(dealer name pending\\)|dealer_name"` finds no
  active dataset SQL, config, current sample headers, workbook-builder logic, or
  reviewer-facing docs, except in historical findings that explicitly describe
  the retired wording;
- `current/summaries/*` and `current/exceptions/*` expose `cora_acct_code`;
- exception ids and business keys use `cora_acct_code` consistently;
- the workbook dashboard labels the dealer grouping as `cora_acct_code`;
- the run audit shows a successful daily execution after the contract change;
- the packet readout documents whether exception history was migrated or reset.

Completion note:

- Executed as `CORA-001` on 2026-06-25.
- Updated SQL, runner headers/grouping, output contract, sample headers,
  workbook source notes, and reviewer docs to use `cora_acct_code`.
- Ran plan-only validation successfully with run id `20260625T103126Z`.
- Ran live summary refresh successfully with run id `20260625T110927Z`.
- Ran the daily detail/workbook package successfully with run id
  `20260625T110943Z`.
- Exception history was intentionally reset to the corrected key shape:
  `resolved_since_last_run.csv` and `open_exceptions.csv` both had `1194` rows
  on the first corrected run.

### WP-DVL-012 - Classification Taxonomy And Output Contract

Goal: add the layered classification model to the Snowflake/DMS validation
contract before changing runtime logic.

Status: completed

Scope:

- define raw exception type vs reviewer classification;
- add classification groups for coverage, mapping, timing, key/grain,
  date/status, amount, and unexplained issues;
- update output contract and sample headers;
- update validation review guide.

Acceptance:

- output fields are named and documented;
- workbook definition-tab content is drafted;
- no source-system queries are required.

Completion note:

- Executed as `CLA-001A` on 2026-06-25.
- Added dataset taxonomy config:
  `config/review-classification-taxonomy.yml`.
- Updated `output-contract.yml`, exception sample headers, and
  `VALIDATION_REVIEW_GUIDE.md`.
- No live source queries were run.

### WP-DVL-013 - Broad Snowflake Presence Classifier

Goal: stop treating scoped missing rows as true missing until a broad Snowflake
presence check runs.

Status: completed

Scope:

- for DMS-present/Snowflake-missing repair orders, search Snowflake by RO number
  without the scoped dealer filter;
- add `snowflake_found_elsewhere` and Snowflake dealer/store/account evidence
  fields;
- classify true missing vs found elsewhere.

Acceptance:

- SA476-style rows can be classified as present elsewhere in Snowflake;
- true missing rows remain isolated;
- outputs remain bounded and read-only.

Completion note:

- Executed as `CLA-001B` on 2026-06-25.
- Added a broad Snowflake RO-number lookup for repair-order rows missing from
  the scoped Snowflake comparison.
- Live detail run `20260625T122333Z` succeeded.
- Repair-order missing rows classified as:
  - `525` `found_in_snowflake_wrong_dealer_context`;
  - `1` `true_missing_from_snowflake`.
- Classification evidence fields now include Snowflake dealer code, store
  number, EIS store id, and accounting account where found.
- Main workbook overwrite was blocked by a file lock; generated
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001B.xlsx` as the
  verified packet workbook.

### WP-DVL-014 - Dealer Mapping Classification Rules

Goal: turn broad-presence evidence into vendor-ready mapping classifications.

Status: completed

Scope:

- classify `found_in_snowflake_wrong_dealer_context`;
- classify `blank_primary_dealer_with_secondary_match`;
- classify `ambiguous_dealer_context`;
- classify repeated mapping patterns as `mapping_rule_gap`;
- update vendor research sample generation.

Acceptance:

- classification reason includes source-native evidence fields;
- vendor samples do not call rows missing when they are found elsewhere;
- SA476 evidence can be explained without manual reinterpretation.

Completion note:

- Executed as `CLA-001C` on 2026-06-25.
- Live detail run `20260625T123018Z` succeeded.
- Repair-order scoped missing rows classified as:
  - `495` `blank_primary_dealer_with_secondary_match`;
  - `30` `found_in_snowflake_wrong_dealer_context`;
  - `1` `true_missing_from_snowflake`.
- Generated vendor research sample:
  `current/exceptions/research_samples/repair_orders_mapping_research_sample.csv`.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001C.xlsx`.

### WP-DVL-015 - Accuracy And Amount Classification Rules

Goal: prepare the validation for actual accuracy review after presence and
mapping are understood.

Status: completed

Scope:

- split changed-value exceptions into amount-specific classes;
- define rounding tolerance;
- identify amount component gaps, sign/credit issues, null-vs-zero issues,
  late updates, and unexplained material differences;
- keep raw amount fields auditable.

Acceptance:

- amount issues are no longer one undifferentiated changed-value bucket;
- reviewer can separate mapping/key problems from true amount accuracy issues;
- dashboard can show amount definition issues separately from unexplained
  accuracy issues.

Completion note:

- Executed as `CLA-001D` on 2026-06-25.
- Added explicit amount tolerance documentation in
  `config/accuracy-thresholds.yml`.
- Live detail run `20260625T123829Z` succeeded.
- `665` repair-order changed-value rows now classify as
  `amount_component_gap` because the matched-key amount review compares DMS
  customer-pay core fields to Snowflake `PAYCPTOTAL`.
- `2` vehicle-sales changed-value rows remain
  `material_amount_mismatch_unexplained` because no amount component, sign,
  null-vs-zero, or rounding explanation is currently proven.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001D.xlsx`.

### WP-DVL-016 - Workbook Definitions Tab And Dashboard Buckets

Goal: make the workbook explain the classification model in plain English.

Status: completed

Scope:

- add a `Classification Definitions` tab;
- include raw exception type, review classification, group, meaning, first
  check, and vendor handoff guidance;
- update dashboard buckets to use classification groups;
- verify workbook render and inspect output.

Acceptance:

- workbook users can understand classifications without asking Codex;
- dashboard labels match the definitions tab;
- workbook rebuild still succeeds from stable local CSVs.

Completion note:

- Executed as `CLA-001E` on 2026-06-25.
- Added a workbook `Classification Definitions` tab populated from
  `config/review-classification-taxonomy.yml`.
- Updated dashboard output to show open exceptions by classification group and
  by review classification, while preserving the existing summary and raw
  exception queue sections.
- Rebuilt and visually verified:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001E.xlsx`.

### WP-DVL-017 - Classification Readback And Count Movement

Goal: prove the new classifications make the output more useful.

Status: completed

Scope:

- run the daily validation after classification changes;
- compare old missing/changed counts to new classification groups;
- document how many rows moved into mapping, timing, amount, true missing, and
  unexplained buckets;
- document any exception-history reset.

Acceptance:

- daily command succeeds;
- workbook rebuild succeeds;
- count movement is documented for business and vendor review.

Completion note:

- Executed as `CLA-001F` on 2026-06-25.
- Daily detail run `20260625T125119Z` succeeded with `1194` open exceptions
  and `0` resolved exceptions.
- Workbook rebuild succeeded to:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_20260625_085118.xlsx`.
- The main workbook file was locked by Excel, so the daily status recorded one
  warning and used the timestamped workbook path.
- Documented count movement in
  `CLASSIFICATION_READBACK_FINDINGS.md`: `667` changed rows split into `665`
  amount-component rows and `2` unexplained vehicle-sales amount rows; `526`
  repair-order missing-from-Snowflake rows split into `525` mapping rows and
  `1` true coverage candidate.
- No exception-history reset occurred.

### WP-DVL-018 - Snowflake-Only Timing Classification

Goal: remove the remaining unclassified Snowflake-only bucket by classifying
`missing_from_dms` rows conservatively.

Status: completed

Scope:

- add a reviewer classification for Snowflake-present/DMS-missing detail rows;
- treat Snowflake-only rows as timing/freshness or scope candidates by default,
  not DMS defects;
- rerun validation and rebuild the workbook;
- document the count movement out of `unclassified`.

Acceptance:

- `missing_from_dms` exception rows include `review_classification`,
  `classification_group`, `classification_reason`, and
  `accuracy_check_status`;
- dashboard no longer shows an unclassified row for the current Snowflake-only
  vehicle-sale exception;
- docs record that the classification is conservative pending next-run/source
  review.

Completion note:

- Executed as `CLA-001G` on 2026-06-25.
- Added conservative default classification for Snowflake-present/DMS-missing
  detail rows.
- Live detail run `20260625T125747Z` succeeded.
- The current Snowflake-only vehicle-sales row `SA466-S|237319` now classifies
  as `timing_candidate`.
- Open exceptions with blank review classification moved from `1` to `0`.
- Generated verified packet workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001G.xlsx`.

### WP-DVL-019 - Accuracy Metric Contract And Thresholds

Goal: define the accuracy dashboard before implementing code or workbook
changes.

Status: completed

Scope:

- define scorecard metric names and denominator rules;
- document decision status values;
- add conservative threshold defaults;
- map existing review classifications to accuracy categories.

Acceptance:

- metric contract matches ADR-025 and ADR-026;
- thresholds are explicit and tunable;
- source-native labels such as `cora_acct_code` remain required;
- the packet does not run source queries or rebuild the workbook.

Completion note:

- Executed on 2026-06-26.
- Added
  `data-validation/datasets/snowflake-dms-shared-consumption/ACCURACY_METRIC_CONTRACT.md`.
- Added
  `data-validation/datasets/snowflake-dms-shared-consumption/config/accuracy-dashboard-thresholds.yml`.
- Expanded the accuracy dashboard contract with denominators, metric formulas,
  and classification-to-accuracy mappings.
- Did not query source systems or rebuild the workbook.

### WP-DVL-020 - Accuracy CSV Builder

Goal: produce deterministic accuracy CSVs from existing validation outputs.

Status: completed

Scope:

- read current summary and exception CSVs;
- calculate key match, value match, readiness, blockers, and candidate defects;
- write `current/accuracy/` files;
- archive the same files under the active run id.

Acceptance:

- `accuracy_scorecard.csv` exists for vehicle sales and repair orders;
- metric definitions and blockers are generated;
- formula-definition gaps are not counted as certified Snowflake defects;
- daily audit records the generated accuracy paths.

Completion note:

- Executed on 2026-06-26.
- Added accuracy CSV generation to the validation runner.
- Live run `20260626T111348Z` succeeded and generated:
  - `current/accuracy/accuracy_scorecard.csv`;
  - `current/accuracy/accuracy_metric_definitions.csv`;
  - `current/accuracy/accuracy_blockers.csv`;
  - `current/accuracy/accuracy_review_samples_manifest.csv`.
- The generated files were also archived under
  `runs/20260626T111348Z/accuracy/`.
- Current decision statuses are `review_needed` for vehicle sales and
  `not_ready` for repair orders.

### WP-DVL-021 - Workbook Accuracy Dashboard Tab

Goal: make the accuracy answer visible in the Excel workbook.

Status: completed

Scope:

- add an `Accuracy Dashboard` worksheet;
- show the run banner, subject-area scorecards, rates, blockers, and next
  review actions;
- preserve existing exception and classification worksheets.

Acceptance:

- workbook opens cleanly;
- dashboard can be understood without reading code;
- the view separates key match, value match, and readiness;
- caveats are visible before any migration-readiness conclusion.

Completion note:

- Executed on 2026-06-26.
- Added an `Accuracy Dashboard` worksheet as the first tab in the workbook.
- Added raw accuracy CSV tabs for scorecard, blockers, metric definitions, and
  sample manifest.
- Rebuilt
  `data-validation/datasets/snowflake-dms-shared-consumption/excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`.
- Rendered and reviewed
  `data-validation/datasets/snowflake-dms-shared-consumption/excel/previews/accuracy_dashboard.png`.

### WP-DVL-022 - Bounded Accuracy Drilldowns

Goal: provide the row samples needed to research the dashboard blockers.

Status: completed

Scope:

- generate bounded samples for true missing rows, wrong dealer context, blank
  primary dealer with secondary match, timing candidates, amount component gaps,
  and unexplained material amount mismatches;
- generate a manifest for the workbook.

Acceptance:

- sample files use source-native identifiers;
- samples are bounded and local;
- the manifest tells reviewers where to start.

Completion note:

- Executed on 2026-06-26.
- Added bounded sample generation to the validation runner.
- Live run `20260626T112257Z` generated:
  - `current/accuracy/samples/accuracy_mapping_review_sample.csv`;
  - `current/accuracy/samples/accuracy_amount_component_gap_sample.csv`;
  - `current/accuracy/samples/accuracy_unexplained_amount_mismatch_sample.csv`;
  - `current/accuracy/samples/accuracy_true_missing_from_snowflake_sample.csv`;
  - `current/accuracy/samples/accuracy_timing_review_sample.csv`.
- Rebuilt the workbook so the accuracy dashboard includes the updated sample
  manifest.

### WP-DVL-023 - Accuracy Daily Readback

Goal: prove the accuracy dashboard lines up with the current live validation
reality.

Status: completed

Scope:

- run the daily validation command;
- verify accuracy CSVs and workbook;
- summarize whether Snowflake looks accurate, blocked by definitions, or
  genuinely suspicious.

Acceptance:

- daily run succeeds;
- workbook is rebuilt;
- readback identifies blockers and suspicious items;
- remaining gaps are added to backlog.

Completion note:

- Executed on 2026-06-26.
- First daily attempt failed during Snowflake connection setup; rerun succeeded.
- Successful daily run id: `20260626T112910Z`.
- Workbook rebuild succeeded.
- Added
  `data-validation/datasets/snowflake-dms-shared-consumption/ACCURACY_DAILY_READBACK_FINDINGS.md`.
- Current accuracy readback: vehicle sales is `review_needed`; repair orders is
  `not_ready`; overall dashboard status is `not_ready`.

### WP-DVL-024 - Vendor Accuracy Handoff Packet

Goal: prepare a concise packet for vendor/source-system follow-up.

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

- Executed on 2026-06-26.
- Added
  `data-validation/datasets/snowflake-dms-shared-consumption/VENDOR_ACCURACY_HANDOFF_PACKET.md`.
- Packet references bounded accuracy samples and separates questions for
  formula, dealer-context, timing, and candidate-defect review.
