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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
