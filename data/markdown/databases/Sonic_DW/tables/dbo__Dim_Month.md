---
name: Dim_Month
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 14
index_count: 4
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

| Name                    | Type     | Nullable | Identity | Default | Description |
| ----------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FiscalYear`            | smallint |          |          |         |             |
| `FiscalMonth`           | tinyint  |          |          |         |             |
| `MonthNameAbbreviation` | char     | ✓        |          |         |             |
| `StartDate`             | datetime | ✓        |          |         |             |
| `EndDate`               | datetime | ✓        |          |         |             |
| `StartDateKey`          | int      | ✓        |          |         |             |
| `EndDateKey`            | int      | ✓        |          |         |             |
| `MonthNumberOfYear`     | tinyint  |          |          |         |             |
| `MonthNumberOfQuarter`  | tinyint  |          |          |         |             |
| `MonthName`             | varchar  |          |          |         |             |
| `CalendarYearMonth`     | char     |          |          |         |             |
| `MonthDesc`             | nvarchar | ✓        |          |         |             |
| `FiscalMonthKey`        | int      |          |          |         |             |
| `CalendarYearQtr`       | char     | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_Dim_Month
  - Columns: FiscalMonthKey

## Indexes

- **IDX_Dim_Month** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: FiscalYear ASC, FiscalMonthKey ASC, StartDateKey ASC
  - Included Columns: MonthDesc, StartDate, EndDate, EndDateKey
- **IDX_EndDate** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: EndDate ASC
  - Included Columns: MonthNumberOfYear, MonthDesc, FiscalMonthKey
- **IDX_StartDateKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: StartDateKey ASC
  - Included Columns: StartDate, MonthDesc, EndDate
- **PK_Dim_Month** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FiscalMonthKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
