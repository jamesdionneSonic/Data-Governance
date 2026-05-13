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
| `LineofBusiness`   | varchar | ✓        |             |
| `CompanyID`        | varchar | ✓        |             |
| `StockType`        | varchar | ✓        |             |
| `ModelYear`        | int     | ✓        |             |
| `Make`             | varchar | ✓        |             |
| `Mileage`          | numeric | ✓        |             |
| `Model`            | varchar | ✓        |             |
| `VIN`              | varchar | ✓        |             |
| `Stockno`          | varchar |          |             |
| `FP_FullAccount`   | varchar | ✓        |             |
| `FloorplanBalance` | money   | ✓        |             |

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
f. SSC_FND_File_LoadFlag  = 1 --Raj Add --12/14/2020 ASM
AND f.SSC_Manual_Amount<> 0 --Raj Add --12/14/2020 ASM
and convert(date,Meta_LoadDate) = convert(date, getdate()) -- today






```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
