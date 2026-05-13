---
name: vw_Sales_Goal_daily_view
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Sales_ProjectionGoal_daily
dependency_count: 1
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Sales_ProjectionGoal_daily** (V )

## Columns

| Name                 | Type    | Nullable | Description |
| -------------------- | ------- | -------- | ----------- |
| `entregion`          | varchar | ✓        |             |
| `entitykey`          | int     | ✓        |             |
| `entdealerlvl1`      | varchar | ✓        |             |
| `entbrand`           | varchar | ✓        |             |
| `calendaryearmonth`  | char    | ✓        |             |
| `datekey`            | int     |          |             |
| `SourceType`         | varchar | ✓        |             |
| `LeadProvider`       | varchar | ✓        |             |
| `Make`               | varchar | ✓        |             |
| `Model`              | varchar | ✓        |             |
| `Zipcode`            | varchar | ✓        |             |
| `newused`            | varchar | ✓        |             |
| `Projection`         | decimal | ✓        |             |
| `Goal`               | decimal | ✓        |             |
| `workingdaysofmonth` | int     | ✓        |             |
| `DailyGoal`          | decimal | ✓        |             |
| `fulldate`           | date    |          |             |

## Definition

```sql
    CREATE VIEW [dbo].[vw_Sales_Goal_daily_view]
    AS
    SELECT * FROM dbo.vw_Sales_ProjectionGoal_daily;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
