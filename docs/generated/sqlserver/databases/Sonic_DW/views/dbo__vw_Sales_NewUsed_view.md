---
name: vw_Sales_NewUsed_view
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








CREATE VIEW [dbo].[vw_Sales_NewUsed_view]
AS
SELECT DISTINCT 
                         e.EntRegion, e.EntityKey, e.EntDealerLvl1 AS SaleDealership, e.EntBrand, f.VIN, f.DealType, vv.ModelYear VehModelYear, vm.StandardMakeDescription VehMakeDesc, vmm.ModelDescription VehModelDesc, 
						 LEFT(c.DMSCstAddressZipCode, 5) AS CustomerZip, 'Unknown' SourceType, 'Unknown'  LeadProvider,d.FullDate, d.DateKey
FROM            dbo.FactFireSummary AS f INNER JOIN
                     
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
