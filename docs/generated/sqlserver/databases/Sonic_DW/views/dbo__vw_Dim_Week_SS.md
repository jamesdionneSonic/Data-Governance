---
name: vw_Dim_Week_SS
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


Create VIEW [dbo].[vw_Dim_Week_SS]
AS
SELECT
      d1.SSYear_Week
    , d1.SSYearAndWeekNumber
    , d_start.WeekStartDate_SS                      AS WeekStartDate_SS   -- Sunday
    , d_end.WeekEndDate_SS                           AS WeekEndDate_SS     -- Saturday

    , 'Week of ' + CONVERT(varchar(10), d_end.WeekEndDate_SS, 101)    AS WeekDesc_SS
    , 'Week of ' + CONVERT(varchar(10), d_start.WeekStartDate_SS, 101) AS WeekStartDesc_SS

    , d1.CalendarYear

    , 'Wk of ' + FORMAT(d_start.WeekStartDate_SS, 'M/d')
              + '-' + FORMAT(d_end.WeekEndDate_SS,   'M/d')     AS WeekDescShort_SS

FROM dbo.vw_Dim_Date AS d1

INNER JOIN
    (

        SELECT  FullDate AS WeekStartDate_SS,
                SSYearAndWeekNumber,SSYear_week
				        FROM dbo.vw_Dim_Date
        WHERE DayNumberOfWeek_Sun_Start = 1      -- Sunday
    ) AS d_start
    ON d1.SSYear_Week = d_start.SSYear_week
INNER JOIN
    (

        SELECT  FullDate AS WeekEndDate_SS,
                SSYearAndWeekNumber,SSYear_week
        FROM dbo.vw_Dim_Date
        WHERE DayNumberOfWeek_Sun_Start = 7      -- Saturday
    ) AS d_end
    ON d1.SSYear_Week = d_end.SSYear_Week
GROUP BY
      d1.ssyear_week
    , d1.SSYearAndWeekNumber
    , d_start.WeekStartDate_SS
    , d_end.WeekEndDate_SS
	, 'Week of ' + CONVERT(varchar(10), d_end.WeekEndDate_SS, 101)
    , 'Week of ' + CONVERT(varchar(10), d_start.WeekStartDate_SS, 101)
	, d1.CalendarYear
	, 'Wk of ' + FORMAT(d_start.WeekStartDate_SS, 'M/d')+ '-' + FORMAT(d_end.WeekEndDate_SS,   'M/d') ;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
