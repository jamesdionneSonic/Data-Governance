# Daily Summary Findings

Dataset: `snowflake-dms-shared-consumption`

Latest live daily-summary run: `20260624T182537Z`

## Outputs

Current Excel-facing summary CSVs:

- `current/summaries/vehicle_sales_daily_compare.csv`
- `current/summaries/repair_order_daily_compare.csv`

Current normalized source extracts:

- `current/normalized/snowflake_vehicle_sales_daily.csv`
- `current/normalized/sqlserver_dms_vehicle_sales_daily.csv`
- `current/normalized/snowflake_repair_order_daily.csv`
- `current/normalized/sqlserver_dms_repair_order_daily.csv`

Historical copies are archived under:

- `runs/20260624T182537Z/`

## Vehicle Sales Summary

The vehicle sales daily comparison is usable for first-pass review.

Run result:

- `61` dealer/day comparison rows.
- `54` rows classified as `matched_summary`.
- `5` rows classified as `difference_review_needed`.
- `2` rows classified as `snowflake_only`.

Comparison basis:

- DMS: `dbo.vehiclesalescurrent`
- Snowflake: `VEHICLE_SALES_RAW`
- Key family: dealer plus deal number
- Daily date: `salesdate` / `SALESDATE`, with contract date fallback for rows
  where sales date is not populated.
- Amount: DMS `cashprice` compared to Snowflake `VEHICLESALEPRICE`.

Rounding note:

- Sub-dollar amount differences are treated as matched summary rows when counts
  match.

## Repair Order Summary

The repair order daily comparison is generated, but it should be treated as a
mapping-validation output before business conclusions are drawn.

Run result:

- `55` dealer/day comparison rows.
- `53` rows classified as `difference_review_needed`.
- `2` rows classified as `snowflake_only`.

Comparison basis:

- DMS: `dbo.servicesalesclosed` and `dbo.servicesalesopen`
- Snowflake: `REPAIR_ORDER_RAW`
- Key family: dealer plus RO number
- Daily date: close date for closed ROs and open date for open ROs.

Current provisional dealer mapping:

- DMS `445` and Snowflake `05179` are grouped as
  `SA466-S`.
- DMS `20246` and Snowflake `R0429` / `S000500622` are grouped as
  `SA476-S`.

This provisional repair-order mapping must be confirmed before treating repair
differences as source-system accuracy findings.

## Next Build Step

`WP-DVL-006` should build bounded detail exception outputs from the summary
differences. Vehicle sales can move first because the daily summary match rate
is strong. Repair orders should keep the dealer-mapping caveat visible until the
code crosswalk is confirmed.
