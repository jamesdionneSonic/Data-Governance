---
name: vw_Fact_Merchandising
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Fact_Merchandising
dependency_count: 1
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_Merchandising** (U )

## Columns

| Name           | Type | Nullable | Description |
| -------------- | ---- | -------- | ----------- |
| `UnitCount`    | int  | ✓        |             |
| `CommentsFlag` | int  | ✓        |             |
| `PhotoCount`   | int  | ✓        |             |
| `EntityKey`    | int  |          |             |
| `DateKey`      | int  |          |             |
| `PhotoFlag`    | int  |          |             |
| `VehicleKey`   | int  |          |             |
| `Veh_flg`      | int  | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_Merchandising]
AS
SELECT UnitCount, CommentsFlag, PhotoCount, EntityKey, DateKey, CASE WHEN PhotoCount > 0 THEN 1 ELSE 0 END AS PhotoFlag, VehicleKey, Veh_flg
FROM  dbo.Fact_Merchandising


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
