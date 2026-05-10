---
name: vw_Dim_LaborType
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql


/***********************************************************************
* - Updated by Jonathan Henin
* - Updated 02/18/2014
* - Used by MicroStrategy
*
*
***********************************************************************
SELECT * FROM dbo.Dim_LaborType --3329*/
CREATE VIEW [dbo].[vw_Dim_LaborType]
AS
SELECT        a.LaborTypeKey, a.LbrCoraAcctId, a.LbrLaborType, a.LbrLaborTypeDescription_Original, a.LbrLaborTypeDescription, c.LbrLaborTypeCategory, a.LbrLaborRate, a.LbrLaborP
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
