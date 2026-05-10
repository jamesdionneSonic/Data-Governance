---
name: vw_FactFire
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
CREATE VIEW dbo.vw_FactFire
AS
SELECT        ROW_NUMBER() OVER (ORDER BY Meta_RowEffectiveDate, DealNo ASC) AS RowID, f.EntityKey, f.dealno, f.FIMgrKey, f.SalesMgrKey, f.SalesPerson1Key, f.SalesPerson2Key, f.SalesPerson3Key, f.AccountingDateKey, 
f.ContractDateKey, f.CashPrice, f.StockNo, f.StockType, f.DealTypeKey, f.PurchaseType, f.TransactionType, f.IsRetail, f.VehicleKey, f.VehicleMileage, f.VehicleYear, f.CertifiedFlag, f.FIGLProductKey, f.Amount, f.VehicleGeneralKey, 
f.statcount, f.Cu
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
