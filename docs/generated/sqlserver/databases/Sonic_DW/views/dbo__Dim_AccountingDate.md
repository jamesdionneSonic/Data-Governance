---
name: Dim_AccountingDate
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql
Create view Dim_AccountingDate
as 

SELECT [DateKey] as AccountingDateKey
      ,[FullDate]
      ,[DateName]
      ,[DayOfWeek]
      ,[DayNameOfWeek]
      ,[DayOfMonth]
      ,[DayOfYear]
      ,[WeekdayWeekend]
      ,[WeekOfYear]
      ,[MonthName]
      ,[MonthOfYear]
      ,[IsLastDayOfMonth]
      ,[IsHoliday]
      ,[CalendarQuarter]
      ,[CalendarYear]
      ,[CalendarYearMonth]
      ,[CalendarYearQtr]
      ,[FiscalMonthOfYear]
      ,[FiscalQuarter]
      ,[F
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
