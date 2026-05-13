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

CREATE VIEW [dbo].[_dta_mv_21] WITH SCHEMABINDING
 AS
SELECT  [dbo].[Dim_Date].[FiscalYear] as _col_1,  [dbo].[Dim_Date].[FiscalMonth] as _col_2,  [dbo].[Dim_Date].[MonthNumberOfYear] as _col_3,  [dbo].[Dim_Date].[MonthNumberOfQuarter] as _col_4,  [dbo].[Dim_Date].[MonthName] as _col_5,  count_big(*) as _col_6 FROM  [dbo].[Dim_Date]   GROUP BY  [dbo].[Dim_Date].[FiscalYear],  [dbo].[Dim_Date].[FiscalMonth],  [dbo].[Dim_Date].[MonthNumberOfYear],  [dbo].[Dim_Date].[MonthNumberOfQuarter],  [dbo].[Dim_Date].[MonthName]


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
