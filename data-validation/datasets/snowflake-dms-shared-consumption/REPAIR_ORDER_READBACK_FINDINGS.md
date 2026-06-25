# Repair Order Readback Findings

Dataset: `snowflake-dms-shared-consumption`

Repair packet: `ROL-003`

## Run Evidence

Live read-only audit:

- `tmp/deep-repair-order-logic-audit.json`

Current-output classification:

- `tmp/repair-order-current-difference-classification.json`

Current validation run:

- run id: `20260624T212852Z`

## Readback Result

The repaired repair-order logic is materially fairer than the original logic.
The process is no longer dominated by the wrong DMS amount basis.

The current DMS repair extract health is good:

| Signal                                  | Count |
| --------------------------------------- | ----: |
| DMS repair rows                         | 2,970 |
| DMS unique business keys                | 2,970 |
| Duplicate DMS business keys             |     0 |
| Selected from closed table              | 2,559 |
| Selected from open table                |   411 |
| Rows with open/closed overlap collapsed | 1,517 |

Snowflake repair extract:

| Signal                         | Count |
| ------------------------------ | ----: |
| Snowflake repair rows          | 2,512 |
| Snowflake unique business keys | 2,512 |

## Amount Logic Readback

The live audit still confirms DMS customer-pay core is the strongest available
match to Snowflake `PAYCPTOTAL`.

| DMS amount candidate          | Within $1 | Diff >= $1 | Average absolute diff |
| ----------------------------- | --------: | ---------: | --------------------: |
| Original all-sale total       |       223 |      2,231 |                777.75 |
| Customer-pay core             |     1,806 |        648 |                 20.92 |
| Customer-pay core + sublet CP |     1,788 |        666 |                 27.56 |

Customer-pay core remains the best current comparison:

```text
laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay
```

This confirms `ROL-001` moved the validation from a known bad field pairing to
the best available DMS/Snowflake amount pairing found in the live metadata.

## Remaining Changed Values

Remaining repair changed-value count:

- `648`

Difference distribution:

| Difference bucket  | Count |
| ------------------ | ----: |
| $1.00 to $9.99     |    39 |
| $10.00 to $49.99   |   341 |
| $50.00 to $99.99   |   134 |
| $100.00 to $499.99 |   125 |
| $500.00+           |     9 |

Dealer split:

| Dealer family | Count |
| ------------- | ----: |
| SA466-S       |   525 |
| SA476-S       |   123 |

Classification:

```text
field_definition_or_fee_component_candidate
```

Interpretation:

The remaining changed values are no longer obvious false positives from
comparing all DMS sales to Snowflake customer pay. Most are smaller deltas and
need a business-rule review for remaining fee, tax, sublet, rounding, or source
timing components.

These should not yet be treated as Snowflake defects. They are now legitimate
review candidates.

## Remaining Missing-Key Differences

### DMS Present / Snowflake Missing

Count:

- `516`

Dealer split:

| Dealer family | Count |
| ------------- | ----: |
| SA466-S       |    16 |
| SA476-S       |   500 |

Top dates:

| Date       | Count |
| ---------- | ----: |
| 2026-06-05 |    38 |
| 2026-05-29 |    37 |
| 2026-06-22 |    37 |
| 2026-06-08 |    36 |
| 2026-06-15 |    36 |
| 2026-06-23 |    35 |

Classification:

```text
feed_coverage_or_filter_candidate
```

Interpretation:

This is the biggest remaining concern. The missing-from-Snowflake records are
heavily concentrated under `SA476-S` and spread across multiple historical
dates, so they should not be dismissed as simple timing. This points toward
dealer-code mapping, feed coverage, status filtering, or source extraction
rules.

### Snowflake Present / DMS Missing

Count:

- `58`

Dealer split:

| Dealer family | Count |
| ------------- | ----: |
| SA466-S       |    56 |
| SA476-S       |     2 |

Date split:

| Date       | Count |
| ---------- | ----: |
| 2026-06-24 |    58 |

Classification:

```text
timing_candidate
```

Interpretation:

All Snowflake-only repair rows are on the current date, June 24, 2026. That is
consistent with Snowflake being ahead of the SQL Server DMS extract or timing
differences between source refreshes.

These should be checked on the next daily run before escalating as source
quality issues.

## Conclusion

`ROL-003` passes.

The repair-order validation is now fair enough to use for review, with these
boundaries:

- amount differences are real review candidates, not obvious validation logic
  bugs;
- DMS-present/Snowflake-missing differences need feed coverage, filter, or
  dealer mapping review, especially SA476;
- Snowflake-present/DMS-missing differences currently look like timing.

## Recommended Next Work

Execute `ROL-004` to update reviewer documentation and source mapping language.

After that, start a focused investigation packet for the `516`
DMS-present/Snowflake-missing repair orders, prioritizing SA476.
