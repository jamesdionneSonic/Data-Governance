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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
      ,[FiscalYear]
      ,[FiscalYearMonth]
      ,[FiscalYearQtr]
  FROM [Sonic_DW].[dbo].[Dim_Date]

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
