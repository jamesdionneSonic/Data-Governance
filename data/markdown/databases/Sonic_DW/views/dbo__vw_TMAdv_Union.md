---
name: vw_TMAdv_Union
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DM_AdvertisingExpense
  - vw_TMDOCProjectionsAdvertising
dependency_count: 2
column_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DM_AdvertisingExpense** (U )
- **dbo.vw_TMDOCProjectionsAdvertising** (V )

## Columns

| Name                | Type     | Nullable | Description |
| ------------------- | -------- | -------- | ----------- |
| `EntityKey`         | int      | ✓        |             |
| `NewUsedID`         | nvarchar | ✓        |             |
| `CalendarYearMonth` | varchar  | ✓        |             |
| `metric_name`       | nvarchar | ✓        |             |
| `value`             | money    | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_TMAdv_Union
AS
SELECT        EntityKey, NewUsedID, CalendarYearMonth, metric_name, value
FROM            dbo.DM_AdvertisingExpense

UNION ALL
SELECT  EntityKey, NewUsedID, CalendarYearMonth, metric_name, value FROM
                         dbo.vw_TMDOCProjectionsAdvertising

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
