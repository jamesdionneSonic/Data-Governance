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
extracted_at: 2026-05-09T12:34:14.349Z
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
                             (SELECT 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
