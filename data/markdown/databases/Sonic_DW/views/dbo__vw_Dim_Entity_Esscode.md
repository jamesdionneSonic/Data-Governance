---
name: vw_Dim_Entity_Esscode
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `EntDFIDRegion` | varchar | ✓        |             |
| `EntDealerLvl1` | varchar | ✓        |             |
| `EntEssCode`    | varchar | ✓        |             |

## Definition

```sql
create view vw_Dim_Entity_Esscode as
SELECT distinct


      [EntDFIDRegion]
      ,[EntDealerLvl1]
      ,[EntEssCode]

  FROM [Sonic_DW].[dbo].[Dim_Entity]
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
