# Repair Order Logic Fix Plan

Dataset: `snowflake-dms-shared-consumption`

## Plain-English Finding

The current repair-order validation is looking at the intended source tables,
but the repair-order comparison logic is not yet fair enough to use as a
Snowflake data-quality judgment.

Vehicle sales can continue as-is. Repair orders need a focused logic repair
before the dashboard should be used to decide whether Snowflake is missing,
wrong, or better than DMS.

## Live Evidence

Deep read-only audit file:

- `tmp/deep-repair-order-logic-audit.json`

Validation process audit file:

- `tmp/snowflake-dms-validation-process-audit.json`

### Source Tables Are Correct

The current process uses the intended tables:

- Snowflake:
  `CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW`
- SQL Server DMS:
  - `DMS.dbo.servicesalesclosed`
  - `DMS.dbo.servicesalesopen`

### DMS Open/Closed Overlap Is Real

Live 30-day overlap:

| DMS dealer id | Closed RO keys | Open RO keys | Keys in both |
| ------------- | -------------: | -----------: | -----------: |
| `445`         |          1,628 |        1,093 |          890 |
| `20246`       |            931 |          835 |          627 |

That means the current DMS union is not a clean one-row-per-RO comparison
source. The same RO can appear in both open and closed tables during the
validation window.

After deduplicating to one DMS row per dealer plus RO number:

| Signal                          | Count |
| ------------------------------- | ----: |
| DMS unique repair-order rows    | 2,970 |
| Snowflake repair-order rows     | 2,512 |
| Matched keys                    | 2,454 |
| DMS keys missing from Snowflake |   516 |
| Snowflake keys missing from DMS |    58 |
| DMS rows selected from closed   | 2,559 |
| DMS rows selected from open     |   411 |

### Date Logic Is Mostly Fine

On matched keys:

| Signal                           | Count |
| -------------------------------- | ----: |
| Same DMS/Snowflake business date | 2,428 |
| Different business date          |    26 |

So the date rule is not the main problem. Keep close date for closed ROs and
open date for open ROs.

### Current Amount Logic Is Wrong For Customer Pay

Current repair comparison:

- Snowflake: `PAYCPTOTAL`
- DMS: `laborsale + partssale + miscsale`

That is not a fair field match. `PAYCPTOTAL` appears to align much better with
DMS customer-pay fields.

Live score against Snowflake `PAYCPTOTAL` across 2,454 matched keys:

| DMS candidate                                                       | Exact | Within $1 | Diff >= $1 | Average absolute diff |
| ------------------------------------------------------------------- | ----: | --------: | ---------: | --------------------: |
| `laborsale + partssale + miscsale`                                  |   182 |       223 |      2,231 |                777.75 |
| `laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay` | 1,734 |     1,806 |        648 |                 20.92 |
| Customer-pay core + `rosubletsalecp`                                | 1,717 |     1,788 |        666 |                 27.56 |

The best live candidate is the DMS customer-pay core total:

```text
laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay
```

Do not include `shopsuppliessales`; it is not present on the live DMS repair
header table checked by this audit.

## Target Logic

### DMS Repair-Order Grain

Build one DMS row per normalized repair-order key:

```text
cora_acct_code + "|" + RO number
```

Use this priority:

1. select the closed row if the RO exists in `servicesalesclosed`;
2. otherwise select the open row from `servicesalesopen`;
3. carry diagnostic fields showing selected source table and duplicate source
   row count.

This prevents open/closed overlap from inflating changed-value comparisons.

### DMS Repair-Order Amount

Replace the current DMS repair amount:

```text
laborsale + partssale + miscsale
```

with:

```text
laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay
```

Name the normalized field `customer_pay_total` in source SQL and continue
writing it to the existing comparison field `amount_total` until the workbook
contract is expanded.

### Snowflake Repair-Order Amount

Keep Snowflake `PAYCPTOTAL` as the first comparison field.

Carry the following supporting fields in future diagnostics if needed:

- `PAYBALANCEDUE`
- `PAYPAYMENTSMADE`
- `ESTROLINETOTAL`
- `TOTALTAXPRICE`

Do not use those as the primary comparison until business meaning is confirmed.

## Work Packets

### ROL-001 - Repair DMS Normalized Extracts

Goal: make the DMS repair-order normalized extract one row per dealer/RO.

Status: completed

Scope:

- update `sql/sqlserver/dms_repair_order_detail_extract.sql`;
- update `sql/sqlserver/dms_repair_order_daily_summary.sql`;
- use a closed-preferred dedup CTE;
- calculate DMS repair `amount_total` from customer-pay core fields;
- preserve date logic.

Acceptance:

- no duplicate DMS repair business keys in `current/normalized/sqlserver_dms_repair_order_detail.csv`;
- DMS selected source counts are auditable;
- read-only SQL guard still passes;
- no database objects are created.

Completion note:

- Updated `sql/sqlserver/dms_repair_order_detail_extract.sql` to deduplicate
  DMS open/closed repair-order rows with closed rows preferred over open rows.
- Updated `sql/sqlserver/dms_repair_order_daily_summary.sql` to use the same
  DMS repair-order grain.
- Replaced the DMS repair amount comparison basis with customer-pay core:
  `laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay`.
- Updated the runner so repair daily comparison uses the normalized DMS
  `total_amount` field instead of reconstructing total as labor plus parts.
- Live detail run `20260624T212422Z` succeeded.
- Live summary run `20260624T212548Z` succeeded.
- DMS repair detail output now has `2,970` rows, `2,970` unique business keys,
  and `0` duplicate business keys.
- Repair changed-value exceptions dropped from the capped `1,000` written rows
  to `648` total repair changed values, with `651` total changed rows including
  vehicle sales.

### ROL-002 - Rebuild Repair Comparison Outputs

Goal: rerun the daily validation and regenerate workbook outputs using the fixed
repair logic.

Status: completed

Scope:

- run the daily validation command;
- rebuild workbook;
- compare before/after repair-order exception counts;
- document new counts.

Acceptance:

- daily command succeeds;
- workbook status succeeds;
- repair changed-value count drops materially from the current false-positive
  level;
- vehicle-sales counts remain materially unchanged.

Completion note:

- Full daily package run `20260624T212852Z` succeeded after the repair-order
  logic fix.
- Detail status succeeded and workbook status succeeded.
- The standard workbook was locked by Excel, so the hardened daily wrapper
  wrote a timestamped workbook:
  `excel/Snowflake_DMS_Shared_Consumption_Validation_20260624_172851.xlsx`.
- Open exceptions dropped from `1,578` to `1,229`.
- Repair changed records dropped from `2,253` total before repair to `648`
  after repair.
- Written changed rows dropped from the configured cap of `1,000` to `651`.
- Repair missing-key counts remained `516` missing from Snowflake and `58`
  missing from DMS, as expected because `ROL-001` did not change mapping or
  feed coverage.
- Findings were documented in `REPAIR_ORDER_REBUILD_FINDINGS.md`.

### ROL-003 - Repair Logic Readback

Goal: prove the fixed process is now a fairer validation.

Status: completed

Scope:

- rerun the deep repair-order audit after the logic change;
- confirm `customer_pay_total` remains the strongest match to Snowflake
  `PAYCPTOTAL`;
- sample remaining repair changed-value rows;
- classify remaining differences as timing, mapping, field-definition, or
  unexplained.

Acceptance:

- repair amount comparison is no longer dominated by field-definition mismatch;
- remaining missing-key counts are separated from changed-value counts;
- findings are written to a repair-order fix readback document.

Completion note:

- Reran the live deep repair-order audit after the repaired logic.
- Confirmed DMS customer-pay core remains the strongest available match to
  Snowflake `PAYCPTOTAL`.
- Confirmed the repaired DMS extract has `2,970` rows, `2,970` unique business
  keys, and `0` duplicate business keys.
- Classified remaining `648` repair changed values as
  `field_definition_or_fee_component_candidate`.
- Classified `516` DMS-present/Snowflake-missing repair rows as
  `feed_coverage_or_filter_candidate`, heavily concentrated under `SA476-S`.
- Classified `58` Snowflake-present/DMS-missing repair rows as
  `timing_candidate` because all are on `2026-06-24`.
- Wrote findings to `REPAIR_ORDER_READBACK_FINDINGS.md`.

### ROL-004 - Documentation And Reviewer Guidance Update

Goal: update reviewer-facing docs so the dashboard is interpreted correctly.

Status: completed

Scope:

- update `source-mapping.yml`;
- update `VALIDATION_REVIEW_GUIDE.md`;
- update workbook/dashboard notes if needed;
- add a repair-order logic fix findings document.

Acceptance:

- repair-order caveat changes from "amount logic not trusted" to the actual
  remaining caveats;
- reviewer guide explains the closed-preferred DMS grain;
- reviewer guide explains DMS customer-pay core vs Snowflake `PAYCPTOTAL`.

Completion note:

- Updated `config/source-mapping.yml` with the repaired Snowflake and DMS repair
  amount basis, closed-preferred DMS grain, and current exception
  classifications.
- Updated `VALIDATION_REVIEW_GUIDE.md` so reviewers treat repair changed values
  as fee, tax, sublet, rounding, or timing candidates rather than known
  validation defects.
- Updated `README.md` with the repaired repair-order grain and amount basis.
- Updated the workbook builder Sources sheet to show the one-command daily
  process and repaired repair-order basis.
- Generated `excel/Snowflake_DMS_Shared_Consumption_Validation_ROL004.xlsx`
  with the updated workbook notes.
- Wrote packet readout to `REPAIR_ORDER_DOCUMENTATION_FINDINGS.md`.

## Recommendation

Execute `ROL-001` first. It is the key correction. Do not use the current
repair-order changed-value counts for business conclusions until `ROL-001` and
`ROL-002` are complete.

After `ROL-002`, the remaining repair-order missing-key counts may still be
real timing, mapping, or feed-coverage differences. Those should be reviewed
separately from amount differences.

## Superseding Naming Correction

The temporary non-source-native dealership language used during the repair-order
logic work is superseded by `CORA-001`.

Business-facing validation outputs must use the source-native DMS field
`cora_acct_code`, not invented labels such as `SA476 family (dealer name
pending)`.
