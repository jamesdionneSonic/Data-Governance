---
name: vw_Fact_Inventory
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
CREATE VIEW dbo.vw_Fact_Inventory
AS
SELECT        dbo.Fact_Inventory.InventoryKey, dbo.Fact_Inventory.EntityKey, dbo.Fact_Inventory.AccountKey, dbo.Fact_Inventory.VehicleKey, dbo.Fact_Inventory.InventoryDateKey, dbo.Fact_Inventory.StockNumber, 
                         dbo.Fact_Inventory.Mileage, dbo.Fact_Inventory.NewVehicleFlag, dbo.Fact_Inventory.CertifiedVehicleFlag, dbo.Fact_Inventory.InventoryDate, dbo.Fact_Inventory.InventoryPostingAmount, 
                         dbo.Fact_Inventory
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
