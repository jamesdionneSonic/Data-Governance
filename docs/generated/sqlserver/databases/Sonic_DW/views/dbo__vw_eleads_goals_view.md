---
name: vw_eleads_goals_view
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








/*------------------------------------------------------
Step 1: Source data from eLead and DOC budgets for:
     CM - Current Month
  LM - Last Month
  LY - Last Year

Note- the elead data % for leads/sales use a rolling two month history to compare to current month budget.
------------------------------------------------------*/

CREATE view [dbo].[vw_eleads_goals_view] as

--------------Current Month Metrics--------------
with HistoryCM as (
select entitykey
 , szNewUsed
 , szuptype
 , sum(leadcount) LeadsCM
 , sum(Sold) SoldCM
from FactTrafficSummary s
where fiscalmonthkey in(concat(year(dateadd(month,-1, dateadd(day,-1,getdate()))),case when month(dateadd(month,-1, dateadd(day,-1,getdate())))<10
then 0 else null end, month(dateadd(month,-1, dateadd(day,-1,getdate())))),concat(year(dateadd(month,-2, dateadd(day,-1,getdate()))),case when month(dateadd(month,-2, dateadd(day,-1,getdate())))<10
then 0 else null end, month(dateadd(month,-2, dateadd(day,-1,getdate())))))
and MTD = 0
group by entitykey, sznewused, szuptype),
--------------Current Month Metrics--------------

--------------Last Month Metrics--------------

HistoryLM as (select entitykey
 , szNewUsed
 , szuptype
 , sum(leadcount) LeadsLM
 , sum(Sold) SoldLM
from FactTrafficSummary s
where fiscalmonthkey in(concat(year(dateadd(month,-3, dateadd(day,-1,getdate()))),case when month(dateadd(month,-3, dateadd(day,-1,getdate())))<10 then 0 else null end,
month(dateadd(month,-3, dateadd(day,-1,getdate())))),concat(year(dateadd(month,-2, dateadd(day,-1,getdate()))),case when month(dateadd(month,-2, dateadd(day,-1,getdate())))<10 then 0 else null end,
month(dateadd(month,-2, dateadd(day,-1,getdate())))))
and MTD = 0
group by entitykey, sznewused, szuptype),
--------------Last Month Metrics--------------


--------------Last Year Metrics--------------
HistoryLY as(
select entitykey
 , szNewUsed
 , szuptype
 , sum(leadcount) LeadsLY
 , sum(Sold) SoldLY
from FactTrafficSummary s
where fiscalmonthkey in(concat(year(dateadd(month,-13, dateadd(day,-1,getdate()))),case when month(dateadd(month,-13, dateadd(day,-1,getdate())))<10 then 0 else null end, month(dateadd(month,-13, dateadd(day,-1,getdate())))),concat(year(dateadd(month,-14, dateadd(day,-1,getdate()))),case when month(dateadd(month,-14, dateadd(day,-1,getdate())))<10 then 0 else null end, month(dateadd(month,-14, dateadd(day,-1,getdate())))))
and MTD = 0
group by entitykey, sznewused, szuptype),
--------------Last Year Metrics--------------


--------------Current Month Budget--------------
BudgetCM as (
select fiscalmonthkey, entitykey
,case when b.GroupElementSort = 10 then 'N' else 'U' end as NewUsed
, round(sum(b.StatCount),0)  BudgetCM
from vw_Doc_Budget b
join dbo.vw_Dim_date d
on b.DateKey = d.DateKey
where d.FiscalMonthKey in (
 select FiscalMonthKey
 from vw_Dim_date
 where fulldate = dateadd(day, -1, cast(getdate() as date))
 )
and b.GroupElementSort in (10,20)
group by d.FiscalMonthKey,entitykey,case when b.GroupElementSort = 10 then 'N' else 'U' end),
--------------Current Month Budget--------------


--------------Last Month Budget--------------
BudgetLM as(
select fiscalmonthkey, entitykey
,case when b.GroupElementSort = 10 then 'N' else 'U' end as NewUsed
, round(sum(b.StatCount),0)  BudgetLM
from vw_Doc_Budget b
join dbo.vw_Dim_date d
on b.DateKey = d.DateKey
where d.FiscalMonthKey in (
 select FiscalMonthKey
 from vw_Dim_date
 where fulldate = dateadd(month, -1,dateadd(day, -1, cast(getdate() as date)))
 )
and b.GroupElementSort in (10,20)
group by d.FiscalMonthKey, entitykey,case when b.GroupElementSort = 10 then 'N' else 'U' end),
--------------Last Month Budget--------------



--------------Last Year Budget--------------
BudgetLY as (
select fiscalmonthkey, entitykey
,case when b.GroupElementSort = 10 then 'N' else 'U' end as NewUsed
, round(sum(b.StatCount),0)  BudgetLY
from vw_Doc_Budget b
join dbo.vw_Dim_date d
on b.DateKey = d.DateKey
where d.FiscalMonthKey in (
 select FiscalMonthKey
 from vw_Dim_date
 where fulldate = dateadd(year, -1,dateadd(day, -1, cast(getdate() as date)))
 )
and b.GroupElementSort in (10,20)
group by d.FiscalMonthKey, entitykey,case when b.GroupElementSort = 10 then 'N' else 'U' end),
--------------Last Year Budget--------------



/*------------------------------------------------------
Step 2: Calculate targets at the up level
------------------------------------------------------*/



----------------------------------------------------------------------------------------------
eLeadL2MSummary as(
select EntDealerGEC as Dealership, GEC, Region, GECTeam, StoreBrand
,coalesce(ecm.sznewused, elm.sznewused, ely.sznewused) NewUsed
,sum(SoldCM) TotalSoldCM
,sum(LeadsCM) TotalLeadsCM
,sum(SoldLM) TotalSoldLM
,sum(LeadsLM) TotalLeadsLM
,sum(SoldLY) TotalSoldLY
,sum(LeadsLY) TotalLeadsLY
from historycm ecm
full outer join historylm elm
on elm.entitykey = ecm.entitykey
and elm.sznewused = ecm.sznewused
and elm.szuptype = ecm.szuptype
full outer join historyly ely
on ely.entitykey = ecm.entitykey
and ely.sznewused = ecm.sznewused
and ely.szuptype = ecm.szuptype
join (select e.entitykey, coalesce(EntDealerGEC, entdealerlvl1) EntDealerGEC, case when EntDealerGEC is null then 'Non GEC' else 'GEC' end GEC, e.entregion Region
, e.entstorebrand StoreBrand, case when GECTeam is null then 'Non GEC' else GECTeam end GECTeam
  from sonic_dw.dbo.vw_dim_entitymar e
  left join (
    select EntityKey, cast(AttributeField as varchar(50)) as EntDealerGEC
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECActiveDealerships'
    and IsActive = 1) g
on e.entitykey = g.entitykey
left join (
    select EntityKey, cast(AttributeField as varchar(50)) as GECTeam
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECTeams'
    and IsActive = 1) t
  on e.entitykey = t.entitykey ) z
  on z.entitykey = coalesce(ecm.entitykey, elm.entitykey, ely.entitykey)
group by EntDealerGEC, GEC, Region, GECTeam, StoreBrand,coalesce(ecm.sznewused, elm.sznewused, ely.sznewused)),


BudgetTotals as (
select EntDealerGEC as Dealership, bcm.entitykey, GEC, Region, GECTeam, StoreBrand, coalesce(bcm.NewUsed, blm.NewUsed, bly.NewUsed) NewUsed,sum(BudgetCM) BudgetCM, sum(BudgetLM) BudgetLM, sum(BudgetLY) BudgetLY
from BudgetCM bcm
full outer join BudgetLM blm
on blm.entitykey = bcm.entitykey
and blm.NewUsed = bcm.NewUsed
full outer join BudgetLY bly
on bly.entitykey = bcm.entitykey
and bly.NewUsed = bcm.NewUsed
join (select e.entitykey, coalesce(EntDealerGEC, entdealerlvl1) EntDealerGEC, case when EntDealerGEC is null then 'Non GEC' else 'GEC' end GEC, e.entregion Region
, e.entstorebrand StoreBrand, case when GECTeam is null then 'Non GEC' else GECTeam end GECTeam
  from sonic_dw.dbo.vw_dim_entitymar e
  left join (
    select EntityKey, cast(AttributeField as varchar(50)) as EntDealerGEC
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECActiveDealerships'
    and IsActive = 1) g
on e.entitykey = g.entitykey
left join (
    select EntityKey, cast(AttributeField as varchar(50)) as GECTeam
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECTeams'
    and IsActive = 1) t
  on e.entitykey = t.entitykey ) z
  on z.entitykey = coalesce(bcm.entitykey, blm.entitykey, bly.entitykey)
group by EntDealerGEC, bcm.entitykey, GEC, Region, GECTeam, StoreBrand, coalesce(bcm.NewUsed, blm.NewUsed, bly.NewUsed)),

eleadL2M as (
select EntDealerGEC as Dealership,ecm.entitykey, GEC, Region, GECTeam, StoreBrand, coalesce(ecm.szuptype, elm.szuptype, ely.szuptype)
UpType, coalesce(ecm.sznewused, elm.sznewused, ely.sznewused) NewUsed,SoldCM, LeadsCM, SoldLM, LeadsLM, SoldLY, LeadsLY
from historycm ecm
full outer join historylm elm
on elm.entitykey = ecm.entitykey
and elm.szuptype = ecm.szuptype
and elm.sznewused = ecm.sznewused
full outer join historyly ely
on ely.entitykey = ecm.entitykey
and ely.szuptype = ecm.szuptype
and ely.sznewused = ecm.sznewused
join (select e.entitykey, coalesce(EntDealerGEC, entdealerlvl1) EntDealerGEC, case when EntDealerGEC is null then 'Non GEC' else 'GEC' end GEC, e.entregion Region
, e.entstorebrand StoreBrand, case when GECTeam is null then 'Non GEC' else GECTeam end GECTeam
  from sonic_dw.dbo.vw_dim_entitymar e
  left join (
    select EntityKey, cast(AttributeField as varchar(50)) as EntDealerGEC
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECActiveDealerships'
    and IsActive = 1) g
on e.entitykey = g.entitykey
left join (
    select EntityKey, cast(AttributeField as varchar(50)) as GECTeam
    from sonic_dw.dbo.DimEntityRelationship r
    join sonic_dw.dbo.DimEntityRelationshipType t
     on r.RelationshipTypeGuid = t.RelationshipTypeGuid
    where RelationshipType = 'GECTeams'
    and IsActive = 1) t
  on e.entitykey = t.entitykey ) z
  on z.entitykey = coalesce(ecm.entitykey, elm.entitykey, ely.entitykey)),


----------------------------------------------------------------------------------------------------------





/*-------------------------------------------------------------
STEP 3: Summary Table

Shows all of the individual data points and the totals
--------------------------------------------------------------*/
results as(
select e.Dealership, e.GEC, e.entitykey,e.Region, e.GECTeam, e.StoreBrand
, e.uptype, e.NewUsed, SoldCM, LeadsCM, SoldLM, LeadsLM, SoldLY, LeadsLY
, s.TotalLeadsCM, s.TotalLeadsLM, s.TotalLeadsLY, s.TotalSoldCM, s.TotalSoldLM, s.TotalSoldLY, b.BudgetCM, b.BudgetLM, b.BudgetLY
, SoldCM*1.00/nullif(LeadsCM,0) as CloseRateCM, SoldLM*1.00/nullif(LeadsLM,0) as CloseRateLM, SoldLY*1.00/nullif(LeadsLY,0) as CloseRateLY
, SoldCM*1.00/nullif(TotalSoldCM,0) as SalesByCM, SoldLM*1.00/nullif(TotalSoldLM,0) as SalesByLM, SoldLY*1.00/nullif(TotalSoldLY,0) as SalesByLY
, LeadsCM*1.00/nullif(TotalLeadsCM,0) as ChannelsByCM, LeadsLM*1.00/nullif(TotalLeadsLM,0) as ChannelsByLM, LeadsLY*1.00/nullif(TotalLeadsLY,0) as ChannelsByLY
, round(BudgetCM*(SoldCM*1.00/nullif(TotalSoldCM,0)),0) as TargetCM, round(BudgetLM*(SoldLM*1.00/nullif(TotalSoldLM,0)),0) as TargetLM, round(BudgetLY*(SoldLY*1.00/nullif(TotalSoldLY,0)),0) as TargetLY
, row_number() over(partition by e.Dealership, e.newused order by SoldCM*1.00/nullif(TotalSoldCM,0) desc) RN_CM
, row_number() over(partition by e.Dealership, e.newused order by SoldLM*1.00/nullif(TotalSoldLM,0) desc) RN_LM
, row_number() over(partition by e.Dealership, e.newused order by SoldLY*1.00/nullif(TotalSoldLY,0) desc) RN_LY
from BudgetTotals b
join eleadL2M e
on e.Dealership = b.Dealership and e.entitykey=b.entitykey
and e.NewUsed = b.NewUsed
join eLeadL2MSummary s
on e.Dealership = s.Dealership
and e.NewUsed = s.NewUsed),



/*
Rounding Logic - take/add difference to the largest sales by % (minimal impact on the overall numbers).
*/

diff as(
select dealership, newused
, max(budgetCM) BudgetCM, sum(targetCM) as TargetCM, max(budgetCM)-sum(targetCM) DiffCM
, max(budgetLM) BudgetLM, sum(targetLM) as TargetLM, max(budgetLM)-sum(targetLM) DiffLM
, max(budgetLY) BudgetLY, sum(targetLY) as TargetLY, max(budgetLY)-sum(targetLY) DiffLY
from results r
group by dealership, newused
having max(budgetCM)-sum(targetCM)<>0
or max(budgetLM)-sum(targetLM)<>0
or max(budgetLY)-sum(targetLY)<>0),

final as(
select r.dealership, GEC, entitykey, Region, GECTeam, StoreBrand,case when r.uptype = 'Showroom Up' then 'Walk In' when r.UpType = 'Internet Up' then 'Internet' when r.UpType = 'Phone Up' then 'Phone' else r.UpType end Uptype
, case when r.newused = 'N' then 'New' else 'Used' end NewUsed, r.TotalLeadsCM, r.TotalLeadsLM, r.TotalLeadsLY, r.TotalSoldCM, r.TotalSoldLM, r.TotalSoldLY, r.BudgetCM, r.BudgetLM, r.BudgetLY
, r.CloseRateCM, r.CloseRateLM, r.CloseRateLY, r.SalesByCM, r.SalesByLM, r.SalesByLY, r.ChannelsByCM, r.ChannelsByLM, r.ChannelsByLY, LeadsCM, LeadsLM, LeadsLY
,case when rn_cm=1 then r.targetcm+coalesce(d.DiffCM,0) else r.targetcm end as TargetCM
,case when rn_lm=1 then r.targetlm+coalesce(d.DiffLM,0) else r.targetlm end as TargetLM
,case when rn_ly=1 then r.targetly+coalesce(d.DiffLY,0) else r.targetly end as TargetLY
from results r
left join diff d
on r.Dealership = d.Dealership
and r.NewUsed = d.NewUsed)

select entitykey, dealership,region,storebrand,uptype,newused, 'Unknown'  LeadProvider,'Unknown'Make,'Unknown'Model,
concat(year(dateadd(day,-1,getdate())),case when month(dateadd(day,-1,getdate()))<10 then 0 else null end,
month(dateadd(day,-1,getdate())))FiscalMonthKey, day(eomonth(getdate()))daysinmonth
,round(TargetCM/nullif(CloseRateCM,0),0) LeadsTargetCM
,round(TargetLM/nullif(CloseRateLM,0),0) LeadsTargetLM
,round(TargetLY/nullif(CloseRateLY,0),0) LeadsTargetLY
from final f



------Data Validation  - should return no records
--select dealership, newused
--, max(budgetCM) BudgetCM, sum(targetCM) as TargetCM, max(budgetCM)-sum(targetCM) DiffCM
--, max(budgetLM) BudgetLM, sum(targetLM) as TargetLM, max(budgetLM)-sum(targetLM) DiffLM
--, max(budgetLY) BudgetLY, sum(targetLY) as TargetLY, max(budgetLY)-sum(targetLY) DiffLY
--from final f
--group by dealership, newused
--having max(budgetCM)-sum(targetCM)<>0
--or max(budgetLM)-sum(targetLM)<>0
--or max(budgetLY)-sum(targetLY)<>0

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
