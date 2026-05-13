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
depends_on:
  - Dim_Date
  - DimAdSource
  - DimResult
  - FactCallSource
  - vw_Dim_EntityMAR
dependency_count: 5
column_count: 12
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

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `entregion`     | varchar | ✓        |             |
| `entitykey`     | int     |          |             |
| `entdealerlvl1` | varchar | ✓        |             |
| `entbrand`      | varchar | ✓        |             |
| `CallerNumber`  | varchar | ✓        |             |
| `ResultKey`     | int     |          |             |
| `Result`        | varchar | ✓        |             |
| `adsource4`     | varchar | ✓        |             |
| `adsource3`     | varchar | ✓        |             |
| `DateTY`        | date    |          |             |
| `datekey`       | int     |          |             |
| `TYCalls`       | int     | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
