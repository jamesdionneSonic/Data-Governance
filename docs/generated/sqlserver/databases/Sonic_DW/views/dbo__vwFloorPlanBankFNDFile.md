---
name: vwFloorPlanBankFNDFile
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql



CREATE view [dbo].[vwFloorPlanBankFNDFile] as

----------------FND FILE----------------
---today's vehicles to fund in pool line
-----------------------------------------
select 'FND' as OriginCode
,convert(varchar, getdate(), 101) as EffectiveDate
,'' as ApprovalNumber
,'70076' as Dealer_CIN --static pool CIN 70076
,'53509' as AccountID --static pool account 53509
,'53510' as PlantID -- satatic plant ID 53510
,'ASL' as BusinessLineCode
,'STK' as InventoryType
,SSC_Manual_Amount as Amount --Raj Add --12/14/2020 ASM (change from ACV to SSC_Amount)
,ModelYear  as ModelYear
,'CAR' as ProductDescriptor
,Make as Make
,VIN as VIN
,Model as Model
,'' as Chassis
,Stockno as StockNumber
,ACV as OriginalAmount
FROM Sonic_DW.[dbo].[Syndicate_Floorplan_Funding] f
WHERE
f. SSC_FND_File_LoadFlag  = 1 --Raj Add --12/14/2020 ASM
AND f.SSC_Manual_Amount<> 0 --Raj Add --12/14/2020 ASM
and convert(date,Meta_LoadDate) = convert(date, getdate()) --or variable for today

;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
