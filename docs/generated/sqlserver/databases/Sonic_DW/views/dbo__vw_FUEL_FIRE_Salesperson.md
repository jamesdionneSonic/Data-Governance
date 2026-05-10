---
name: vw_FUEL_FIRE_Salesperson
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

CREATE VIEW [dbo].[vw_FUEL_FIRE_Salesperson]
AS
SELECT     dbo.factFIRE.AccountingDateKey, dbo.factFIRE.EntityKey, dbo.factFIRE.DealTypeKey, dbo.factFIRE.VehicleKey, dbo.factFIRE.StockNo, dbo.factFIRE.SalesPerson1Key, 
                      dbo.factFIRE.SalesPerson2Key, dbo.factFIRE.SalesPerson3Key
FROM         dbo.factFIRE INNER JOIN
                      dbo.dim_FIGLAccounts ON dbo.factFIRE.FIGLProductKey = dbo.dim_FIGLAccounts.FIGLProductKey
WHERE     (NOT (dbo.dim_FIGLAccounts.FIAcco
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
