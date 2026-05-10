---
name: vw_Fact_ServiceTest
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
CREATE VIEW dbo.vw_Fact_ServiceTest
AS
SELECT     b.EntDealerLvl1, a.ServiceDetailKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.TechnicianKey, 
                      a.OpCodeKey, a.LaborTypeKey, a.ServiceType, a.LineItemType, a.RONumber, a.LineCode_Original, a.LineCode, a.LineNumber, a.Mileage, a.LaborSale, a.LaborCost, 
                      a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.TimeCardHours, a.MenuOpportunit
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
