---
name: vw_Dim_Month
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
CREATE VIEW dbo.vw_Dim_Month
AS
SELECT        m.FiscalYear, m.FiscalMonth, m.MonthNameAbbreviation, m.StartDate, m.EndDate, m.StartDateKey, m.EndDateKey, m.MonthNumberOfYear, m.MonthNumberOfQuarter, m.MonthName, m.CalendarYearMonth AS MonthID, 
                         m.MonthDesc, m.FiscalMonthKey, d.VOpsDaysMonth, d.FOpsDaysMonth, CAST(CONVERT(Char(4), m.FiscalYear - 1) + RIGHT(m.FiscalMonthKey, 2) AS int) AS FiscalMonthKeyLY, m.CalendarYearQtr, 
                         CAST(LEFT(CONVERT(
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
