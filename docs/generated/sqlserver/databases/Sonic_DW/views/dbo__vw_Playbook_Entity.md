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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Playbook_Entity
AS
SELECT     dbo.PlaybookEntity.Entity, dbo.PlaybookEntity.EntityKey, dbo.Dim_Entity.EntDealerLvl1
FROM         dbo.PlaybookEntity INNER JOIN
                      dbo.Dim_Entity ON dbo.PlaybookEntity.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
