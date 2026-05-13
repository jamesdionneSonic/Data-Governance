---
name: vw_Doc_Budget_Month
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
  - vw_Doc_Budget
dependency_count: 2
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.vw_Doc_Budget** (V )

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `EntityKey`        | int     |          |             |
| `DateKey`          | int     |          |             |
| `DOCMonthKey`      | int     | ✓        |             |
| `GroupElementSort` | int     |          |             |
| `GroupElement`     | varchar | ✓        |             |
| `GroupSubElement`  | varchar | ✓        |             |
| `Amount`           | numeric | ✓        |             |
| `StatCount`        | money   | ✓        |             |
| `MetricTypeKey`    | int     |          |             |
| `DocTableID`       | varchar |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Doc_Budget_Month] AS
SELECT        b.EntityKey, d.DateKey, b.DOCMonthKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey, CONCAT(b.MetricTypeKey, d.DateKey, b.GroupElementSort, b.EntityKey) AS DocTableID
FROM            dbo.vw_Doc_Budget AS b INNER JOIN
                         dbo.Dim_Date AS d ON b.DOCMonthKey = d.FiscalMonthKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
