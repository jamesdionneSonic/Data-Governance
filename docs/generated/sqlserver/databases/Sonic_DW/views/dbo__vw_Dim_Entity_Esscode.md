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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
