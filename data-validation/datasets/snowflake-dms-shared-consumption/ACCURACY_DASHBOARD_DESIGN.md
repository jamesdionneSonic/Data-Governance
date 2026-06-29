# Accuracy Dashboard Design

## Purpose

The accuracy dashboard is the business decision view for the Snowflake versus
DMS shared-consumption validation.

The existing dashboard answers:

```text
What exceptions exist and how are they classified?
```

The accuracy dashboard must answer:

```text
Can we trust Snowflake for this dataset yet, and what is blocking that answer?
```

## Audience

- business reviewers deciding whether Snowflake is ready to rely on;
- data engineering reviewers checking comparison logic;
- vendor/source-system partners researching mismatches;
- support users who need a plain-English readout without reading CSV files.

## Decision Model

DMS is the source of record until a migration decision is approved.

Snowflake should be evaluated against DMS in layers:

1. Population coverage: are the scoped records present on both sides?
2. Key accuracy: do business keys match after approved normalization?
3. Value accuracy: do material amounts and statuses match within tolerance?
4. Classification-adjusted readiness: are remaining differences explainable,
   approved exclusions, or unresolved defects?
5. Migration blockers: what still prevents trusting Snowflake?

## Dashboard Sections

### Run Banner

- run id;
- run timestamp;
- date window;
- dealers in scope using `cora_acct_code`;
- overall decision status;
- short plain-English readout.

### Subject-Area Scorecards

One scorecard per subject area:

- vehicle sales;
- repair orders.

Each scorecard should show:

- DMS scoped records;
- Snowflake scoped records;
- matched key records;
- key match rate;
- validated value matches;
- raw value match rate;
- reviewable differences;
- candidate defects;
- decision status;
- confidence.

### Accuracy Bars

Show rates separately:

- key match rate;
- raw value match rate;
- classification-adjusted readiness rate.

Do not collapse these into one unlabeled score.

### Blockers And Caveats

List blockers before users over-trust the rates:

- repair-order amount formula pending vendor confirmation;
- dealer/context mapping rows requiring vendor review;
- timing candidates requiring next-refresh confirmation;
- unexplained material amount mismatches;
- true missing rows.

### Next Review Actions

Point reviewers to the bounded samples:

- true gaps;
- wrong dealer/context;
- blank primary dealer with secondary match;
- amount component gap;
- unexplained amount mismatch;
- timing candidates.

## Metric Definitions

### Key Match Rate

Records with matching business keys divided by eligible records.

This is a coverage and identity signal. It does not prove amounts are correct.

### Raw Value Match Rate

Matched-key records with material values within tolerance divided by
value-scored records.

This should exclude rows where the material value formula is not certified.

### Classification-Adjusted Readiness Rate

Records that are either validated matches or approved/reviewable differences
divided by eligible records.

This is a readiness signal, not a final accuracy claim.

### Candidate Defect Count

Rows that remain true missing, unexplained material mismatches, or otherwise
unsupported by timing, mapping, grain, or formula explanations.

## First Implementation Rules

- Compute accuracy outputs from local CSVs under `current/`.
- Archive the same files under `runs/<run-id>/`.
- Do not query source systems only for the dashboard after the validation run.
- Do not create source database objects.
- Keep `cora_acct_code` visible.
- Treat unconfirmed formula rows as review needed, not as certified defects.
- Keep samples bounded and local.

## Success Criteria

The workbook gives a reviewer a clear answer:

- what matched;
- what did not match;
- what is explainable;
- what is still suspicious;
- what has to be researched before Snowflake can be trusted.
