---
name: vw_Dim_date
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql





CREATE VIEW [dbo].[vw_Dim_date]
AS
SELECT        d.DateKey, d.FullDate, d.MonthNumberOfYear, d.MonthNumberOfQuarter, d.ISOYearAndWeekNumber, d.ISOWeekNumberOfYear, 
                         d.SSWeekNumberOfYear, d.ISOWeekNumberOfQuarter_454_Pattern, d.SSWeekNumberOfQuarter_454_Pattern, d.SSWeekNumberOfMonth, d.DayNumberOfYear, 
                         d.DaysSince1900, d.DayNumberOfFiscalYear, d.DayNumberOfQuarter, d.DayNumberOfMonth, d.DayNumberOfWeek_Sun_Start, d.MonthName, 
   
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
