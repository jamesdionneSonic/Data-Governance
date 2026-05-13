---
name: vwTitleGLSchedule_bk
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `entitykey`           | int     |          |             |
| `EntCora_Account_ID`  | int     | ✓        |             |
| `EntADPCompanyID`     | varchar | ✓        |             |
| `EntAccountingPrefix` | char    | ✓        |             |
| `EntDealerLvl1`       | varchar | ✓        |             |
| `EntBrand`            | varchar | ✓        |             |
| `EntRegion`           | varchar | ✓        |             |
| `entlineofbusiness`   | varchar | ✓        |             |
| `currentmonthkey`     | int     |          |             |
| `CurrentMonth`        | date    |          |             |
| `Stockno`             | varchar |          |             |
| `ControlDesc`         | varchar | ✓        |             |
| `AgeDate`             | date    | ✓        |             |
| `MaxAccountingDate`   | date    | ✓        |             |
| `MaxPostingDate`      | date    | ✓        |             |
| `Balance`             | money   | ✓        |             |
| `Units`               | int     |          |             |

## Definition

```sql








CREATE VIEW [dbo].[vwTitleGLSchedule_bk]
AS
SELECT
 s.entitykey
,e.EntCora_Account_ID
,e.EntADPCompanyID
,e.EntAccountingPrefix
,e.EntDealerLvl1
,e.EntBrand
,e.EntRegion
,e.entlineofbusiness
,currentmonthkey
,cm.fulldate as CurrentMonth
,Control as Stockno
,MIN(ControlDesc) as ControlDesc
,min(dk.Fulldate) as AgeDate
,max(ad.fulldate) as MaxAccountingDate
,max(pd.fulldate) as MaxPostingDate
,SUM(PostingAmt) as Balance
,1 as Units
FROM Sonic_DW.dbo.Fact_GLSchedule s
inner join Sonic_DW.dbo.dim_entity e
       on s.EntityKey = e.entitykey
inner join Sonic_DW.dbo.Dim_Account a
       on s.AccountKey = a.AccountKey
inner join Sonic_DW.dbo.[Dim_GLSchedule_degen] sd
       on s.[GLSchedDegenKey] = sd.[GLSchedDegenKey]
inner join Sonic_DW.dbo.Dim_Date ad
       on s.accountingdatekey = ad.datekey
inner join Sonic_DW.dbo.Dim_Date pd
on s.postingdatekey = pd.datekey
inner join Sonic_DW.dbo.Dim_Date dk
       on s.doosikey = dk.datekey
inner join Sonic_DW.dbo.Dim_Date cm
       on s.currentmonthkey = cm.datekey
WHERE

 --CurrentMonthKey between 20200601 and 20200701
 CurrentMonthKey between CONVERT(char(8), DATEADD(DAY,1,EOMONTH(DATEADD(mm,-1,getdate()),-1)), 112) and  CONVERT(char(8), DATEADD(DAY,1,EOMONTH(DATEADD(mm,0,getdate()),-1)),112)
and AccAccount in ('2400', '2401', '2402', '2403', '2404', '2405','2320','2340','2605')
and e.entcoatype = 'Dealership'
and e.entActive = 'Active'
and e.entdealerlvl1 <> 'Central Buying Solution'------- fillter out in the report
GROUP BY s.entitykey
       ,e.EntCora_Account_ID
	   ,e.EntADPCompanyID
       ,e.EntAccountingPrefix
       ,e.EntDealerLvl1
       ,Control
       ,e.EntBrand
       ,e.EntRegion
       ,currentmonthkey
	   ,cm.fulldate
	   ,e.entlineofbusiness
--ORDER BY EntCora_Account_ID, Control



--select CONVERT(char(8), DATEADD(DAY,1,EOMONTH(DATEADD(mm,-1,getdate()),-1)), 112)
--select CONVERT(char(8), DATEADD(DAY,1,EOMONTH(DATEADD(mm,0,getdate()),-1)),112)







```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
