---
name: vw_FactFire
database: Sonic_DW
type: view
schema: MS
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 4
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: MS

## Dependencies

This view depends on:

- **dbo.dim_DealType** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.factFIRE** (U )

## Definition

```sql
CREATE VIEW MS.vw_FactFire
AS
SELECT        f.EntityKey, f.dealno, f.FIMgrKey, f.SalesMgrKey, f.SalesPerson1Key, f.SalesPerson2Key, f.SalesPerson3Key, f.AccountingDateKey, f.ContractDateKey, f.CashPrice, f.StockNo, f.StockType, f.DealTypeKey, f.PurchaseType,
                         f.TransactionType, f.IsRetail, f.VehicleKey, f.VehicleMileage, f.VehicleYear, f.CertifiedFlag, CASE WHEN a3.EntLineOfBusiness = 'EchoPark' AND f.FIGLProductKey = 850 THEN 0 ELSE f.FIGLProductKey END AS FIGLProductKey,
                         f.Amount, f.VehicleGeneralKey, f.statcount, f.CustomerKey, f.fiwipstatuscode, f.LenderKey, CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN d .DealTypeCode = 'Lease' OR
                         d .DealTypeCode = 'Demo' THEN 'New' ELSE d .DealTypeCode END AS SaleType, f.DIMVehicleKey, f.trade1vin, f.trade1stock, f.trade1gross, f.trade1ACV, f.trade2stock, f.trade2vin, f.trade2gross, f.trade2ACV,
                         f.feeoption1amount
FROM            dbo.factFIRE AS f WITH (NOLOCK) INNER JOIN
                         dbo.dim_FIGLAccounts AS a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN
                         dbo.dim_DealType AS d ON f.DealTypeKey = d.DealTypeKey INNER JOIN
                         dbo.Dim_Entity AS a3 ON f.EntityKey = a3.EntityKey
WHERE        (a3.EntLineOfBusiness = 'EchoPark') AND (f.FIGLProductKey <> 850) OR
                         (a3.EntLineOfBusiness = 'Sonic')

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
