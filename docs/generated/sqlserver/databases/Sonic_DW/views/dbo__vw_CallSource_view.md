---
name: vw_CallSource_view
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












CREATE view [dbo].[vw_CallSource_view] as

select e.entregion, e.entitykey, e.entdealerlvl1,e.entbrand, CallerNumber, r.resultkey, Result,
case when a.adsource4='DNI' then 'Website' else a.adsource4 end as adsource4 --Joe F requested DNI calls to put added to website calls 7/28
,isnull(m.thirdpartystandard, 'Other') ThirdPartySourceStandard,  'Unknown' SourceType,
adsource3,
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
left join [sonic_dw].[dbo].[callsourceThirdPartyMapping] m
on a.adsource4=m.[adsource4]
where cast(fulldate as date) between
dateadd(year,-4,
datefromparts(year(dateadd(day, -1, getdate())),month(dateadd(day,-1,getdate())), 1)) and
 cast(dateadd(day, -1, getdate()) as date)
group by e.entregion,e.entitykey,e.entdealerlvl1,e.entbrand, CallerNumber, r.resultkey, Result, case when a.adsource4='DNI' then 'Website' else a.adsource4 end,isnull(m.thirdpartystandard, 'Other') ,adsource3,fulldate, datekey




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
