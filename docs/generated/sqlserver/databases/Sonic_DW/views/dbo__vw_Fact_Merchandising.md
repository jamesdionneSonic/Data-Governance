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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_Merchandising]
AS
SELECT UnitCount, CommentsFlag, PhotoCount, EntityKey, DateKey, CASE WHEN PhotoCount > 0 THEN 1 ELSE 0 END AS PhotoFlag, VehicleKey, Veh_flg
FROM  dbo.Fact_Merchandising


```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
