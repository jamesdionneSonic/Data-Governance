---
name: vw_Dim_StatusCode
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - factFIRE_A
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

- **dbo.factFIRE_A** (U )

## Columns

| Name              | Type    | Nullable | Description |
| ----------------- | ------- | -------- | ----------- |
| `fiwipstatuscode` | char    | ✓        |             |
| `DealStatus`      | varchar |          |             |

## Definition

```sql


create view [dbo].[vw_Dim_StatusCode] as
SELECT     DISTINCT
    fiwipstatuscode,
    case fiwipstatuscode when 'F' then 'Fin' when 'D' then 'Dlvd' else 'Bkd' end DealStatus
FROM         dbo.factFIRE_A



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
