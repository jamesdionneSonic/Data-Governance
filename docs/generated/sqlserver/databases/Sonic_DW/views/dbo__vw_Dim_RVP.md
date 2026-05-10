---
name: vw_Dim_RVP
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
CREATE VIEW dbo.vw_Dim_RVP
AS
SELECT        EntRegion
FROM            dbo.Dim_Entity
WHERE        (EntActive = 'Active') AND (EntLineOfBusiness = 'Sonic')
GROUP BY EntRegion

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
