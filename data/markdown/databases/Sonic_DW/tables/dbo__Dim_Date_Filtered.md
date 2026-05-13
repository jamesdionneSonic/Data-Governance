---
name: Dim_Date_Filtered
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
  - Dim_Date
  - Dim_Date
row_count: 0
size_kb: 0
column_count: 45
index_count: 5
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
| `FullDate`                           | date     |          |          |         |             |
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
| `FiscalQuarter`                      | tinyint  |          |          |         |             |
| `FiscalYearMonth`                    | char     |          |          |         |             |
| `FiscalYearQtr`                      | char     |          |          |         |             |
| `QuarterNumber`                      | int      |          |          |         |             |
| `YYYYMMDD`                           | char     |          |          |         |             |
| `MM/DD/YYYY`                         | char     |          |          |         |             |
| `YYYY/MM/DD`                         | char     |          |          |         |             |
| `YYYY-MM-DD`                         | char     |          |          |         |             |
| `MonDDYYYY`                          | char     |          |          |         |             |
| `IsLastDayOfMonth`                   | char     |          |          |         |             |
| `IsWeekday`                          | char     |          |          |         |             |
| `IsSonicWeekday`                     | char     | ✓        |          | ('N')   |             |
| `IsWeekend`                          | char     |          |          |         |             |
| `IsSonicWeekend`                     | char     | ✓        |          | ('N')   |             |
| `IsWorkday`                          | char     |          |          | ('N')   |             |
| `IsFederalHoliday`                   | char     |          |          | ('N')   |             |
| `IsBankHoliday`                      | char     |          |          | ('N')   |             |
| `IsCompanyHoliday`                   | char     |          |          | ('N')   |             |

## Constraints

- **Primary Key**: PK_DimDateFiltered_DateKey
  - Columns: DateKey

## Indexes

- **\_dta_index_Dim_Date_Filtered_10_524580957\_\_K1_K2_K26_K27_K3_K17_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, FullDate ASC, FiscalYear ASC, FiscalMonth ASC, MonthNumberOfYear ASC, MonthName ASC
  - Included Columns: MonthNameAbbreviation
- **\_dta_index_Dim_Date_Filtered_10_524580957\_\_K1_K26_K27_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, FiscalYear ASC, FiscalMonth ASC
  - Included Columns: MonthNameAbbreviation
- **\_dta_index_Dim_Date_Filtered_10_524580957\_\_K1_K26_K27_K2** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: DateKey ASC, FiscalYear ASC, FiscalMonth ASC, FullDate ASC
- **\_dta_index_Dim_Date_Filtered_10_524580957\_\_K26_K27_K1_18** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonth ASC, DateKey ASC
  - Included Columns: MonthNameAbbreviation
- **PK_DimDateFiltered_DateKey** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: DateKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date_Filtered → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isfederalholiday" in both tables
  - Column: `IsFederalHoliday` → `IsFederalHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date_Filtered → dbo.Dim_DateClone
  - Confidence: 80%
  - Evidence: Exact column name match: "isbankholiday" in both tables
  - Column: `IsBankHoliday` → `IsBankHoliday`
- **column_match**: dbo.Dim_Date → dbo.Dim_Date_Filtered
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
