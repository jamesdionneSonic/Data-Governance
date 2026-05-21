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
,sum(o.LeadCount) LeadCountTY
,sum(o.dmssoldcount) EleadsDMSSold
from sonic_dw.dbo.factopportunity o
join sonic_dw.dbo.dim_date d
on o.DateProspectInKey = d.datekey
join sonic_dw.dbo.vw_dim_entitymar e
on e.entitykey = o.entitykey
join sonic_dw.dbo.DimOpportunitySource os
on o.SourceKey = os.SourceKey
join sonic_dw.dbo.DimLeadStatus ls
on ls.leadstatuskey = o.leadstatuskey
left join sonic_dw.dbo.Dim_Vehicle v
on o.VehicleKey=v.VehicleKey
left join sonic_dw.dbo.DimCustomer c
on o.FocusCustomerKey=c.CustomerKey
left join sonic_dw.dbo.DimDealType dt
on o.DealTypeKey=dt.dealtypekey
where  d.fulldate between  DATEFROMPARTS ( DATEPART(yyyy, GETDATE()) - 4, 1, 1 )  and  cast(dateadd(day, -1, getdate()) as date)
and e.EntActive='Active' and e.entlineofbusiness='Sonic'
and ls.leadinactivereasoncode not in (640) --Excluding bad leads
and o.meta_rowiscurrent = 'Y' and os.SrcSourceDesc='CarNow' and os.SrcSubSourceDesc in ('Facebook Marketplace','Facebook Marketplace - Appt','Facebook')
group by e.entregion
,e.EntLineOfBusiness
,e.EntBrand
,e.entdealerlvl1
,d.fulldate
,d.datekey
,o.entitykey
,os.SrcUpType
,os.SrcSourceID
,os.SrcSourceDesc
,os.SrcSubSourceID
,os.SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end
,v.VehModelYear
,v.VehModelDesc
,v.VehMakeDesc
,c.AddressZipCode


---([Leads Cm]*Totalmonthdays)/[Max (Dayofcurrentmonth)]

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
