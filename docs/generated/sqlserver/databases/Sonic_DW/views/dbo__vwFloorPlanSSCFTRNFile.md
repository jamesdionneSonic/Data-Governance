---
name: vwFloorPlanSSCFTRNFile
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql





CREATE view [dbo].[vwFloorPlanSSCFTRNFile] as


select	f.CDK_Box
		,f.Dealership
		,f.CompanyID
		,f.StockType
		,f.ModelYear
		,f.Make
		,f.Model
		,f.Mileage
		,f.VIN
		,f.Stockno as control
		,case when f.Prefix = 0 then f.FP_Account else concat(f.Prefix,f.FP_Account) end as FP_FullAccount
		,p.FloorplanBalance as FloorplanBalance 
		,'Incoming' as TransferType
FROM	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding]  f
		INNER JOIN Sonic_DW.[dbo].[Syndicate_Floorplan_Payo
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
