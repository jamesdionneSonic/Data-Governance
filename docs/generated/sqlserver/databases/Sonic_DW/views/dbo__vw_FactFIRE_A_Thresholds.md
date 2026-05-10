---
name: vw_FactFIRE_A_Thresholds
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




CREATE VIEW [dbo].[vw_FactFIRE_A_Thresholds]
AS
SELECT     f.EntityKey, 
			f.DealNo, 
			f.FIMgrKey, 
			f.SalesMgrKey, 
			f.SalesPersonKey, 
			f.AccountingDateKey, 
			f.ContractDateKey, 
			f.Stockno, 
			f.DealTypeKey, 
			f.VehicleKey, 
            f.FIGLProductCategoryKey, 
			f.FIAccountType, 
			f.Amount, 
			f.DealCount, 
			f.ProductCount, 
			f.PenetrationCount, 
			tb.SCPenPctHigh, 
			tb.SCPenPctLow, 
            e.EntBrandGroup, 
			COALESCE (v.vehicl
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
