# Classification Readback Findings

Dataset: `snowflake-dms-shared-consumption`

Run date: 2026-06-25

Daily run id: `20260625T125119Z`

Workbook:
`excel/Snowflake_DMS_Shared_Consumption_Validation_20260625_085118.xlsx`

Follow-up classifier run: `20260625T125747Z`

Follow-up workbook:
`excel/Snowflake_DMS_Shared_Consumption_Validation_CLA001G.xlsx`

## Run Result

The daily operator command succeeded.

- `status`: `succeeded`
- `detail_status`: `succeeded`
- `workbook_status`: `succeeded`
- `error_count`: `0`
- `warning_count`: `1`

The warning came from the main workbook file being locked by Excel during the
overwrite attempt. The workflow still produced the timestamped workbook listed
above and recorded it in `current/audit/daily_operator_status.json`.

## Count Movement

The raw exception queue still has `1194` open exceptions, but the new
classification fields split the old broad buckets into more useful review
groups.

| Raw Signal               | Rows | New Classification Split                                                                                                             |
| ------------------------ | ---: | ------------------------------------------------------------------------------------------------------------------------------------ |
| `changed_value`          |  667 | `665` repair-order `amount_component_gap`; `2` vehicle-sales `material_amount_mismatch_unexplained`                                  |
| `missing_from_snowflake` |  526 | `495` `blank_primary_dealer_with_secondary_match`; `30` `found_in_snowflake_wrong_dealer_context`; `1` `true_missing_from_snowflake` |
| `missing_from_dms`       |    1 | `1` Snowflake-only vehicle-sale row moved to `timing_candidate` in follow-up run `20260625T125747Z`                                  |

## Open Exceptions By Classification

| Classification Group | Review Classification                       | Rows |
| -------------------- | ------------------------------------------- | ---: |
| amount               | `amount_component_gap`                      |  665 |
| mapping              | `blank_primary_dealer_with_secondary_match` |  495 |
| mapping              | `found_in_snowflake_wrong_dealer_context`   |   30 |
| unexplained          | `material_amount_mismatch_unexplained`      |    2 |
| coverage             | `true_missing_from_snowflake`               |    1 |
| timing               | `timing_candidate`                          |    1 |

## Interpretation

The classification model is working: the largest old buckets no longer read as
generic missing or changed data.

The largest repair-order amount population is now an amount-definition review,
not a record-presence problem. These rows should be reviewed against the exact
Snowflake `PAYCPTOTAL` formula and DMS customer-pay component formula.

The largest repair-order missing population is now a dealer/account mapping
review, not a true Snowflake feed gap. These rows should be worked with the
vendor using `DEALERCODE`, `STORENUMBER`, `EIS_STORE_ID`, and
`ACCOUNTINGACCOUNT` evidence.

The remaining true coverage candidate is one repair-order row that was not
found by the broad Snowflake RO search.

The Snowflake-only vehicle-sale row was unclassified in the first readback and
was moved to `timing_candidate` in follow-up run `20260625T125747Z`:

- `exception_id`: `vehicle-sales-missing-from-dms-sa466-s-237319`
- `business_key`: `SA466-S|237319`
- `business_date`: `2026-06-19`
- raw exception: `missing_from_dms`
- review classification: `timing_candidate`

That classification is conservative. It means Snowflake has the row but the
current DMS extract does not, so reviewers should check next-run resolution,
source window, status, and scope before treating it as a DMS or Snowflake
defect.

## Exception History

No exception-history reset occurred in this packet.

- `open_exceptions`: `1194`
- `resolved_since_last_run`: `0`
