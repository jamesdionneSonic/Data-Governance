---
name: vw_elead_projections_live
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - DimLeadStatus
dependency_count: 1
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadStatus** (U )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `entregion`         | varchar | ✓        |             |
| `EntLineOfBusiness` | varchar | ✓        |             |
| `entdealerlvl1`     | varchar | ✓        |             |
| `entbrand`          | varchar | ✓        |             |
| `entitykey`         | int     |          |             |
| `NewUsed`           | varchar |          |             |
| `fiscalmonthkey`    | int     | ✓        |             |
| `Tracking`          | int     | ✓        |             |
| `LeadCountTY`       | int     | ✓        |             |
| `EleadsDMSSold`     | int     | ✓        |             |

## Definition

```sql







---in Sonic DW
CREATE view [dbo].[vw_elead_projections_live] as



select distinct e.entregion
,e.EntLineOfBusiness
,e.entdealerlvl1
,e.entbrand
,o.entitykey
,Case when o.NewVehicleFlag=1 then 'New' else 'Used' end as NewUsed
,d.fiscalmonthkey
--,(case when os.SrcSourceDesc in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
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
--'KBB ICO Dealer Website') and os.SrcSubSourceDesc not in ('Dealer Website','Dealer Website - Mobile') then 1 else 0 end) as Exclude
,(sum(o.LeadCount)*day(eomonth(getdate()-1)))/day(getdate()-1) as Tracking
,sum(o.LeadCount) LeadCountTY
,sum(o.dmssoldcount) EleadsDMSSold
from sonic_dw.dbo.factopportunity o
join sonic_dw.dbo.dim_date d
on o.DateProspectInKey = d.datekey
join sonic_dw.dbo.dim_entity e
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
where d.fulldate between DATEFROMPARTS(YEAR(getdate()),MONTH(getdate()-1),1) and cast(dateadd(day, -1, getdate()) as date)
and e.EntActive='Active' and e.entlineofbusiness='Sonic'
and ls.leadinactivereasoncode not in (640) --Excluding bad leads
and o.meta_rowiscurrent = 'Y'
and ((os.SrcSourceDesc not in ('TrueCar Sell')
and os.SrcSubSourceDesc not in (
'ATC Inventory - KBB ICO',
'KBB ICO',
'Accu-Trade Sell Only',
'Accu-Trade')))--- sources and subsource exclusions asked for by Scott Carrigan
--or (os.[LeadSourceName]='KBB Instant Cash Offer' and lss.[LeadSubSourceName]  in ('Dealer Website','Dealer Website - Mobile')))
and case when os.SrcSourceDesc in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
'KBB-TIM',
'TIM-KBB/CR',
'AutoTrader TIM ATC',
'AutoTrader TIM Kelley Blue Book',
'TIM-ATC',
'TIM-ATC/CR',
'AutoTrader TIM-KBB',
'Autotrader.com TIM - Trade-In Marketplace',
'AutoTrader TIM',
'AutoTrader TIM Dealer Website',
'AutoTrader TIM KBB',
'Autotrader - TIM',
'Autotrader-TIM',
'KBB ICO Dealer Website')  and os.SrcSubSourceDesc not in ('Dealer Website','Dealer Website - Mobile') then 1 else 0 end = 0
group by e.entregion
,e.EntLineOfBusiness
,e.EntBrand
,e.entdealerlvl1
,o.entitykey
,Case when o.NewVehicleFlag=1 then 'New' else 'Used' end,d.fiscalmonthkey
,(case when os.SrcSourceDesc in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
'KBB-TIM',
'TIM-KBB/CR',
'AutoTrader TIM ATC',
'AutoTrader TIM Kelley Blue Book',
'TIM-ATC',
'TIM-ATC/CR',
'AutoTrader TIM-KBB',
'Autotrader.com TIM - Trade-In Marketplace',
'AutoTrader TIM',
'AutoTrader TIM Dealer Website',
'AutoTrader TIM KBB',
'Autotrader - TIM',
'Autotrader-TIM',
'KBB ICO Dealer Website') and os.SrcSubSourceDesc not in ('Dealer Website','Dealer Website - Mobile') then 1 else 0 end)






```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
