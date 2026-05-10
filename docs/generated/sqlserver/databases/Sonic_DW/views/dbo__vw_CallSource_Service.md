---
name: vw_CallSource_Service
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









CREATE view [dbo].[vw_CallSource_Service] as

select e.entregion,e.entitykey, e.entdealerlvl1, e.entbrand, CallerNumber, r.ResultKey ,Result, adsource4,adsource3, 
fulldate [DateTY], datekey, count(distinct callernumber) TYCalls
from [dbo].[FactCallSource] c
join DimAdSource a
on a.adsourcekey=c.adsourcekey
join dimresult r
on r.resultkey=c.resultkey
join vw_Dim_EntityMAR e
  on e.entitykey = c.entitykey and e.entactive='Active'
join dim_date d
on c.calldatekey=d.da
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
