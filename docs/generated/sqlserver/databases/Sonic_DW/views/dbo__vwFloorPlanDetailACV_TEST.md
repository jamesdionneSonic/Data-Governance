---
name: vwFloorPlanDetailACV_TEST
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



CREATE view [dbo].[vwFloorPlanDetailACV_TEST] as

/********************************************************************************************/
/* Author: Lindsay DePree  Date: 2020-05-21  Comments: Intial Creation   */
/* Modified: Rajamani Bandi  Date: 2020-06-01  Comments: Updates      */
/********************************************************************************************/


/* Inventory Schedule Data with ACV Logic */
select AccountingDate
  , CDK_Box
  , EntADPCompanyID, EntCora_Account_ID, EntDealerLvl0, EntDealerLvl1, EntityKey, EntLineOfBusiness
  , CalendarYearMonth
  , [Control], Control2, ControlDesc
  , DetailDescription, Debit_Flag, DocDescription, DoosiDate
  , InterfaceCode, InterfaceRank, InvAccount, InvControlBalance, InvReferBalance
  , Journal, JournalName, JournalRank, JournalType
  , Prefix, PostingAmt
  , Refer
  , ServiceAmt, StockType
  , RN_detail
  , case when debit_flag = 1 then row_number() over (partition by EntCora_Account_ID,EntADPCompanyID,Control order by debit_flag desc, journalrank, InterfaceRank, RN_detail)
      else 0 end as RN_ACV
from (
  select ad.FullDate as accountingdate
    , e.CDK_Box
    , e.EntADPCompanyID
    , e.EntCora_Account_ID
    , e.entdealerlvl0
    , e.entdealerlvl1
    , e.entitykey
    , e.EntLineOfBusiness
    , cm.CalendarYearMonth
    , d.Control
    , d.control2
    , d.ControlDesc
    , d.detaildescription
    , case when f.postingamt > 0 and ic.InterfaceCode NOT IN ('SV','PT') then 1 else 0 end Debit_Flag
    , d.docdescription
    , t.FullDate as DoosiDate
    , ic.InterfaceCode
    , case when ic.InterfaceCode IN ('FI','CP','GL','ADJ','REV') then 1 -- Raj add to Rank 1 20200601
        when ic.InterfaceCode IN ('CRE','OAP','ODC') then 3
        when ic.InterfaceCode IN ('SV','PT') then 99
        else 4 end as InterfaceRank
    , a.accaccount as InvAccount
    , sum(ISNULL(f.postingamt,0)) over (partition by e.EntCora_Account_ID,e.EntADPCompanyID,d.Control ) as InvControlBalance
    , sum(ISNULL(f.postingamt,0)) over (partition by e.EntCora_Account_ID,e.EntADPCompanyID,d.Control,d.refer ) as InvReferBalance
    , j.JrnJournalid as Journal
    , j.JrnJournalName as JournalName
    , case when ic.InterfaceCode IN ('SV','PT') or j.JrnJournalid IN ('30','31','32','34','35') then 99
        when j.JrnJournalid IN ('70','72','73','10','13','14','15','17','20','23','25') then 1 -- Raj add to Rank 1 20200601
        else 3 end as JournalRank
    , j.jrnjournaltype as JournalType
    , a.accprefix as Prefix
    , ISNULL(f.postingamt,0) as PostingAmt
    , d.refer
    , sum(case when j.JrnJournalid IN ('31','32','33','34') or ic.InterfaceCode IN ('SV','PT') then f.postingamt else 0 end)
      over (partition by e.EntCora_Account_ID,e.EntADPCompanyID,d.Control ) as ServiceAmt
    , case when a.accaccount IN ('2300','2320','2340','2341','2342') then 'New'
        when a.accaccount IN ('2400','2401','2402','2403','2404','2405') then 'Used'
        when a.accaccount IN ('2605','2606') then 'Loaner'
        else null end as StockType
    ,row_number() over (partition by e.EntCora_Account_ID,e.EntADPCompanyID,d.Control order by f.PostingAmt desc, ad.FullDate desc ) as RN_detail
  from Sonic_DW.dbo.fact_glschedule f
    inner join sonic_Dw.dbo.dim_glschedule_degen d on f.GLSchedDegenKey = d.GLSchedDegenKey
    inner join Sonic_DW.dbo.dim_journal j on f.journalkey = j.journalkey
    inner join Sonic_DW.dbo.dim_interfacecode ic on f.DimInterfaceCodeID = ic.DimInterfaceCodeID
    inner join sonic_Dw.dbo.dim_account a on f.accountkey = a.accountkey
    --inner join sonic_dw.dbo.dim_entity e on f.entitykey = e.entitykey jo removed 20200601
    inner join sonic_dw.dbo.dim_date t on f.doosikey = t.datekey
    inner join sonic_dw.dbo.dim_date ad on f.AccountingDateKey = ad.datekey
    inner join sonic_dw.dbo.dim_date cm on f.CurrentMonthKey = cm.datekey
    inner JOIN (
       select de.EntADPCompanyID, de.EntCora_Account_ID, de.EntDMSservername as CDK_Box
         , de.entdealerlvl0, de.entdealerlvl1, de.entitykey, de.EntLineOfBusiness
       from dbo.dim_entity de
         inner join dbo.DimEntityRelationship rel on de.EntityKey = rel.EntityKey
         inner join dbo.DimEntityRelationshipType typ on rel.RelationshipTypeGuid = typ.RelationshipTypeGuid
       where rel.IsActive = 1   and de.EntityKey=673
         and typ.RelationshipType = 'Syndicate'
       group by de.EntADPCompanyID, de.EntCora_Account_ID, de.EntDMSservername
         , de.entdealerlvl0, de.entdealerlvl1, de.entitykey, de.EntLineOfBusiness

       ) e ON f.entitykey = e.entitykey --Raj add 20200601
  where --e.entactive = 'active' Raj remove 20200601
    --and e.entadpcompanyid IN (
    --  '102','105','108','110','129','130','143','144','146','149','154','166','171','173'
    -- ,'201','202','203','211','226','230','231','234','238','239','241','245','252','253','254','255'
    -- ,'302','304'
    -- ,'401','403','410','411','412','413','420','423','432','433','434'
    -- ,'800','810','820','830','840','854','870'
    -- )   Raj remove 20200601
    --and e.EntEntityType = 'Dealership' Raj remove 20200601
    cm.fulldate = DATEADD(DAY, 1, EOMONTH(getdate(), -1))
    and a.AccAccount IN ('2400','2401','2402','2403','2404','2405','2300','2320','2340','2341','2342') --Raj. these were filtered to just used before. Please change to this in clause 20210414
    ---('2400','2401','2402','2403','2404','2405') old
  ) tbl
where InvControlBalance != 0
;




```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
