# Accuracy Metric Contract

## Purpose

This contract defines the metrics for the Snowflake versus DMS accuracy
dashboard. It is the implementation guide for `WP-DVL-019`.

The contract keeps three ideas separate:

- exception triage: what is different;
- accuracy scoring: how much of the data can be trusted;
- readiness decision: what still blocks Snowflake from replacing DMS for this
  dataset.

## Source-Of-Record Rule

DMS is the source of record for this validation.

Snowflake is the candidate source being evaluated. A Snowflake difference is not
automatically a defect, but Snowflake does not become the trusted source until
the business approves that decision.

## Subject Areas

The first dashboard implementation must score:

- `vehicle_sales`;
- `repair_orders`.

Each subject area must be scored separately before any combined readout is
shown.

## Denominators

### Scoped Population

Records returned by the current validation queries after date, dealer/account,
and subject-area filters.

This is the population being compared.

### Eligible Records

Scoped records with enough key and date evidence to participate in validation.

Rows with missing required keys or unsupported grain should be counted but marked
as `not_scored`.

### Matched Key Records

Eligible records where the normalized business key exists on both sides.

This is the numerator for key matching.

### Value Scored Records

Matched-key records where the material amount or status formula is certified
enough to score.

Repair-order rows classified as `amount_component_gap` are not final value
accuracy failures until the Snowflake `PAYCPTOTAL` formula is confirmed against
DMS components.

### Candidate Defect Records

Rows that remain true missing, unexplained material mismatches, or other
unsupported differences after the current classification rules are applied.

These records are blockers by default.

## Required Metrics

### Key Match Rate

```text
matched_key_records / eligible_records
```

Meaning: how well the two systems agree on record identity and coverage.

### Raw Value Match Rate

```text
validated_value_matches / value_scored_records
```

Meaning: of the records safe to compare by value, how many material values
matched within tolerance.

Rows pending amount formula confirmation are excluded from this denominator and
counted as formula-definition review.

### Classification-Adjusted Readiness Rate

```text
(validated_matches + approved_or_reviewable_non_defect_rows) / eligible_records
```

Meaning: how much of the scoped validation population is either matching or has
a known non-defect review path.

This is a readiness metric, not a final accuracy claim.

### Candidate Defect Count

Count of records classified as true gaps or unexplained material differences.

Meaning: how many rows currently look like vendor/source defects or unresolved
accuracy issues.

### Migration Blocker Count

Count of open issues that prevent a stronger Snowflake readiness statement.

This includes candidate defects and high-impact unresolved review buckets, such
as unconfirmed amount formulas or dealer-context mapping issues.

## Status Rules

### candidate_ready

Use only when:

- key match rate meets the candidate-ready threshold;
- raw value match rate meets the candidate-ready threshold;
- candidate defect count is zero;
- migration blocker count is zero;
- confidence is high enough for the subject area.

### review_needed

Use when:

- data is mostly aligning;
- differences are explainable or have a clear review path;
- blockers remain but do not prove the source is wrong yet.

### not_ready

Use when:

- candidate defects are material;
- key or value match rates are below threshold;
- formula, mapping, or grain blockers prevent a responsible readiness claim.

### not_scored

Use when the evidence does not support scoring.

## Classification To Accuracy Mapping

| Classification                              | Accuracy role                          | Default blocker                   |
| ------------------------------------------- | -------------------------------------- | --------------------------------- |
| `amount_match`                              | validated value match                  | no                                |
| `amount_rounding_difference`                | validated value match within tolerance | no                                |
| `blank_primary_dealer_with_secondary_match` | mapping review                         | yes                               |
| `found_in_snowflake_wrong_dealer_context`   | mapping review                         | yes                               |
| `ambiguous_dealer_context`                  | mapping review                         | yes                               |
| `mapping_rule_gap`                          | mapping review                         | yes                               |
| `timing_candidate`                          | timing review                          | no, unless aging beyond threshold |
| `amount_component_gap`                      | formula-definition review              | yes                               |
| `material_amount_mismatch_unexplained`      | candidate defect                       | yes                               |
| `true_missing_from_snowflake`               | candidate defect                       | yes                               |
| `true_snowflake_only`                       | timing or scope review                 | no, unless aging beyond threshold |
| `duplicate_source_record`                   | grain/key review                       | yes                               |
| `grain_mismatch`                            | grain/key review                       | yes                               |

## Thresholds

The active scorecard thresholds live in:

```text
config/accuracy-dashboard-thresholds.yml
```

The amount materiality threshold remains separate in:

```text
config/accuracy-thresholds.yml
```

## Implementation Notes

The next packet should compute metrics from local CSV files under `current/`.
It should not query source systems only to create the dashboard. The source
extracts and comparison outputs are the evidence base.

The first implementation may classify overall readiness conservatively. A
conservative `review_needed` or `not_ready` answer is better than a confident
but misleading green score.
