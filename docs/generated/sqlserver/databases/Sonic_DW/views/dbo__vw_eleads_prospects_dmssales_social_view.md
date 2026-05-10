---
name: vw_eleads_prospects_dmssales_social_view
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








---in Sonic DW
CREATE  view [dbo].[vw_eleads_prospects_dmssales_social_view] as 


select distinct e.entregion
,e.EntLineOfBusiness
,e.entdealerlvl1
,e.entbrand
,d.fulldate
,d.datekey
,o.entitykey
,os.SrcUpType
,os.SrcSourceID
,os.SrcSourceDesc
,os.SrcSubSourceID
,os.SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end as NewUsed
,v.VehModelYear BoughtVehYear
,v.VehModelDesc BoughtVehModel
,v.VehMakeDesc BoughtVehMake
,c.AddressZipCode
,
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
