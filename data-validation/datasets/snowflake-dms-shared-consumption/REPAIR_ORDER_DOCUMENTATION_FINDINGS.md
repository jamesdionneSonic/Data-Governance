# Repair Order Documentation Findings

Dataset: `snowflake-dms-shared-consumption`

Repair packet: `ROL-004`

## Result

Reviewer-facing documentation now reflects the repaired repair-order validation
logic.

Updated documents:

- `config/source-mapping.yml`
- `VALIDATION_REVIEW_GUIDE.md`
- `README.md`
- `.codex-spreadsheet-wp8/build_validation_workbook.mjs`
- `REPAIR_ORDER_LOGIC_FIX_PLAN.md`

Generated workbook with updated Sources notes:

```text
data-validation/datasets/snowflake-dms-shared-consumption/excel/Snowflake_DMS_Shared_Consumption_Validation_ROL004.xlsx
```

## What Changed

Source mapping now states:

- Snowflake repair amount field is `PAYCPTOTAL`;
- DMS repair grain is closed-preferred one row per `cora_acct_id + ronumber`;
- DMS repair amount is
  `laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay`;
- remaining repair changed values are field-definition or fee-component
  candidates;
- DMS-present/Snowflake-missing rows are feed coverage or filter candidates;
- Snowflake-present/DMS-missing rows are timing candidates.

Reviewer guide now states:

- repair orders are ready for structured review, not broad source-quality
  conclusions;
- changed values should be reviewed for fee, tax, sublet, rounding, or timing
  components;
- missing-key rows should be reviewed separately from amount differences;
- SA476 DMS-present/Snowflake-missing rows need feed coverage, filter, or dealer
  mapping review;
- Snowflake-only rows from the readback were all on June 24, 2026 and should be
  rechecked on the next refresh.

Workbook Sources sheet now shows:

```text
DMS closed-preferred dealer/RO grain; customer-pay core vs Snowflake PAYCPTOTAL
```

## Current Reviewer Message

The repair-order workbook is no longer showing the old false-positive all-sales
amount mismatch. Remaining repair-order differences are legitimate review
candidates, with the most important follow-up being the `516`
DMS-present/Snowflake-missing records concentrated in SA476.

## Next Recommended Investigation

Create a focused SA476 feed-coverage packet:

- compare Snowflake dealer codes `R0429` and `S000500622` against DMS
  `cora_acct_id = 20246`;
- inspect whether missing ROs are open, closed, status-filtered, or excluded by
  a feed rule;
- verify whether another Snowflake dealer/store code carries the missing SA476
  ROs;
- run the next daily refresh to see whether current-date Snowflake-only rows
  resolve into DMS.
