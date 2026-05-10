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
extracted_at: 2026-05-09T12:34:14.349Z
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
,SSC_Manual_Amou
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
