# Detail Exception Findings

Dataset: `snowflake-dms-shared-consumption`

Latest live detail-exception run: `20260624T183406Z`

Row limit: `1000` rows per bounded exception output.

## Outputs

Current Excel-facing exception CSVs:

- `current/exceptions/vehicle_sales_missing_from_snowflake.csv`
- `current/exceptions/vehicle_sales_missing_from_dms.csv`
- `current/exceptions/repair_orders_missing_from_snowflake.csv`
- `current/exceptions/repair_orders_missing_from_dms.csv`
- `current/exceptions/changed_records.csv`

Current normalized local extracts:

- `current/normalized/snowflake_vehicle_sales_detail.csv`
- `current/normalized/sqlserver_dms_vehicle_sales_detail.csv`
- `current/normalized/snowflake_repair_order_detail.csv`
- `current/normalized/sqlserver_dms_repair_order_detail.csv`

Historical copies are archived under:

- `runs/20260624T183406Z/`

## Vehicle Sales

Run result:

- Snowflake detail rows extracted: `824`
- SQL Server DMS detail rows extracted: `822`
- Missing from Snowflake: `0`
- Snowflake only: `2`
- Changed amount records: `2`

Interpretation:

- Vehicle sales remains a strong first validation candidate.
- The exception volume is small enough for manual review in Excel.
- DMS remains the source of record during review.

## Repair Orders

Run result:

- Snowflake detail rows extracted: `2494`
- SQL Server DMS detail rows extracted: `4487`
- Missing from Snowflake: `516`
- Snowflake only: `40`
- Changed amount records found: `2252`
- Changed amount records written: `1000`

Interpretation:

- Repair orders are not ready for business accuracy conclusions yet.
- The changed-record output hit the configured row limit.
- The provisional repair-order dealer mapping and amount semantics need review
  before these are treated as Snowflake quality defects.

## Review Guidance

Use the vehicle sales exception files first. They are compact and likely to show
real timing or small transformation differences.

Use the repair-order exception files as mapping and rule-discovery evidence.
The current repair-order amount comparison uses DMS labor, parts, and misc
against Snowflake customer-pay total, which may not be semantically equivalent.

## Next Build Step

`WP-DVL-007` should add exception history:

- carry open exceptions forward;
- mark resolved exceptions when they disappear;
- preserve first-seen and last-seen run IDs;
- keep the row-limit behavior explicit in audit output.
