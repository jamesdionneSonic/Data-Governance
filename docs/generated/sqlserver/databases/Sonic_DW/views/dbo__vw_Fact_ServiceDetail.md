---
name: vw_Fact_ServiceDetail
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
CREATE VIEW dbo.vw_Fact_ServiceDetail
AS
SELECT DISTINCT 
                         b.EntDealerLvl1, a.ServiceDetailKey, a.EntityKey, a.TechnicianKey, a.OpCodeKey, a.LaborTypeKey, a.ServiceType, a.LineItemType, a.RONumber, a.LineCode_Original, a.LineCode, a.LineNumber, a.LaborSale, a.LaborCost, 
                         a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.TimeCardHours, a.Complaint, a.Cause, a.Correction, a.[1LineItemFlag] AS OneLineItemFlag, a.LineItemCount, a.Cu
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
