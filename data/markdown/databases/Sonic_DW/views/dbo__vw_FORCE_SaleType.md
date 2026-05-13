---
name: vw_FORCE_SaleType
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DM_FORCE_Summary_LI
dependency_count: 1
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DM_FORCE_Summary_LI** (U )

## Columns

| Name           | Type    | Nullable | Description |
| -------------- | ------- | -------- | ----------- |
| `DateKey`      | int     |          |             |
| `EntityKey`    | int     |          |             |
| `LineItemType` | varchar | ✓        |             |
| `ServiceType`  | varchar | ✓        |             |
| `FSales`       | money   | ✓        |             |
| `FCost`        | money   | ✓        |             |
| `SaleType`     | varchar |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_FORCE_SaleType]
AS
SELECT     DateKey, EntityKey, LineItemType, ServiceType, LaborSales AS FSales, LaborCost AS FCost, 'Labor' AS SaleType
FROM         dbo.DM_FORCE_Summary_LI
UNION ALL
SELECT     DateKey, EntityKey, LineItemType, ServiceType, PartsSales AS FSales, PartsCost AS FCost, 'Parts' AS SaleType
FROM         dbo.DM_FORCE_Summary_LI
UNION ALL
SELECT     DateKey, EntityKey, LineItemType, ServiceType, SSPSales AS FSales, SSPCost AS FCost, 'SSP' AS SaleType
FROM         dbo.DM_FORCE_Summary_LI
UNION ALL
SELECT     DateKey, EntityKey, LineItemType, ServiceType, MiscSales AS FSales, MiscCost AS FCost, 'Misc' AS SaleType
FROM         dbo.DM_FORCE_Summary_LI


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
