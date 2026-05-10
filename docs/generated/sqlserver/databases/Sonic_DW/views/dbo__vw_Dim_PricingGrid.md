---
name: vw_Dim_PricingGrid
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
/***********************************************************************
* - Created by Jonathan Henin
* - Updated 07/16/2012
* - Used by MicroStrategy
*
*
************************************************************************/
CREATE VIEW dbo.vw_Dim_PricingGrid
AS
SELECT        TOP (100) PERCENT a.PricingGridKey, a.PgrGridName, a.PgrBeginHours, a.PgrEndHours, a.PgrCentIncrement, ROUND(a.PgrEndHours, 1) AS EndHours, a.PgrGridDollarsActual, a.PgrGridDescription, a.PgrIsActive, a.User_I
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
