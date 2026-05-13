---
name: vw_Dim_Week
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
CREATE VIEW dbo.vw_Dim_Week
AS
SELECT        d1.ISOYearAndWeekNumber, d_start.WeekStartDate, d_end.WeekEndDate, 'Week of ' + CONVERT(varchar(10), d_end.WeekEndDate, 101) AS WeekDesc, 'Week of ' + CONVERT(varchar(10), d_start.WeekStartDate, 101)
                         AS WeekStartDesc, d1.CalendarYear, 'Wk of ' + FORMAT(d_start.WeekStartDate, 'M/d') + '-' + FORMAT(d_end.WeekEndDate, 'M/d') AS WeekDescShort
FROM            dbo.Dim_Date AS d1 INNER JOIN
                             (SELECT        FullDate AS WeekStartDate, ISOYearAndWeekNumber
                               FROM            dbo.Dim_Date
                               WHERE        (DayNumberOfWeek_Sun_Start = 2)) AS d_start ON d1.ISOYearAndWeekNumber = d_start.ISOYearAndWeekNumber INNER JOIN
                             (SELECT        FullDate AS WeekEndDate, ISOYearAndWeekNumber
                               FROM            dbo.Dim_Date AS Dim_Date_1
                               WHERE        (DayNumberOfWeek_Sun_Start = 1)) AS d_end ON d1.ISOYearAndWeekNumber = d_end.ISOYearAndWeekNumber
GROUP BY d1.ISOYearAndWeekNumber, d_start.WeekStartDate, d_end.WeekEndDate, d1.CalendarYear, 'Week of ' + CONVERT(varchar(10), d_end.WeekEndDate, 101), 'Wk of ' + FORMAT(d_start.WeekStartDate, 'M/d')
                         + '-' + FORMAT(d_end.WeekEndDate, 'M/d'), 'Week of ' + CONVERT(varchar(10), d_start.WeekStartDate, 101)

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
