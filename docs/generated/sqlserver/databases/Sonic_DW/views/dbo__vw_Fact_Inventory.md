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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         dbo.Fact_Inventory.cora_acct_id_accounting, dbo.Fact_Inventory.cora_acct_id_fi, dbo.Fact_Inventory.companyid, dbo.Fact_Inventory.account, dbo.Fact_Inventory.control, dbo.Fact_Inventory.refer, dbo.Fact_Inventory.dealno,
                         dbo.Fact_Inventory.vin, dbo.Fact_Inventory.ETLExecution_ID, dbo.Fact_Inventory.MetaSrc_Sys_ID, dbo.Fact_Inventory.MetaSourceSystemName, dbo.Fact_Inventory.MetaRowEffectiveDate,
                         dbo.Fact_Inventory.MetaRowExpiredDate, dbo.Fact_Inventory.MetaRowIsCurrent, dbo.Fact_Inventory.MetaRowLastChangedDate, dbo.Fact_Inventory.MetaAuditKey, dbo.Fact_Inventory.MetaNaturalKey,
                         dbo.Fact_Inventory.MetaChecksum, CONVERT(varchar(10), CASE WHEN COALESCE (InventoryPostingAmount, 0.) < 0. THEN 'In' ELSE 'Out' END) AS InventoryDirection, dbo.Dim_Vehicle.VehVIN
FROM            dbo.Fact_Inventory INNER JOIN
                         dbo.Dim_Vehicle ON dbo.Fact_Inventory.VehicleKey = dbo.Dim_Vehicle.VehicleKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
