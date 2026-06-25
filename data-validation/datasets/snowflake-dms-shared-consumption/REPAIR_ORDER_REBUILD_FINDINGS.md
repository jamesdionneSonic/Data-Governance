# Repair Order Rebuild Findings

Dataset: `snowflake-dms-shared-consumption`

Repair packet: `ROL-002`

## Run Result

Full daily validation package rerun after the `ROL-001` repair-order logic fix:

- run id: `20260624T212852Z`
- status: `succeeded`
- detail status: `succeeded`
- workbook status: `succeeded`
- warning count: `1`

The warning was expected for this run: the standard workbook was open in Excel
and Windows locked the file. The daily wrapper fell back to a timestamped
workbook path.

Workbook produced:

```text
data-validation/datasets/snowflake-dms-shared-consumption/excel/Snowflake_DMS_Shared_Consumption_Validation_20260624_172851.xlsx
```

## Before And After

Baseline before repair-order logic fix:

- run id: `20260624T200801Z`
- open exceptions: `1,578`
- changed records written: `1,000`
- repair-order changed records total: `2,253`
- repair orders missing from Snowflake: `516`
- repair orders missing from DMS: `58`
- vehicle-sales changed records total: `2`
- vehicle sales missing from Snowflake: `0`
- vehicle sales missing from DMS: `2`

After `ROL-001` and `ROL-002`:

- run id: `20260624T212852Z`
- open exceptions: `1,229`
- changed records written: `651`
- repair-order changed records total: `648`
- repair orders missing from Snowflake: `516`
- repair orders missing from DMS: `58`
- vehicle-sales changed records total: `3`
- vehicle sales missing from Snowflake: `0`
- vehicle sales missing from DMS: `4`

## Interpretation

The repair-order amount fix materially reduced false-positive changed-value
noise:

- repair changed records dropped from `2,253` total to `648`;
- written changed rows dropped from the configured cap of `1,000` to `651`;
- open exceptions dropped from `1,578` to `1,229`.

The missing-key counts did not change:

- DMS present / Snowflake missing: `516`;
- Snowflake present / DMS missing: `58`.

That is expected. `ROL-001` fixed grain and amount comparison. It did not alter
dealer mapping, date-window membership, or source feed coverage.

Vehicle sales stayed materially stable. The small count movement appears to be
from live source refresh timing rather than the repair-order logic change.

## Current Dashboard Signals

Daily summary after repair:

| Subject       | Rows | Matched | Review needed | Snowflake only | Missing from Snowflake |
| ------------- | ---: | ------: | ------------: | -------------: | ---------------------: |
| Vehicle Sales |   61 |      54 |             5 |              2 |                      0 |
| Repair Orders |   55 |       2 |            51 |              2 |                      0 |

Exception queue after repair:

| Signal                    | Count |
| ------------------------- | ----: |
| Open exceptions           | 1,229 |
| Changed records           |   651 |
| Vehicle only Snowflake    |     4 |
| Vehicle missing Snowflake |     0 |
| Repair only Snowflake     |    58 |
| Repair missing Snowflake  |   516 |

## Next Step

Execute `ROL-003`: rerun the deep repair-order readback against the repaired
logic and classify the remaining repair differences. The next question is no
longer "is the amount comparison obviously wrong?" It is now "what explains the
remaining `648` changed values and `574` missing-key differences?"
