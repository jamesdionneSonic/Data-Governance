---
name: vw_Playbook_Entity
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - PlaybookEntity
dependency_count: 2
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.PlaybookEntity** (U )

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `Entity`        | varchar | ✓        |             |
| `EntityKey`     | int     | ✓        |             |
| `EntDealerLvl1` | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Playbook_Entity
AS
SELECT     dbo.PlaybookEntity.Entity, dbo.PlaybookEntity.EntityKey, dbo.Dim_Entity.EntDealerLvl1
FROM         dbo.PlaybookEntity INNER JOIN
                      dbo.Dim_Entity ON dbo.PlaybookEntity.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
