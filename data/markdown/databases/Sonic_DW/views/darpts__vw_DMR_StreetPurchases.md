---
name: vw_DMR_StreetPurchases
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 4
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_GLSchedule_degen** (U )

## Definition

```sql
create view  DMR_StreetPurchases as

SELECT distinct a.AccAccount
,e.EntityKey
	  ,e.EntDealerLvl1
      ,Control
      ,DoosiKey
	  ,case when DoosiKey between  CAST(FORMAT(DATEADD(MONTH, -2, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)), 'yyyyMMdd') AS INT)
	  and  CAST(FORMAT(EOMONTH(GETDATE(), -2), 'yyyyMMdd') AS INT) then 'Two Months Ago'
	  when DoosiKey between CAST(FORMAT(DATEADD(MONTH, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)), 'yyyyMMdd') AS INT) and
	 CAST(FORMAT(EOMONTH(GETDATE(), -1), 'yyyyMMdd') AS INT) then 'Last Month' else 'Current Month' end as Record_Month
      ,EntEssCode
      ,EntCora_Account_ID
  FROM [Sonic_DW].[dbo].[Fact_GLSchedule] s
  inner join dim_entity e
  on s.EntityKey = e.entitykey
  inner join Dim_Account a
  on s.AccountKey = a.AccountKey
  inner join dim_GLSchedule_degen sd
  on s.GLSchedDegenKey = sd.GLSchedDegenKey
	inner join dim_date d
on s.doosikey = d.datekey
  where
doosikey between
CAST(FORMAT(DATEADD(MONTH, -2, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)), 'yyyyMMdd') AS INT) and  CAST(FORMAT(getdate()-1, 'yyyyMMdd') AS INT)
   and AccAccount in ('2300','2320','2340','2341'
	,'2400','2401','2402','2403','2404','2405')
  and EntADPCompanyID <> '170'
and Control like 'C%'
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
