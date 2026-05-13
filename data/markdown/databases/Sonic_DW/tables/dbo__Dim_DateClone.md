---
name: Dim_DateClone
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_Date
  - Dim_Date_Filtered
  - Dim_Date
  - Dim_Date_Filtered
  - Dim_Date
  - Dim_Date_Filtered
row_count: 0
size_kb: 0
column_count: 73
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                                 | Type     | Nullable | Identity | Default | Description |
| ------------------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `DateKey`                            | int      |          |          |         |             |
| `DateKey_LY`                         | int      | ✓        |          |         |             |
| `FullDate`                           | date     |          |          |         |             |
| `FullDate_LY_Join`                   | date     | ✓        |          |         |             |
| `MonthNumberOfYear`                  | tinyint  |          |          |         |             |
| `MonthNumberOfQuarter`               | tinyint  |          |          |         |             |
| `ISOYearAndWeekNumber`               | char     |          |          |         |             |
| `ISOWeekNumberOfYear`                | tinyint  |          |          |         |             |
| `SSWeekNumberOfYear`                 | tinyint  |          |          |         |             |
| `ISOWeekNumberOfQuarter_454_Pattern` | tinyint  |          |          |         |             |
| `SSWeekNumberOfQuarter_454_Pattern`  | tinyint  |          |          |         |             |
| `SSWeekNumberOfMonth`                | tinyint  |          |          |         |             |
| `DayNumberOfYear`                    | smallint |          |          |         |             |
| `DaysSince1900`                      | int      |          |          |         |             |
| `DayNumberOfFiscalYear`              | smallint |          |          |         |             |
| `DayNumberOfQuarter`                 | smallint |          |          |         |             |
| `DayNumberOfMonth`                   | tinyint  |          |          |         |             |
| `DayNumberOfWeek_Sun_Start`          | tinyint  |          |          |         |             |
| `MonthName`                          | varchar  |          |          |         |             |
| `MonthNameAbbreviation`              | char     |          |          |         |             |
| `DayName`                            | varchar  |          |          |         |             |
| `DayNameAbbreviation`                | char     |          |          |         |             |
| `CalendarYear`                       | smallint |          |          |         |             |
| `CalendarYearMonth`                  | char     |          |          |         |             |
| `CalendarYearQtr`                    | char     |          |          |         |             |
| `CalendarSemester`                   | tinyint  |          |          |         |             |
| `CalendarQuarter`                    | tinyint  |          |          |         |             |
| `FiscalYear`                         | smallint |          |          |         |             |
| `FiscalMonth`                        | tinyint  |          |          |         |             |
| `FiscalMonthKey`                     | int      | ✓        |          |         |             |
| `FiscalQuarter`                      | tinyint  |          |          |         |             |
| `FiscalYearMonth`                    | char     |          |          |         |             |
| `FiscalYearQtr`                      | char     |          |          |         |             |
| `QuarterNumber`                      | int      |          |          |         |             |
| `YYYYMMDD`                           | char     |          |          |         |             |
| `MM/DD/YYYY`                         | char     |          |          |         |             |
| `YYYY/MM/DD`                         | char     |          |          |         |             |
| `YYYY-MM-DD`                         | char     |          |          |         |             |
| `MonDDYYYY`                          | char     |          |          |         |             |
| `SonicVarBusinessDay`                | int      | ✓        |          |         |             |
| `FixedOpsDayFlag`                    | int      | ✓        |          |         |             |
| `FixedOpsDayMTD`                     | int      | ✓        |          |         |             |
| `FOpsDaysMonth`                      | int      | ✓        |          |         |             |
| `FixedOpsDayMonthKey`                | int      | ✓        |          |         |             |
| `VariableOpsDayFlag`                 | int      | ✓        |          |         |             |
| `VariableOpsDayMTD`                  | int      | ✓        |          |         |             |
| `VOpsDaysMonth`                      | int      | ✓        |          |         |             |
| `VariableOpsDayMonthKey`             | int      | ✓        |          |         |             |
| `IsFirstDayOfMonth`                  | char     | ✓        |          |         |             |
| `IsLastDayOfMonth`                   | char     |          |          |         |             |
| `IsWeekday`                          | char     |          |          |         |             |
| `IsSonicWeekday`                     | char     | ✓        |          |         |             |
| `IsWeekend`                          | char     |          |          |         |             |
| `IsSonicWeekend`                     | char     | ✓        |          |         |             |
| `IsWorkday`                          | char     |          |          |         |             |
| `IsFederalHoliday`                   | char     |          |          |         |             |
| `IsBankHoliday`                      | char     |          |          |         |             |
| `IsCompanyHoliday`                   | char     |          |          |         |             |
| `IsCurrentDay`                       | char     | ✓        |          |         |             |
| `IsPreviousDay`                      | char     | ✓        |          |         |             |
| `IsCurrentWeek`                      | char     | ✓        |          |         |             |
| `IsPreviousWeek`                     | char     | ✓        |          |         |             |
| `IsCurrentMonth`                     | char     | ✓        |          |         |             |
| `IsPreviousMonth`                    | char     | ✓        |          |         |             |
| `IsCurrentQuarter`                   | char     | ✓        |          |         |             |
| `IsPreviousQuarter`                  | char     | ✓        |          |         |             |
| `IsCurrentYear`                      | char     | ✓        |          |         |             |
| `IsPreviousYear`                     | char     | ✓        |          |         |             |
| `DocRolloverFlag`                    | int      | ✓        |          |         |             |
| `DocRolloverDate`                    | int      | ✓        |          |         |             |
| `DaysAlignedFullKey`                 | int      | ✓        |          |         |             |
| `DaylightSavingsAdjustment`          | int      | ✓        |          |         |             |
| `DateKeyTMPriorYear`                 | int      | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date_Filtered → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date_Filtered → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "iscompanyholiday" in both tables
  - Column: `IsCompanyHoliday` → `IsCompanyHoliday`
- **column_match**: dbo.Dim_Date_Filtered → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "iscompanyholiday" in both tables
  - Column: `IsCompanyHoliday` → `IsCompanyHoliday`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
