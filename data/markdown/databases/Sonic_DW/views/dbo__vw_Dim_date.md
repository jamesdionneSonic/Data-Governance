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
depends_on:
  - Dim_Date
  - Dim_Date_Powersports
  - Dim_DaysAligned
  - vw_Dim_Month
dependency_count: 4
column_count: 83
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Date_Powersports** (U )
- **dbo.Dim_DaysAligned** (U )
- **dbo.vw_Dim_Month** (V )

## Columns

| Name                                 | Type     | Nullable | Description |
| ------------------------------------ | -------- | -------- | ----------- |
| `DateKey`                            | int      |          |             |
| `FullDate`                           | date     |          |             |
| `MonthNumberOfYear`                  | tinyint  |          |             |
| `MonthNumberOfQuarter`               | tinyint  |          |             |
| `ISOYearAndWeekNumber`               | char     |          |             |
| `ISOWeekNumberOfYear`                | tinyint  |          |             |
| `SSWeekNumberOfYear`                 | tinyint  |          |             |
| `ISOWeekNumberOfQuarter_454_Pattern` | tinyint  |          |             |
| `SSWeekNumberOfQuarter_454_Pattern`  | tinyint  |          |             |
| `SSWeekNumberOfMonth`                | tinyint  |          |             |
| `DayNumberOfYear`                    | smallint |          |             |
| `DaysSince1900`                      | int      |          |             |
| `DayNumberOfFiscalYear`              | smallint |          |             |
| `DayNumberOfQuarter`                 | smallint |          |             |
| `DayNumberOfMonth`                   | tinyint  |          |             |
| `DayNumberOfWeek_Sun_Start`          | tinyint  |          |             |
| `MonthName`                          | varchar  |          |             |
| `MonthNameAbbreviation`              | char     |          |             |
| `DayName`                            | varchar  |          |             |
| `DayNameAbbreviation`                | char     |          |             |
| `CalendarYear`                       | smallint |          |             |
| `CalendarYearMonth`                  | char     |          |             |
| `CalendarYearQtr`                    | char     |          |             |
| `CalendarSemester`                   | tinyint  |          |             |
| `CalendarQuarter`                    | tinyint  |          |             |
| `FiscalQuarter`                      | tinyint  |          |             |
| `FiscalYearMonth`                    | char     |          |             |
| `FiscalYearQtr`                      | char     |          |             |
| `QuarterNumber`                      | int      |          |             |
| `YYYYMMDD`                           | char     |          |             |
| `MM/DD/YYYY`                         | char     |          |             |
| `YYYY/MM/DD`                         | char     |          |             |
| `YYYY-MM-DD`                         | char     |          |             |
| `MonDDYYYY`                          | char     |          |             |
| `IsLastDayOfMonth`                   | char     |          |             |
| `IsWeekday`                          | char     |          |             |
| `IsSonicWeekday`                     | char     | ✓        |             |
| `IsWeekend`                          | char     |          |             |
| `IsSonicWeekend`                     | char     | ✓        |             |
| `IsWorkday`                          | char     |          |             |
| `IsFederalHoliday`                   | char     |          |             |
| `IsBankHoliday`                      | char     |          |             |
| `IsCompanyHoliday`                   | char     |          |             |
| `Month_StartDate`                    | datetime | ✓        |             |
| `FULLDATE_LM_Join`                   | date     | ✓        |             |
| `FullDate_LY_Join`                   | date     | ✓        |             |
| `DATEKEY_LM`                         | varchar  | ✓        |             |
| `DateKey_LY`                         | int      | ✓        |             |
| `WeekdaySum`                         | int      |          |             |
| `LastDayFlag`                        | int      |          |             |
| `FiscalMonthKey`                     | int      | ✓        |             |
| `SonicVarBusinessDay`                | int      | ✓        |             |
| `FixedOpsDayFlag`                    | int      | ✓        |             |
| `FixedOpsDayMTD`                     | int      | ✓        |             |
| `FOpsDaysMonth`                      | int      | ✓        |             |
| `FixedOpsDayMonthKey`                | int      | ✓        |             |
| `VariableOpsDayFlag`                 | int      | ✓        |             |
| `VariableOpsDayMTD`                  | int      | ✓        |             |
| `VOpsDaysMonth`                      | int      | ✓        |             |
| `VariableOpsDayMonthKey`             | int      | ✓        |             |
| `FiscalYear`                         | smallint |          |             |
| `FiscalMonthD`                       | int      | ✓        |             |
| `FiscalMonth`                        | int      | ✓        |             |
| `MonthStartDateKey`                  | int      | ✓        |             |
| `DocRolloverFlag`                    | int      | ✓        |             |
| `DocRolloverDate`                    | date     | ✓        |             |
| `MonthEndDateKey`                    | int      | ✓        |             |
| `DocWeekNum`                         | numeric  | ✓        |             |
| `QuarterDesc`                        | varchar  | ✓        |             |
| `DaysAlignedKey`                     | smallint | ✓        |             |
| `DaysAlignedFullKey`                 | int      | ✓        |             |
| `DaylightSavingsAdjustment`          | int      | ✓        |             |
| `DateKeyTMPriorYear`                 | int      | ✓        |             |
| `FullDateTMPriorYear`                | date     | ✓        |             |
| `FixedOpsDayFlagLY`                  | int      | ✓        |             |
| `VariableOpsDayFlagLY`               | int      | ✓        |             |
| `SSYearAndWeekNumber`                | varchar  | ✓        |             |
| `DayCounter`                         | int      |          |             |
| `PowersportsDayFlag`                 | int      | ✓        |             |
| `PowersportsDayMTD`                  | int      | ✓        |             |
| `PowersportsDaysMonth`               | int      | ✓        |             |
| `PowersportsDayMonthKey`             | int      | ✓        |             |
| `SSYear_Week`                        | int      | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
