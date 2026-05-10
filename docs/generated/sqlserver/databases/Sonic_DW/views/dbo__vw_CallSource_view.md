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
extracted_at: 2026-05-09T12:34:14.349Z
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
from [dbo].[FactCallSour
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
