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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         CAST(LEFT(CONVERT(varchar, DATEADD(month, 1, DATEADD(day, 7, m.StartDate)), 112), 6) AS int) AS FiscalMonthKeyPlusOne, CAST(LEFT(CONVERT(varchar, DATEADD(month, - 1, DATEADD(day, 7, m.StartDate)), 112), 6) AS int)
                         AS FiscalMonthKeyLM, DAY(EOMONTH(m.StartDate)) AS DaysInMonth, DATEDIFF(MONTH, DATEADD(MONTH, DATEDIFF(MONTH, 0, m.StartDate), 0), GETDATE()) AS MonthsPrior, CASE WHEN DATEDIFF(MONTH,
                         DATEADD(MONTH, DATEDIFF(MONTH, 0, StartDate), 0), GETDATE()) > 0 THEN 1 ELSE 0 END AS FullMonthsFlag, CONVERT(DATE, DATEADD(mm, DATEDIFF(mm, 0, CONVERT(date, GETDATE())), 0)) AS CurrentMonthStartDate
FROM            dbo.Dim_Month AS m LEFT OUTER JOIN
                             (SELECT        FiscalMonthKey, MAX(VOpsDaysMonth) AS VOpsDaysMonth, MAX(FOpsDaysMonth) AS FOpsDaysMonth
                               FROM            dbo.Dim_Date
                               GROUP BY FiscalMonthKey) AS d ON m.FiscalMonthKey = d.FiscalMonthKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
