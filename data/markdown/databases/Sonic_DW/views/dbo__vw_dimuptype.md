---
name: vw_dimuptype
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DimUpType
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimUpType** (U )

## Columns

| Name            | Type     | Nullable | Description |
| --------------- | -------- | -------- | ----------- |
| `UpTypeKey`     | int      |          |             |
| `UpType`        | varchar  |          |             |
| `Meta_LoadDate` | datetime |          |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_dimuptype]
AS
SELECT        UpTypeKey, UpType, Meta_LoadDate
FROM            dbo.DimUpType
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
