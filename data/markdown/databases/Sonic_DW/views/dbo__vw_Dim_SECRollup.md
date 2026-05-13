---
name: vw_Dim_SECRollup
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_SECRollup
  - Dim_SECRollupSort
dependency_count: 2
column_count: 30
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_SECRollup** (U )
- **dbo.Dim_SECRollupSort** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `SECRollupKey`            | int      |          |             |
| `AccountType`             | varchar  | ✓        |             |
| `SECLevel1`               | varchar  | ✓        |             |
| `SECLevel2`               | varchar  | ✓        |             |
| `SECLevel3`               | varchar  | ✓        |             |
| `SECLevel4`               | varchar  | ✓        |             |
| `SECLevel5`               | varchar  | ✓        |             |
| `SECLevel6`               | varchar  | ✓        |             |
| `SECLevel7`               | varchar  | ✓        |             |
| `SECLevel8`               | varchar  | ✓        |             |
| `SECLevel9`               | varchar  | ✓        |             |
| `SECLevel10`              | varchar  | ✓        |             |
| `SECLevel11`              | varchar  | ✓        |             |
| `SECLevel0`               | varchar  | ✓        |             |
| `SECLevel0_Desc`          | varchar  | ✓        |             |
| `ReportType`              | varchar  | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `User_ID`                 | varchar  | ✓        |             |
| `Meta_LoadDate`           | datetime | ✓        |             |
| `Meta_RowIsCurrent`       | char     | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `Meta_NaturalKey`         | varchar  | ✓        |             |
| `BillingFlag`             | char     | ✓        |             |
| `OneTimeFlag`             | char     | ✓        |             |
| `SECRollUp`               | varchar  | ✓        |             |
| `Budget_Sign`             | int      | ✓        |             |
| `CorporateVarianceRollup` | varchar  | ✓        |             |
| `Actual_Sign`             | int      | ✓        |             |
| `SECRollupSortID`         | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_SECRollup
AS
SELECT        sec.SECRollupKey, sec.AccountType, sec.SECLevel1, sec.SECLevel2, sec.SECLevel3, sec.SECLevel4, sec.SECLevel5, sec.SECLevel6, sec.SECLevel7, sec.SECLevel8, sec.SECLevel9, sec.SECLevel10, sec.SECLevel11,
                         sec.SECLevel0, sec.SECLevel0_Desc, sec.ReportType, sec.ETLExecution_ID, sec.Meta_Src_Sys_ID, sec.User_ID, sec.Meta_LoadDate, sec.Meta_RowIsCurrent, sec.Meta_RowLastChangedDate, sec.Meta_NaturalKey,
                         sec.BillingFlag, sec.OneTimeFlag, sec.SECRollUp, sec.Budget_Sign, sec.CorporateVarianceRollup, sec.Actual_Sign, COALESCE (secsort.secrollupsortid, 99) AS SECRollupSortID
FROM            dbo.Dim_SECRollup AS sec LEFT OUTER JOIN
                         dbo.Dim_SECRollupSort AS secsort ON sec.SECRollUp = secsort.secrollup

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
