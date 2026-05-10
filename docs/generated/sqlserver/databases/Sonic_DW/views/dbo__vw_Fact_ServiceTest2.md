---
name: vw_Fact_ServiceTest2
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
CREATE VIEW dbo.vw_Fact_ServiceTest2
AS
SELECT        TOP (1000) b.EntDealerLvl1, a.ServiceKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.VoidDateKey, a.LastServiceDateKey, a.ServiceType, a.RONumber, a.Mileage, 
                         a.LaborSale, a.LaborCost, a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.ActualHours, a.TimeCardHours, a.cora_acct_id_service, a.cora_acct_id_accounting, a.custno, a.vehid, a.vin, a.stockn
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
