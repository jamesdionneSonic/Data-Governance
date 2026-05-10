---
name: vwFloorPlanSSCFNDFile
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




CREATE view [dbo].[vwFloorPlanSSCFNDFile] as

----------SSC Regular Power Post---------
select	CDK_Box
		,Dealership
		,LineofBusiness
		,CompanyID
		,StockType
		,ModelYear
		,Make
		,Mileage
		,Model
		,VIN
		,Stockno
		,case when Prefix = 0 then FP_Account else concat(Prefix,FP_Account) end as FP_FullAccount
		,SSC_Manual_Amount as FloorplanBalance --Raj Add --12/14/2020 ASM (change ACV to SSC_Manual_Amount)
FROM	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding] f
WHERE	

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
