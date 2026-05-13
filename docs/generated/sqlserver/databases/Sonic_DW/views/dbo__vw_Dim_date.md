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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         d.MonthNameAbbreviation, d.DayName, d.DayNameAbbreviation, d.CalendarYear, d.CalendarYearMonth, d.CalendarYearQtr,
                         d.CalendarSemester, d.CalendarQuarter, d.FiscalQuarter, d.FiscalYearMonth, d.FiscalYearQtr, d.QuarterNumber, d.YYYYMMDD,
                         d.[MM/DD/YYYY], d.[YYYY/MM/DD], d.[YYYY-MM-DD], d.MonDDYYYY, d.IsLastDayOfMonth, d.IsWeekday, d.IsSonicWeekday,
                         d.IsWeekend, d.IsSonicWeekend, d.IsWorkday, d.IsFederalHoliday, d.IsBankHoliday, d.IsCompanyHoliday,
                         dbo.vw_Dim_Month.StartDate AS Month_StartDate, DATEADD(m, 1, d.FullDate) AS FULLDATE_LM_Join, d.FullDate_LY_Join, CONVERT(varchar(8), DATEADD(m, - 1, d.FullDate), 112)
                         AS DATEKEY_LM, d.DateKey_LY, CASE WHEN d.IsWeekday = 'Y' THEN 1 ELSE 0 END AS WeekdaySum, CASE WHEN d.datekey = enddatekey THEN 1 ELSE 0 END AS LastDayFlag,
                         d.FiscalMonthKey, d.SonicVarBusinessDay, d.FixedOpsDayFlag, d.FixedOpsDayMTD, d.FOpsDaysMonth, d.FixedOpsDayMonthKey,
                         d.VariableOpsDayFlag, d.VariableOpsDayMTD, d.VOpsDaysMonth, d.VariableOpsDayMonthKey, d.FiscalYear, CAST(d.FiscalMonth AS INT)
                         AS FiscalMonthD, CAST(d.FiscalMonth AS INT) AS FiscalMonth, dbo.vw_Dim_Month.StartDateKey AS MonthStartDateKey, d.DocRolloverFlag, CAST(CAST(d.DocRolloverDate AS CHAR(8))
                         AS DATE) AS DocRolloverDate, dbo.vw_Dim_Month.EndDateKey AS MonthEndDateKey, FLOOR((DATEDIFF(d, CONVERT(date, CAST(d.DocRolloverDate AS varchar(8))), d.FullDate) / 7.0 + 1.00001)
                         + ((w.DayNumberOfWeek_Sun_Start - 1.0) / 7.0 + (w.SSWeekNumberOfMonth - 1.0))) AS DocWeekNum, CAST(d.FiscalYear AS Char(4)) + ' Q' + CAST(d.CalendarQuarter AS Char(1)) AS QuarterDesc,
                         dbo.Dim_DaysAligned.DaysAlignedKey, d.DaysAlignedFullKey, d.DaylightSavingsAdjustment, d.DateKeyTMPriorYear, d2.FullDate AS FullDateTMPriorYear,
                         d3.FixedOpsDayFlag AS FixedOpsDayFlagLY, d3.VariableOpsDayFlag AS VariableOpsDayFlagLY, CAST(CASE WHEN d.MonthNumberOfYear = 12 AND d.SSWeekNumberOfYear = 1 THEN YEAR(d.FullDate) + 1 ELSE YEAR(d.FullDate) END AS Char(4)) + ' Week ' + RIGHT(d.SSWeekNumberOfYear, 2) AS SSYearAndWeekNumber,
                         1 AS DayCounter, dp.PowersportsDayFlag, dp.PowersportsDayMTD, dp.PowersportsDaysMonth,
                         dp.PowersportsDayMonthKey, CAST(CONCAT(CASE WHEN d.MonthNumberOfYear = 12 AND d.SSWeekNumberOfYear = 1 THEN YEAR(d.FullDate) + 1 ELSE YEAR(d.FullDate) END, RIGHT('00' + CAST(d.SSWeekNumberOfYear AS VarChar(2)), 2)) AS INT) AS SSYear_Week
FROM            dbo.Dim_Date d LEFT OUTER JOIN
                          dbo.Dim_Date_Powersports AS dp ON d.DateKey =  dp.DateKey LEFT OUTER JOIN
                         dbo.vw_Dim_Month ON d.FiscalMonthKey = dbo.vw_Dim_Month.FiscalMonthKey LEFT OUTER JOIN
                         dbo.Dim_Date AS d3 ON d.DateKey_LY = d3.DateKey LEFT OUTER JOIN
                         dbo.Dim_Date AS d2 ON d.DateKeyTMPriorYear = d2.DateKey LEFT OUTER JOIN
                         dbo.Dim_DaysAligned ON d.DaysAlignedFullKey = dbo.Dim_DaysAligned.DaysAlignedFullKey LEFT OUTER JOIN
                         dbo.Dim_Date AS w ON d.DocRolloverDate = w.DateKey
WHERE        (d.DateKey >= 19680101) OR
                         (d.DateKey = 19000101)



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
