---
name: vw_FiscalMonth
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
CREATE VIEW dbo.vw_FiscalMonth
AS
SELECT     MIN(DateKey) AS datekey, CONVERT(INT, REPLACE(FiscalYearMonth, '-', '')) AS FiscalMonth, FiscalYear, FiscalMonth AS FiscalMonthNum, 
                      FiscalQuarter AS FiscalQuarterNum, FiscalYearMonth, MonthName, MonthNameAbbreviation, MonthNumberOfYear
FROM         dbo.vw_Dim_date
GROUP BY CONVERT(int, REPLACE(FiscalYearMonth, '-', '')), FiscalYear, FiscalMonth, FiscalQuarter, FiscalYearMonth, MonthName, MonthNameAbbreviation, 
           
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
