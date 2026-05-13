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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
WHERE     (NOT (dbo.dim_FIGLAccounts.FIAccountClassification = 'InterCompany')) AND (dbo.factFIRE.statcount = 1)
GROUP BY dbo.factFIRE.AccountingDateKey, dbo.factFIRE.EntityKey, dbo.factFIRE.DealTypeKey, dbo.factFIRE.VehicleKey, dbo.factFIRE.StockNo,
                      dbo.factFIRE.SalesPerson1Key, dbo.factFIRE.SalesPerson2Key, dbo.factFIRE.SalesPerson3Key
HAVING      (dbo.factFIRE.DealTypeKey IN (1, 2, 3, 7))


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
