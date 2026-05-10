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
extracted_at: 2026-05-09T12:34:14.349Z
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
 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
