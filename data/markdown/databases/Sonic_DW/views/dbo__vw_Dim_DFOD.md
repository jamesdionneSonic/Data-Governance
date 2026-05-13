---
name: vw_Dim_DFOD
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
column_count: 1
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
| `EntDFODRegion` | varchar | ✓        |             |

## Definition

```sql

/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/

CREATE VIEW [dbo].[vw_Dim_DFOD]
AS
SELECT     EntDFODRegion
FROM         dbo.Dim_Entity
GROUP BY EntDFODRegion
HAVING      (NOT (EntDFODRegion = 'FOD_CALVCO'))


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
