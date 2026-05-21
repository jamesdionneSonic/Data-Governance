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
on c.calldatekey=d.datekey
where cast(fulldate as date) between  dateadd(year,-4,
datefromparts(year(dateadd(day, -1, getdate())),month(dateadd(day,-1,getdate())), 1)) and
 cast(dateadd(day, -1, getdate()) as date) and adsource3='Service'
group by  e.entregion,e.entitykey, e.entdealerlvl1, e.entbrand, CallerNumber, r.resultkey,Result, adsource4,adsource3,fulldate,datekey



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
