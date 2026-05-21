---
name: vw_eleads_prospects_dmssales_view_20231003
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
CREATE view [dbo].[vw_eleads_prospects_dmssales_view_20231003] as


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
,isnull(m.thirdpartystandard, 'Other') ThirdPartySourceStandard
,os.SrcSubSourceID
,os.SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end as NewUsed
,v.VehModelYear BoughtVehYear
,v.VehModelCategory BoughtVehModel
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
join DimLeadStatus ls
on ls.leadstatuskey = o.leadstatuskey
left join sonic_dw.dbo.Dim_Vehicle v
on o.VehicleKey=v.VehicleKey
left join sonic_dw.dbo.DimCustomer c
on o.FocusCustomerKey=c.CustomerKey
left join sonic_dw.dbo.DimDealType dt
on o.DealTypeKey=dt.dealtypekey
left join [V1-SQL-02\INST1].[sonic_dw].[dbo].[eleadsThirdPartyMapping] m
on os.[srcsourcedesc]=m.[srcsourcedesc] and os.[srcsubsourcedesc]=m.[srcsubsourcedesc]
where  d.fulldate between  DATEFROMPARTS ( DATEPART(yyyy, GETDATE()) - 4, 1, 1 )  and  cast(dateadd(day, -1, getdate()) as date)
and e.EntActive='Active' and e.entlineofbusiness='Sonic'
and ls.leadinactivereasoncode not in (640) --Excluding bad leads
and o.meta_rowiscurrent = 'Y' --and os.SrcSourceDesc='CarNow' and os.SrcSubSourceDesc in ('Facebook','Facebook Marketplace - Appt')
--and os.SrcSourceDesc not in ('Autotrader-TIM-KBB',
--'KBB-TIM',
--'TIM-KBB/CR',
--'AutoTrader TIM ATC',
--'AutoTrader TIM Kelley Blue Book',
--'TIM-ATC',
--'TIM-ATC/CR',
--'AutoTrader TIM-KBB',
--'Autotrader.com TIM - Trade-In Marketplace',
--'AutoTrader TIM',
--'AutoTrader TIM Dealer Website',
--'AutoTrader TIM KBB',
--'Autotrader - TIM',
--'Autotrader-TIM',
--'KBB ICO Dealer Website','KBB Instant Cash Offer','TrueCar Sell')
--and os.SrcSubSourceDesc not in (
--'ATC Inventory - KBB ICO',
--'KBB ICO',
--'Accu-Trade Sell Only',
--'Accu-Trade')--- sources and subsource exclusions asked for by Scott Carrigan
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
,isnull(m.thirdpartystandard, 'Other')
,os.SrcSubSourceID
,os.SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end
,v.VehModelYear
,v.VehModelCategory
,v.VehMakeDesc
,c.AddressZipCode





---([Leads Cm]*Totalmonthdays)/[Max (Dayofcurrentmonth)]


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
