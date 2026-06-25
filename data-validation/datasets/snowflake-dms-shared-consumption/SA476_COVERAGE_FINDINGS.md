# SA476 Coverage Findings

Dataset: `snowflake-dms-shared-consumption`

Investigation: `SA476-001`

Run date: `2026-06-25`

Validation run id: `20260625T100939Z`

## Daily Refresh Result

The daily validation completed successfully on June 25, 2026.

| Signal                               | Count |
| ------------------------------------ | ----: |
| Open exceptions                      | 1,194 |
| Resolved since last run              |    85 |
| Changed records written              |   667 |
| Repair orders missing from Snowflake |   526 |
| Repair orders missing from DMS       |     0 |
| Vehicle rows missing from Snowflake  |     0 |
| Vehicle rows missing from DMS        |     1 |

The previous Snowflake-only repair-order timing signal resolved:

- June 24 run: `58` repair orders were Snowflake-only.
- June 25 run: `0` repair orders are Snowflake-only.

That supports the prior classification that Snowflake-only repair rows were
timing candidates.

## SA476 Coverage Check

The June 25 output still showed SA476 as the main DMS-present/Snowflake-missing
repair-order issue.

Focused SA476 check:

| Signal                                   | Count |
| ---------------------------------------- | ----: |
| SA476 missing-from-Snowflake rows        |   509 |
| Distinct RO numbers checked              |   509 |
| Broad Snowflake matches by RO number     |   508 |
| Distinct ROs found anywhere in Snowflake |   508 |
| Found under other Snowflake dealer codes |   508 |
| Still absent from Snowflake              |     1 |

## Interpretation

SA476 is not mostly missing from Snowflake.

The broad Snowflake search found `508` of `509` SA476 DMS-missing RO numbers
somewhere in `REPAIR_ORDER_RAW` when the dealer-code filter was removed.

That means the current validation mapping is too narrow. We are treating these
ROs as missing because they do not appear under the currently mapped SA476
Snowflake dealer codes:

- `R0429`
- `S000500622`

Most broad matches are under blank `DEALERCODE`:

| Snowflake dealer code        | Match count |
| ---------------------------- | ----------: |
| blank                        |         495 |
| assorted single dealer codes |          13 |

## Current Conclusion

The SA476 issue is primarily a dealer/store mapping or source field selection
problem, not a Snowflake feed-coverage problem.

The repair-order validation should not rely only on `DEALERCODE` for SA476.
For SA476, the Snowflake row may carry the correct RO under another dealer/store
identifier, or with blank `DEALERCODE`.

## Output Files

Local investigation outputs:

- `current/coverage/sa476/sa476_coverage_summary.json`
- `current/coverage/sa476/sa476_missing_dms_ro_rows.csv`
- `current/coverage/sa476/sa476_missing_dms_ro_detail.csv`
- `current/coverage/sa476/sa476_broad_snowflake_ro_search.csv`
- `current/coverage/sa476/sa476_still_absent_from_snowflake.csv`

## Recommended Next Fix

Create a mapping-repair packet:

`SA476-002 - Repair Snowflake Dealer Mapping For Repair Orders`

Scope:

- profile SA476 broad Snowflake matches by `DEALERCODE`, `STORENUMBER`,
  `EIS_STORE_ID`, and `ACCOUNTINGACCOUNT`;
- identify the best Snowflake store/dealer field for SA476 repair orders;
- update repair-order Snowflake normalization to map SA476 using the corrected
  field logic;
- rerun validation and confirm SA476 missing-from-Snowflake count drops
  materially;
- keep one still-absent RO as an explicit residual exception if it remains
  absent after mapping repair.

Do not classify the current SA476 missing rows as Snowflake data loss until the
dealer/store mapping is repaired.
