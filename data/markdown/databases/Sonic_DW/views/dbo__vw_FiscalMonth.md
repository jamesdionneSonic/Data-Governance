---
name: vw_FiscalMonth
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_date
dependency_count: 1
column_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_date** (V )

## Columns

| Name                    | Type     | Nullable | Description |
| ----------------------- | -------- | -------- | ----------- |
| `datekey`               | int      | ✓        |             |
| `FiscalMonth`           | int      | ✓        |             |
| `FiscalYear`            | smallint |          |             |
| `FiscalMonthNum`        | tinyint  |          |             |
| `FiscalQuarterNum`      | tinyint  |          |             |
| `FiscalYearMonth`       | char     |          |             |
| `MonthName`             | varchar  |          |             |
| `MonthNameAbbreviation` | char     |          |             |
| `MonthNumberOfYear`     | tinyint  |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_FiscalMonth
AS
SELECT     MIN(DateKey) AS datekey, CONVERT(INT, REPLACE(FiscalYearMonth, '-', '')) AS FiscalMonth, FiscalYear, FiscalMonth AS FiscalMonthNum,
                      FiscalQuarter AS FiscalQuarterNum, FiscalYearMonth, MonthName, MonthNameAbbreviation, MonthNumberOfYear
FROM         dbo.vw_Dim_date
GROUP BY CONVERT(int, REPLACE(FiscalYearMonth, '-', '')), FiscalYear, FiscalMonth, FiscalQuarter, FiscalYearMonth, MonthName, MonthNameAbbreviation,
                      MonthNumberOfYear

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
