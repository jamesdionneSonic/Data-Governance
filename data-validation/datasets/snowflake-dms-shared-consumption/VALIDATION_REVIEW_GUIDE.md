# Validation Review Guide

Dataset: `snowflake-dms-shared-consumption`

## Review Position

SQL Server DMS is the source of record for this validation cycle. Snowflake is
the candidate replacement or acceleration source. A difference is not
automatically an error. The goal is to classify differences as timing,
filtering, transformation, mapping, or unexplained so the team can decide
whether Snowflake is more current, equivalent, or missing required business
logic.

Do not edit Snowflake, SQL Server, or source-system data during review. The
validation workflow is read-only and writes only local CSV, workbook, and run
audit files.

The review model separates the raw scoped comparison result from the
review-facing classification:

- `exception_type` is the deterministic result of the current comparison, such
  as a scoped missing row or changed value;
- `raw_exception_type` preserves that same audit signal as the output contract
  evolves;
- `review_classification` explains what the evidence means for vendor or
  business review;
- `classification_group` rolls classifications into dashboard buckets;
- `classification_reason` gives the short evidence trail.

## Primary Review Files

Start with:

- `excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx`
- `current/audit/daily_operator_status.json`
- `current/summaries/vehicle_sales_daily_compare.csv`
- `current/summaries/repair_order_daily_compare.csv`
- `current/exceptions/open_exceptions.csv`
- `current/exceptions/resolved_since_last_run.csv`

Use the subject-specific exception files when a dashboard row needs detail:

- `current/exceptions/vehicle_sales_missing_from_snowflake.csv`
- `current/exceptions/vehicle_sales_missing_from_dms.csv`
- `current/exceptions/repair_orders_missing_from_snowflake.csv`
- `current/exceptions/repair_orders_missing_from_dms.csv`
- `current/exceptions/changed_records.csv`

## Daily Review Order

1. Confirm `daily_operator_status.json` shows `status`, `detail_status`, and
   `workbook_status` as `succeeded`.
2. Open the workbook and review `Dashboard`.
3. Review vehicle sales first. Vehicle sales currently has the strongest match
   quality and the smallest exception volume.
4. Review `resolved_since_last_run.csv` to see whether prior missing data
   appeared in the newest refresh.
5. Review `open_exceptions.csv` for still-open records and increasing
   `days_open`.
6. Review repair-order results using the repaired grain and amount rules. Treat
   missing-key differences separately from changed-value differences.

## Classification Guide

Use these review classifications in notes, issue titles, and follow-up work.
The source list lives in `config/review-classification-taxonomy.yml`.

| Group       | Classification                              | Use When                                                                                             | First Check                                                                                                     |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| coverage    | `true_missing_from_snowflake`               | DMS has the record and a broad Snowflake search cannot find it.                                      | Confirm business key, date window, and broad Snowflake search.                                                  |
| coverage    | `true_snowflake_only`                       | Snowflake has the record and DMS cannot find it anywhere in scope.                                   | Check whether Snowflake is fresher or DMS source window is lagging.                                             |
| timing      | `timing_candidate`                          | The difference may resolve after a later refresh or source restatement.                              | Compare source update timestamps and whether the exception resolves on the next run.                            |
| coverage    | `outside_validation_scope`                  | The record exists but should not be in this comparison population.                                   | Check status, date, dealer/account, and lifecycle inclusion rules.                                              |
| mapping     | `found_in_snowflake_wrong_dealer_context`   | The record exists in Snowflake but not under the expected dealer/store/account context.              | Compare DMS `cora_acct_code` to Snowflake `DEALERCODE`, `STORENUMBER`, `EIS_STORE_ID`, and `ACCOUNTINGACCOUNT`. |
| mapping     | `blank_primary_dealer_with_secondary_match` | Snowflake primary dealer field is blank, but secondary fields point to the expected account context. | Check `DEALERCODE` against `EIS_STORE_ID` and `ACCOUNTINGACCOUNT`.                                              |
| mapping     | `ambiguous_dealer_context`                  | The same business record appears under multiple possible dealer/store/account values.                | Inspect all broad-source matches before choosing a mapping rule.                                                |
| mapping     | `mapping_rule_gap`                          | Repeated evidence shows the validation needs a deterministic mapping rule.                           | Confirm the pattern repeats enough to be a rule, not a one-off exception.                                       |
| key_grain   | `business_key_format_mismatch`              | Same record appears to exist but key formatting differs.                                             | Check leading zeros, suffixes, prefixes, casing, trimming, and punctuation.                                     |
| key_grain   | `duplicate_source_record`                   | One source has multiple rows for the same business key.                                              | Identify whether duplicates are true duplicates, lifecycle rows, or detail grain.                               |
| key_grain   | `grain_mismatch`                            | One side is header-level and the other is detail/event/transaction-level.                            | Confirm comparison grain before judging counts or amounts.                                                      |
| date_status | `business_date_mismatch`                    | Same record exists but the selected business date differs.                                           | Compare open, close, sale, contract, post, and update dates.                                                    |
| date_status | `status_lifecycle_mismatch`                 | Same record exists but status/lifecycle state differs.                                               | Compare open, closed, posted, voided, reversed, cancelled, or pending states.                                   |
| timing      | `late_update_or_restatement`                | Same record exists but one side has a later update timestamp or restated value.                      | Compare latest update/load timestamps and prior-run history.                                                    |
| amount      | `amount_match`                              | Business key matches and material amount is within tolerance.                                        | Confirm tolerance and source amount field definitions.                                                          |
| amount      | `amount_rounding_difference`                | Amount difference is below agreed tolerance.                                                         | Confirm decimal precision and rounding rules.                                                                   |
| amount      | `amount_component_gap`                      | Amount differs because one side includes or excludes components.                                     | Compare tax, fees, shop supplies, sublet, discounts, warranty, customer-pay, and internal-pay components.       |
| amount      | `amount_sign_or_credit_mismatch`            | Same amount family exists, but sign or credit/debit treatment differs.                               | Check reversals, credits, adjustments, and negative values.                                                     |
| amount      | `amount_null_vs_zero_mismatch`              | One source treats absence as null while the other treats it as zero.                                 | Compare null, blank, zero, and missing-field behavior.                                                          |
| unexplained | `material_amount_mismatch_unexplained`      | Amount differs beyond tolerance and no cause has been confirmed.                                     | Rule out timing, component, status, sign, and null-vs-zero issues.                                              |

## Timing Differences

Timing differences are expected in this test because Snowflake is expected to
refresh more often. Treat missing records as timing candidates first when:

- the business date is recent;
- the latest update timestamp differs across sources;
- the exception appears in `open_exceptions.csv` for the first time;
- the same exception resolves in `resolved_since_last_run.csv` after a later
  run.

Do not mark a timing candidate as a source gap until it remains open beyond the
agreed review window for that subject area. If no review window has been agreed
yet, keep the note as `timing_candidate` and escalate the policy decision.

## Missing Records

`missing_from_snowflake` means the record is present in DMS and absent from the
current scoped Snowflake detail extract.

That does not automatically mean Snowflake is missing the business event. A
broader search may find the record in Snowflake under another dealer, store, or
account context. In that case the raw exception can stay
`missing_from_snowflake`, but the review classification should move to a
mapping classification such as `found_in_snowflake_wrong_dealer_context` or
`blank_primary_dealer_with_secondary_match`.

`missing_from_dms` means the record is present in Snowflake and absent from the
current DMS detail extract. During this test, that can be a useful signal that
Snowflake is fresher, but it is still not proof that DMS is wrong until timing,
filtering, and key mapping are checked.

For each missing record, capture:

- subject area;
- `cora_acct_code`;
- business date;
- business key;
- exception type;
- raw exception type;
- review classification;
- classification group;
- classification reason;
- first seen run;
- last seen run;
- current status;
- likely classification.

## Changed Values

Changed values mean the business key matched but one or more material values
differed. The current changed-value output is bounded by the configured row
limit, so absence from the file does not prove no changed values exist outside
the cap.

For vehicle sales, amount comparison is the strongest current changed-value
check. Confirm whether amount differences are true business differences,
rounding, missing contract/sale-date context, or field-selection differences.

For repair orders, changed amount records now compare DMS customer-pay core to
Snowflake customer-pay total. Remaining changed values are review candidates
for fee, tax, sublet, rounding, or timing components. They are no longer the
known all-sale-vs-customer-pay false positive from the first build.

The active amount exception threshold is one dollar absolute difference. It is
documented in `config/accuracy-thresholds.yml`. Repair-order changed-value
rows at or above that threshold are classified as `amount_component_gap` until
the fee/tax/sublet/shop-supply/discount component formula is confirmed.
Vehicle-sales amount differences stay `material_amount_mismatch_unexplained`
unless a specific rounding, sign, null-vs-zero, timing, or component rule is
proven.

## Vehicle Sales Notes

Vehicle sales is the best first-pass validation subject.

Current comparison basis:

- DMS table: `dbo.vehiclesalescurrent`
- Snowflake table: `VEHICLE_SALES_RAW`
- business key: `cora_acct_code` plus deal number
- daily date: sales date with contract date fallback
- material amount: DMS `cashprice` compared to Snowflake
  `VEHICLESALEPRICE`

Review vehicle exceptions as likely business-valid candidates unless a specific
date, amount, status, or key caveat explains the difference.

## Repair Order Notes

Repair orders are ready for structured review, but not for broad source-quality
conclusions without follow-up on the remaining exception classes.

Current comparison basis:

- DMS tables: `dbo.servicesalesclosed` and `dbo.servicesalesopen`
- Snowflake table: `REPAIR_ORDER_RAW`
- business key: `cora_acct_code` plus RO number
- daily date: close date for closed ROs and open date for open ROs
- DMS grain: one row per `cora_acct_code` plus RO number, preferring the closed
  row when the same RO appears in both open and closed DMS tables
- DMS amount: `laborsalecustomerpay + partssalecustomerpay +
miscsalecustomerpay`
- Snowflake amount: `PAYCPTOTAL`

Current caveats:

- source dealer fields are mapped to DMS `cora_acct_code` for validation;
- current outputs show `cora_acct_code`, not invented dealer-family labels;
- service detail and appointment tables are supporting context, not the current
  RO-level base;
- remaining changed values may be fee, tax, sublet, rounding, or timing
  component differences;
- DMS-present/Snowflake-missing repair rows have been concentrated under
  `SA476-S` and should be reviewed as feed coverage, filter, or dealer mapping
  candidates;
- Snowflake-present/DMS-missing repair rows from the repaired readback were all
  on June 24, 2026 and should be treated as timing candidates until the next
  refresh proves otherwise.

Treat repair-order changed values as legitimate review candidates, not known
validation logic defects. Treat missing-key rows separately because they point
to timing, feed coverage, filter, or mapping behavior rather than amount logic.

## Escalation Packet

When an exception needs follow-up, include this minimum packet:

- dataset id: `snowflake-dms-shared-consumption`;
- run id from `daily_operator_status.json`;
- subject area;
- `cora_acct_code`;
- business date;
- business key;
- exception type;
- raw exception type;
- review classification;
- classification group;
- classification reason;
- source values being compared;
- whether it is new, still open, or resolved;
- workbook tab or CSV file where it was found.

Escalate immediately when:

- the daily command fails;
- `error_count` is greater than `0`;
- a vehicle-sales source gap remains open beyond the agreed timing window;
- repair-order review proves the dealer crosswalk or amount semantics are wrong;
- exception counts change sharply without a known refresh, date-window, or
  source-system explanation.

## Completion Criteria

A reviewed exception is complete when it has a documented classification,
supporting note, and next action. The normal next actions are:

- wait for next refresh;
- confirm filter rule;
- confirm field transformation;
- confirm dealer or key mapping;
- open data-quality investigation;
- close as expected behavior.
