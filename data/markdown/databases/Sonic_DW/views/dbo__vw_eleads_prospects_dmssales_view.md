---
name: vw_eleads_prospects_dmssales_view
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
  - DimUpType
  - DimVehicleMake
  - DimVehicleModel
dependency_count: 4
column_count: 22
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.DimLeadStatus** (U )
- **dbo.DimUpType** (U )
- **dbo.DimVehicleMake** (U )
- **dbo.DimVehicleModel** (U )

## Columns

| Name                       | Type    | Nullable | Description |
| -------------------------- | ------- | -------- | ----------- |
| `entregion`                | varchar | ✓        |             |
| `EntLineOfBusiness`        | varchar | ✓        |             |
| `entdealerlvl1`            | varchar | ✓        |             |
| `entbrand`                 | varchar | ✓        |             |
| `fulldate`                 | date    |          |             |
| `datekey`                  | int     |          |             |
| `entitykey`                | int     |          |             |
| `SrcUpType`                | varchar |          |             |
| `SrcSourceID`              | int     | ✓        |             |
| `SrcSourceDesc`            | varchar | ✓        |             |
| `Standardleadsourcename`   | varchar | ✓        |             |
| `ThirdPartySourceStandard` | varchar |          |             |
| `SrcSubSourceID`           | int     | ✓        |             |
| `SrcSubSourceDesc`         | varchar | ✓        |             |
| `NewUsed`                  | varchar |          |             |
| `BoughtVehYear`            | int     | ✓        |             |
| `BoughtVehMake`            | varchar | ✓        |             |
| `BoughtVehModel`           | varchar | ✓        |             |
| `AddressZipCode`           | varchar | ✓        |             |
| `LeadCountTY`              | int     | ✓        |             |
| `EleadsDMSSold`            | int     | ✓        |             |
| `Exclude`                  | int     |          |             |

## Definition

```sql





---in Sonic DW
CREATE view [dbo].[vw_eleads_prospects_dmssales_view] as




select distinct e.entregion
,e.EntLineOfBusiness
,e.entdealerlvl1
,e.entbrand
,d.fulldate
,d.datekey
,o.entitykey
,ut.uptype as SrcUpType
,os.LeadSourcekey as SrcSourceID
,LeadSourceName as SrcSourceDesc
,sls.Standardleadsourcename
,isnull(m.thirdpartystandard, 'Other') ThirdPartySourceStandard
,eleadsubsourceid as SrcSubSourceID
,leadsubsourcename as SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end as NewUsed
,vv.ModelYear BoughtVehYear
,vm.StandardMakeDescription  BoughtVehMake
,vmm.ModelDescription  BoughtVehModel
,c.AddressZipCode
,sum(o.LeadCount) LeadCountTY
,sum(o.dmssoldcount) EleadsDMSSold
,(case when os.[LeadSourceName] in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
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
'KBB ICO Dealer Website',
'Service & Parts','xChange') and lss.[LeadSubSourceName] not in ('Dealer Website','Dealer Website - Mobile') then 1 else 0 end) as Exclude
from sonic_dw.dbo.factopportunity o
join sonic_dw.dbo.dim_date d
on o.DateProspectInKey = d.datekey
join sonic_dw.dbo.dim_entity e--vw_dim_entitymar e
on e.entitykey = o.entitykey
left join sonic_dw.dbo.DimLeadSource os
on o.LeadSourceKey = os.LeadSourceKey
left join sonic_dw.dbo.dimLeadSubSource lss
on lss.leadsubsourcekey = o.leadsubsourcekey
left join sonic_dw.dbo.DimStandardLeadSource sls
on sls.standardleadsourceid=os.standardleadsourceid
join DimLeadStatus ls
on ls.leadstatuskey = o.leadstatuskey
join DimUpType ut
on o.uptypekey = ut.uptypekey
left join sonic_dw.dbo.DimVehicle vv
on o.VehicleKey=vv.VehicleKey
left join DimVehicleMake as vm
on vv.VehicleMakeId = vm.VehicleMakeId
left join DimVehicleModel as vmm
on  vv.VehicleModelId = vmm.VehicleModelId
left join sonic_dw.dbo.DimCustomer c
on o.FocusCustomerKey=c.CustomerKey
left join sonic_dw.dbo.DimDealType dt
on o.DealTypeKey=dt.dealtypekey
left join [V1-SQL-02\INST1].[sonic_dw].[dbo].[eleadsThirdPartyMapping] m
on ltrim(rtrim(os.leadsourcename)) = m.srcsourcedesc--on os.[srcsourcedesc]=m.[srcsourcedesc]
and lss.LeadSubSourceName = m.srcsubsourcedesc--and os.[srcsubsourcedesc]=m.[srcsubsourcedesc]
where  d.fulldate between  DATEFROMPARTS ( DATEPART(yyyy, GETDATE()) - 4, 1, 1 )  and  cast(dateadd(day, -1, getdate()) as date)
and e.EntActive='Active' and e.entlineofbusiness='Sonic'
--and ls.leadinactivereasoncode not in (640) --Excluding bad leads
and o.meta_rowiscurrent = 'Y' --and os.SrcSourceDesc='CarNow' and os.SrcSubSourceDesc in ('Facebook','Facebook Marketplace - Appt')
--and e.entitykey = 144
--and d.datekey between 20240101 and 20240303
and ((os.[LeadSourceName] not in ('TrueCar Sell')
and lss.[LeadSubSourceName] not in (
'ATC Inventory - KBB ICO',
'KBB ICO',
'Accu-Trade Sell Only',
'Accu-Trade')))--- sources and subsource exclusions asked for by Scott Carrigan
--or (os.[LeadSourceName]='KBB Instant Cash Offer' and lss.[LeadSubSourceName]  in ('Dealer Website','Dealer Website - Mobile')))
and case when os.[LeadSourceName] in ('KBB Instant Cash Offer', 'Autotrader-TIM-KBB',
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
'KBB ICO Dealer Website',
'Service & Parts','xChange')  and lss.[LeadSubSourceName] not in ('Dealer Website','Dealer Website - Mobile') then 1 else 0 end = 0
group by e.entregion
,e.EntLineOfBusiness
,e.EntBrand
,e.entdealerlvl1
,d.fulldate
,d.datekey
,o.entitykey
,ut.uptype --os.SrcUpType
,os.LeadSourcekey --os.SrcSourceID
,LeadSourceName --os.SrcSourceDesc
,sls.standardleadsourcename
,isnull(m.thirdpartystandard, 'Other')
,eleadsubsourceid  --os.SrcSubSourceID
,leadsubsourcename --os.SrcSubSourceDesc
,Case when  o.NewVehicleFlag=1 then 'New' else 'Used' end
,vv.ModelYear
,vmm.ModelDescription
,vm.StandardMakeDescription
,c.AddressZipCode



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
