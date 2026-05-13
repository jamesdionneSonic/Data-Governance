---
name: vw_SAF_Products
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - dim_FIGLAccounts
  - factFIRE
  - vw_Dim_date
  - vw_Dim_Entity
dependency_count: 4
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.dim_FIGLAccounts** (U )
- **dbo.factFIRE** (U )
- **dbo.vw_Dim_date** (V )
- **dbo.vw_Dim_Entity** (V )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `EntRegion`              | varchar  | ✓        |             |
| `dealno`                 | varchar  | ✓        |             |
| `EntHFMDealershipName`   | varchar  | ✓        |             |
| `FiscalYear`             | smallint |          |             |
| `FiscalMonth`            | int      | ✓        |             |
| `MonthYear`              | varchar  | ✓        |             |
| `FIGLProductCategoryKey` | int      | ✓        |             |
| `FIAccountDesc`          | varchar  | ✓        |             |
| `FIAccount`              | int      |          |             |
| `FIGLProductCategory`    | varchar  | ✓        |             |
| `ProductCount`           | numeric  | ✓        |             |
| `FiscalMonthKey`         | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_SAF_Products
AS
SELECT     a13.EntRegion, a11.dealno, a13.EntHFMDealershipName, a12.FiscalYear, a12.FiscalMonthD AS FiscalMonth,
                      MAX(a12.MonthNameAbbreviation + ' ' + CAST(a12.FiscalYear AS CHAR(4))) AS MonthYear, a14.FIGLProductCategoryKey, a14.FIAccountDesc, a14.FIAccount,
                      MAX(a14.FIGLProductCategory) AS FIGLProductCategory, SUM(a11.statcount) AS ProductCount, a12.FiscalMonthKey
FROM         dbo.factFIRE AS a11 INNER JOIN
                      dbo.vw_Dim_date AS a12 ON a11.AccountingDateKey = a12.DateKey INNER JOIN
                      dbo.vw_Dim_Entity AS a13 ON a11.EntityKey = a13.EntityKey INNER JOIN
                      dbo.dim_FIGLAccounts AS a14 ON a11.FIGLProductKey = a14.FIGLProductKey
WHERE     (a14.FIGLProductCategoryKey NOT IN (- 1, 1, 15, 16, 17)) AND (a11.statcount <> 0) AND (a14.FIAccountType = 's')
GROUP BY a13.EntRegion, a12.FiscalYear, a12.FiscalMonthD, a14.FIAccountDesc, a13.EntHFMDealershipName, a14.FIAccount, a14.FIGLProductCategoryKey, a11.dealno,
                      a12.FiscalMonthKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
