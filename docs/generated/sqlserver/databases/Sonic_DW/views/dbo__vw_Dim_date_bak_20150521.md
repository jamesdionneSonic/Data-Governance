---
name: vw_Dim_date_bak_20150521
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

CREATE VIEW [dbo].[vw_Dim_date_bak_20150521]
AS
SELECT        dbo.Dim_Date.DateKey, dbo.Dim_Date.FullDate, dbo.Dim_Date.MonthNumberOfYear, dbo.Dim_Date.MonthNumberOfQuarter,
                         dbo.Dim_Date.ISOYearAndWeekNumber, dbo.Dim_Date.ISOWeekNumberOfYear, dbo.Dim_Date.SSWeekNumberOfYear,
                         dbo.Dim_Date.ISOWeekNumberOfQuarter_454_Pattern, dbo.Dim_Date.SSWeekNumberOfQuarter_454_Pattern, dbo.Dim_Date.SSWeekNumberOfMonth,
                         dbo.Dim_Date.DayNumberOfYear, dbo.Dim_Date.DaysSince1900, dbo.Dim_Date.DayNumberOfFiscalYear, dbo.Dim_Date.DayNumberOfQuarter,
                         dbo.Dim_Date.DayNumberOfMonth, dbo.Dim_Date.DayNumberOfWeek_Sun_Start, dbo.Dim_Date.MonthName, dbo.Dim_Date.MonthNameAbbreviation,
                         dbo.Dim_Date.DayName, dbo.Dim_Date.DayNameAbbreviation, dbo.Dim_Date.CalendarYear, dbo.Dim_Date.CalendarYearMonth, dbo.Dim_Date.CalendarYearQtr,
                         dbo.Dim_Date.CalendarSemester, dbo.Dim_Date.CalendarQuarter, dbo.Dim_Date.FiscalQuarter, dbo.Dim_Date.FiscalYearMonth, dbo.Dim_Date.FiscalYearQtr,
                         dbo.Dim_Date.QuarterNumber, dbo.Dim_Date.YYYYMMDD, dbo.Dim_Date.[MM/DD/YYYY], dbo.Dim_Date.[YYYY/MM/DD], dbo.Dim_Date.[YYYY-MM-DD],
                         dbo.Dim_Date.MonDDYYYY, dbo.Dim_Date.IsLastDayOfMonth, dbo.Dim_Date.IsWeekday, dbo.Dim_Date.IsSonicWeekday, dbo.Dim_Date.IsWeekend,
                         dbo.Dim_Date.IsSonicWeekend, dbo.Dim_Date.IsWorkday, dbo.Dim_Date.IsFederalHoliday, dbo.Dim_Date.IsBankHoliday, dbo.Dim_Date.IsCompanyHoliday,
                         dbo.vw_Dim_Month.StartDate AS Month_StartDate, DATEADD(m, 1, dbo.Dim_Date.FullDate) AS FULLDATE_LM_Join, dbo.Dim_Date.FullDate_LY_Join,
                         CONVERT(varchar(8), DATEADD(m, - 1, dbo.Dim_Date.FullDate), 112) AS DATEKEY_LM, dbo.Dim_Date.DateKey_LY,
                         CASE WHEN IsWeekday = 'Y' THEN 1 ELSE 0 END AS WeekdaySum, CASE WHEN datekey = enddatekey THEN 1 ELSE 0 END AS LastDayFlag,
                         dbo.Dim_Date.FiscalMonthKey, dbo.Dim_Date.SonicVarBusinessDay, dbo.Dim_Date.FixedOpsDayFlag, dbo.Dim_Date.FixedOpsDayMTD,
                         dbo.Dim_Date.FOpsDaysMonth, dbo.Dim_Date.FixedOpsDayMonthKey, dbo.Dim_Date.VariableOpsDayFlag, dbo.Dim_Date.VariableOpsDayMTD,
                         dbo.Dim_Date.VOpsDaysMonth, dbo.Dim_Date.VariableOpsDayMonthKey, dbo.Dim_Date.FiscalYear, CAST(dbo.Dim_Date.FiscalMonth AS INT) AS FiscalMonthD,
                         CAST(dbo.Dim_Date.FiscalMonth AS INT) AS FiscalMonth, dbo.vw_Dim_Month.StartDateKey AS MonthStartDateKey, dbo.Dim_Date.DocRolloverFlag,
                         CAST(CAST(dbo.Dim_Date.DocRolloverDate AS CHAR(8)) AS DATE) AS DocRolloverDate, dbo.vw_Dim_Month.EndDateKey AS MonthEndDateKey
FROM            dbo.Dim_Date INNER JOIN
                         dbo.vw_Dim_Month ON dbo.Dim_Date.FiscalMonthKey = dbo.vw_Dim_Month.FiscalMonthKey
WHERE        (dbo.Dim_Date.DateKey > 20000000) OR
                         (dbo.Dim_Date.DateKey = 19000101)


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
