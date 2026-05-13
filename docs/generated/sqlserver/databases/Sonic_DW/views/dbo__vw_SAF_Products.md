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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
