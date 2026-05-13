---
name: _dta_mv_21
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
dependency_count: 1
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )

## Columns

| Name     | Type     | Nullable | Description |
| -------- | -------- | -------- | ----------- |
| `_col_1` | smallint |          |             |
| `_col_2` | tinyint  |          |             |
| `_col_3` | tinyint  |          |             |
| `_col_4` | tinyint  |          |             |
| `_col_5` | varchar  |          |             |
| `_col_6` | bigint   | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[_dta_mv_21] WITH SCHEMABINDING
 AS
SELECT  [dbo].[Dim_Date].[FiscalYear] as _col_1,  [dbo].[Dim_Date].[FiscalMonth] as _col_2,  [dbo].[Dim_Date].[MonthNumberOfYear] as _col_3,  [dbo].[Dim_Date].[MonthNumberOfQuarter] as _col_4,  [dbo].[Dim_Date].[MonthName] as _col_5,  count_big(*) as _col_6 FROM  [dbo].[Dim_Date]   GROUP BY  [dbo].[Dim_Date].[FiscalYear],  [dbo].[Dim_Date].[FiscalMonth],  [dbo].[Dim_Date].[MonthNumberOfYear],  [dbo].[Dim_Date].[MonthNumberOfQuarter],  [dbo].[Dim_Date].[MonthName]


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
