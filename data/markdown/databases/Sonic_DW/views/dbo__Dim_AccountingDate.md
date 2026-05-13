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
depends_on: []
dependency_count: 0
column_count: 22
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                | Type     | Nullable | Description |
| ------------------- | -------- | -------- | ----------- |
| `AccountingDateKey` | int      |          |             |
| `FullDate`          | datetime | ✓        |             |
| `DateName`          | char     | ✓        |             |
| `DayOfWeek`         | tinyint  | ✓        |             |
| `DayNameOfWeek`     | char     | ✓        |             |
| `DayOfMonth`        | tinyint  | ✓        |             |
| `DayOfYear`         | smallint | ✓        |             |
| `WeekdayWeekend`    | char     | ✓        |             |
| `WeekOfYear`        | tinyint  | ✓        |             |
| `MonthName`         | char     | ✓        |             |
| `MonthOfYear`       | tinyint  | ✓        |             |
| `IsLastDayOfMonth`  | char     | ✓        |             |
| `IsHoliday`         | char     | ✓        |             |
| `CalendarQuarter`   | tinyint  | ✓        |             |
| `CalendarYear`      | smallint | ✓        |             |
| `CalendarYearMonth` | char     | ✓        |             |
| `CalendarYearQtr`   | char     | ✓        |             |
| `FiscalMonthOfYear` | tinyint  | ✓        |             |
| `FiscalQuarter`     | tinyint  | ✓        |             |
| `FiscalYear`        | int      | ✓        |             |
| `FiscalYearMonth`   | char     | ✓        |             |
| `FiscalYearQtr`     | char     | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
