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
extracted_at: 2026-05-09T12:34:14.349Z
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

    , d1.CalendarYea
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
