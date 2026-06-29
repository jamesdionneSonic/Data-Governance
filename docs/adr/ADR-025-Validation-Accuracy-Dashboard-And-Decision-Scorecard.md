# ADR-025: Validation Accuracy Dashboard And Decision Scorecard

## Status

Accepted

## Date

2026-06-26

## Context

The Snowflake versus DMS shared-consumption validation workbook currently does a
good job of triaging differences. It shows whether rows are matched, missing,
changed, mapped to the wrong dealer context, timing candidates, amount component
gaps, or unexplained.

That does not yet answer the executive and vendor-facing question:

```text
Is Snowflake accurate enough to trust for this dataset?
```

The answer requires a separate accuracy dashboard because exception triage and
accuracy scoring are related but not the same thing.

Examples:

- a row found in Snowflake under the wrong dealer context is not a pure missing
  data defect, but it is still a readiness issue;
- a repair-order amount gap caused by comparing DMS component fields to
  Snowflake `PAYCPTOTAL` is not proven inaccurate until the vendor confirms the
  amount formula;
- a timing candidate may be acceptable for freshness analysis but not for final
  replacement scoring;
- a true missing record and an unexplained material amount mismatch should be
  treated as higher-risk accuracy defects.

DMS remains the source of record until the business explicitly approves a
migration decision.

## Decision

Add an accuracy dashboard layer to repeatable validation datasets.

The accuracy dashboard must sit above the raw comparison and classification
outputs. It will summarize the current run into decision-safe scorecards that
separate:

- population coverage;
- business-key match rate;
- amount/value match rate;
- classification-adjusted readiness;
- unresolved defect candidates;
- timing, mapping, and formula-definition review buckets;
- migration blockers and open vendor questions.

The dashboard must not imply that Snowflake is accurate just because exceptions
have been classified. It must distinguish between:

- `validated_match`: record and material values agree within tolerance;
- `reviewable_difference`: row differs, but the difference has a known review
  path such as timing or mapping;
- `excluded_pending_definition`: the denominator is not suitable for final
  accuracy scoring because a formula, grain, or mapping rule is not certified;
- `candidate_defect`: true missing, unexplained material mismatch, or other
  issue likely requiring source/vendor correction;
- `not_scored`: out of scope, duplicate, unsupported, or insufficient evidence.

## Denominator Rules

Accuracy metrics must be explicit about the denominator being used.

Required denominator concepts:

- `scoped_population`: all records returned by the current DMS and Snowflake
  validation extracts after date, dealer, and subject-area filters;
- `eligible_records`: scoped records that have enough key and date evidence to
  participate in validation;
- `matched_key_records`: eligible records where the business key exists on both
  sides after approved normalization;
- `value_scored_records`: matched-key records where the material amount/value
  formula is certified enough to score;
- `excluded_records`: records held out of final accuracy scoring because of
  timing, mapping, grain, or formula-definition gaps;
- `candidate_defect_records`: records that remain true missing, Snowflake-only
  without a timing explanation, or unexplained value mismatches.

The dashboard may show multiple rates, but the final readiness score must label
which denominator it uses.

## Required Metrics

Each subject area must support these metrics when data exists:

- DMS scoped record count;
- Snowflake scoped record count;
- matched key count;
- missing from Snowflake count;
- Snowflake-only count;
- validated amount/value match count;
- amount/value mismatch count;
- mapping review count;
- timing review count;
- formula-definition review count;
- unexplained candidate defect count;
- key match rate;
- raw value match rate;
- classification-adjusted readiness rate;
- migration blocker count;
- score confidence.

## Dashboard Language

The workbook must use plain-English decision language, but source-native fields
remain visible where they matter.

Allowed:

- `cora_acct_code`;
- `RO number`;
- `Snowflake PAYCPTOTAL`;
- `DMS customer-pay component total`;
- `candidate defect`;
- `pending vendor formula confirmation`.

Not allowed:

- replacing source-native identifiers with invented friendly aliases;
- calling a row inaccurate when the current evidence only proves a timing,
  mapping, or formula-definition difference;
- hiding known caveats behind a single green percentage.

## Consequences

This adds one more layer to the validation outputs, but it prevents the workbook
from being read as either too negative or too optimistic.

The exception dashboard remains necessary for operational triage. The accuracy
dashboard becomes the business decision view.

The daily process must remain low-intelligence and one-command. The scorecard
must be computed from local CSV outputs produced by the deterministic workflow,
not from manual workbook formulas or new source database objects.

## Guardrails

- Do not create SQL Server or Snowflake objects.
- Do not commit local CSVs containing business row data.
- Do not publish unrestricted row samples to shared documentation.
- Do not certify final Snowflake replacement readiness until the repair-order
  amount formula and dealer/context mapping rules are confirmed.
- Do not treat classified exceptions as resolved defects unless the exception
  history shows resolution or an approved exclusion rule.
