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
depends_on:
  - Dim_Date
  - DimAdSource
  - DimResult
  - FactCallSource
  - vw_Dim_EntityMAR
dependency_count: 5
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.DimAdSource** (U )
- **dbo.DimResult** (U )
- **dbo.FactCallSource** (U )
- **dbo.vw_Dim_EntityMAR** (V )

## Columns

| Name                       | Type    | Nullable | Description |
| -------------------------- | ------- | -------- | ----------- |
| `entregion`                | varchar | ✓        |             |
| `entitykey`                | int     |          |             |
| `entdealerlvl1`            | varchar | ✓        |             |
| `entbrand`                 | varchar | ✓        |             |
| `CallerNumber`             | varchar | ✓        |             |
| `resultkey`                | int     |          |             |
| `Result`                   | varchar | ✓        |             |
| `adsource4`                | varchar | ✓        |             |
| `ThirdPartySourceStandard` | varchar |          |             |
| `SourceType`               | varchar |          |             |
| `adsource3`                | varchar | ✓        |             |
| `DateTY`                   | date    |          |             |
| `datekey`                  | int     |          |             |
| `TYCalls`                  | int     | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
