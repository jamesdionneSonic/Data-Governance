# Accuracy Daily Readback Findings

## Run

Readback date: 2026-06-26

Successful daily run id: `20260626T112910Z`

Daily command:

```powershell
powershell -ExecutionPolicy Bypass -File data-validation\datasets\snowflake-dms-shared-consumption\scripts\run_daily_validation.ps1
```

The first daily attempt failed during Snowflake connection setup with
`connect ECONNREFUSED 127.0.0.1:9`. The rerun succeeded with elevated execution.
The successful run is the current audit state.

## Daily Status

- Overall daily status: succeeded
- Detail status: succeeded
- Workbook status: succeeded
- Open exceptions: 1,189
- Resolved since last run: 0
- Warnings: 0
- Errors: 0
- Workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`

## Accuracy Scorecard

### Vehicle Sales

Decision: `review_needed`

Vehicle sales is close, but not clean enough to call trusted yet.

Signals:

- DMS scoped records: 820
- Snowflake scoped records: 821
- matched keys: 818
- key match rate: 100.00%
- value match rate: 99.76%
- readiness rate: 99.76%
- candidate defects: 2
- blockers: 2
- confidence: high

Interpretation:

The population and key coverage look strong. The reason this is not
`candidate_ready` is the two unexplained material amount mismatches. Those need
research before Snowflake can be treated as accurate for vehicle sales.

Sample to review:

```text
current/accuracy/samples/accuracy_unexplained_amount_mismatch_sample.csv
```

### Repair Orders

Decision: `not_ready`

Repair orders is not ready for a Snowflake trust claim.

Signals:

- DMS scoped records: 3,084
- Snowflake scoped records: 2,552
- matched keys: 2,552
- missing from Snowflake: 532
- mapping review rows: 531
- formula-definition review rows: 654
- candidate defects: 1
- key match rate: 82.75%
- value match rate: 100.00%
- readiness rate: 99.97%
- blockers: 1,186
- confidence: medium

Interpretation:

The 100.00% value match rate is not a final accuracy win. It is calculated only
after excluding repair-order amount rows that are blocked by the
`amount_component_gap` formula-definition issue. The important repair-order
story is:

- 654 rows need the Snowflake `PAYCPTOTAL` formula confirmed against DMS
  customer-pay components;
- 502 rows have blank primary dealer with secondary account context matching
  DMS;
- 29 rows are found in Snowflake under a different dealer/account context;
- 1 row remains a true missing-from-Snowflake candidate.

Repair orders should stay `not_ready` until the vendor/source owner confirms the
dealer/account mapping rule and the `PAYCPTOTAL` formula.

## Blocker Samples

Generated bounded local samples:

```text
current/accuracy/samples/accuracy_mapping_review_sample.csv
current/accuracy/samples/accuracy_amount_component_gap_sample.csv
current/accuracy/samples/accuracy_unexplained_amount_mismatch_sample.csv
current/accuracy/samples/accuracy_true_missing_from_snowflake_sample.csv
current/accuracy/samples/accuracy_timing_review_sample.csv
```

The workbook sample manifest points to these files.

## Does The Dashboard Line Up With Reality?

Yes. The dashboard is now less suspicious than the old exception summary because
it separates three different ideas:

- vehicle sales is mostly aligned but has two amount defects to research;
- repair-order row presence is materially short under the scoped match;
- most repair-order "missing" rows are not simple missing data, because broad
  Snowflake search finds them with dealer/account mapping problems.

The dashboard is intentionally conservative. It does not call Snowflake accurate
for repair orders just because many rows have an explanation. The explanations
are still blockers until the vendor/source owner confirms the mapping and amount
definition rules.

## New Gaps

No new implementation gaps were found in this packet.

The next logical work is the vendor accuracy handoff packet. That packet should
turn the blocker samples into research questions for:

- vehicle-sales unexplained amount mismatches;
- repair-order `PAYCPTOTAL` formula definition;
- repair-order dealer/account mapping;
- the one true missing-from-Snowflake candidate.
