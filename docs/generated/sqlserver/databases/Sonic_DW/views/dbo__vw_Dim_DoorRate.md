---
name: vw_Dim_DoorRate
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

CREATE VIEW [dbo].[vw_Dim_DoorRate]
AS
WITH cte AS 
(SELECT        ROW_NUMBER() OVER (PARTITION BY a.PgrGridName, a.PgrHdrcora_acct_id ORDER BY  ROUND(a.PgrEndHours, 1)) AS rn, a.PgrGridName, ROUND(a.PgrEndHours, 1) AS EndHours, CONVERT(numeric(10, 2), a.PgrGridDollarsActual) AS HourRate, a.PgrHdrcora_acct_id, c.EntDealerLvl1, 
                         CASE WHEN c.EntBrandGroup = 'Luxury Imports' THEN CONVERT(numeric(10, 2), 1.00 * a.PgrGridDollarsActual) WHEN c.EntBrandGroup = 'Domestic' 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
