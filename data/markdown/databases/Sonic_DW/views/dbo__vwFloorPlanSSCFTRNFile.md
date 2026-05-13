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
depends_on: []
dependency_count: 0
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name               | Type    | Nullable | Description |
| ------------------ | ------- | -------- | ----------- |
| `CDK_Box`          | varchar | ✓        |             |
| `Dealership`       | varchar | ✓        |             |
| `CompanyID`        | varchar | ✓        |             |
| `StockType`        | varchar | ✓        |             |
| `ModelYear`        | int     | ✓        |             |
| `Make`             | varchar | ✓        |             |
| `Model`            | varchar | ✓        |             |
| `Mileage`          | numeric | ✓        |             |
| `VIN`              | varchar | ✓        |             |
| `control`          | varchar | ✓        |             |
| `FP_FullAccount`   | varchar | ✓        |             |
| `FloorplanBalance` | money   | ✓        |             |
| `TransferType`     | varchar |          |             |

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
		INNER JOIN Sonic_DW.[dbo].[Syndicate_Floorplan_Payoff] p on f.vin = p.vin
WHERE	f.trn_file_loadflag = 1
		and convert(date,f.Meta_LoadDate) = convert(date,p.Meta_LoadDate) --file load dates match
		and convert(date,f.Meta_LoadDate) = convert(date, getdate()) --  today
		--and f.CompanyID <> p.CompanyID --removed due to flag update change
union

--from payoff file with floorplan debit
select	p.CDK_Box
		,p.Dealership
		,p.CompanyID
		,p.StockType
		,p.ModelYear
		,p.Make
		,p.Model
		,f.Mileage
		,p.VIN
		,p.control
		,p.fullaccount as FP_FullAccount
		,p.FloorplanBalance*-1 as FloorplanBalance
		,'Outgoing' as TransferType
FROM	Sonic_DW.[dbo].[Syndicate_Floorplan_Funding]  f
		INNER JOIN Sonic_DW.[dbo].[Syndicate_Floorplan_Payoff] p on f.vin = p.vin
WHERE	f.trn_file_loadflag = 1
		and convert(date,f.Meta_LoadDate) = convert(date,p.Meta_LoadDate) --load dates match
		and convert(date,f.Meta_LoadDate) = convert(date, getdate()) --  today
		--and f.CompanyID <> p.CompanyID --removed due to flag update change






```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
