---
name: vw_Dim_CorporateEntity_All
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
dependency_count: 1
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `EntDealerLvl1` | varchar | ✓        |             |
| `EntEntityType` | varchar | ✓        |             |

## Definition

```sql


CREATE VIEW [dbo].[vw_Dim_CorporateEntity_All]
AS
SELECT        EntDealerLvl1, EntEntityType
FROM            dbo.Dim_Entity
GROUP BY EntDealerLvl1, EntEntityType
HAVING        (EntEntityType <> 'Dealership') AND (NOT (EntDealerLvl1 IS NULL))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
