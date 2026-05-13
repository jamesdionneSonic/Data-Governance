---
name: vwFloorPlanInventory
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


create view [dbo].[vwFloorPlanInventory] as



/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/


select	e.EntCora_Account_ID
		,e.EntADPCompanyID
		,d.Control
		,max(ad.fulldate) as AccountingDate_max
		,min(f.DoosiKey) as StockInDate
		,sum(ISNULL(f.PostingAmt,0)) as InventoryBalance
FROM	Sonic_DW.dbo.fact_glschedule f
		inner JOIN sonic_Dw.dbo.dim_glschedule_degen d ON f.GLSchedDegenKey=d.GLSchedDegenKey
		inner JOIN sonic_Dw.dbo.dim_account a ON f.accountkey=a.accountkey
		inner JOIN sonic_dw.dbo.dim_entity e ON f.entitykey=e.entitykey
		inner JOIN sonic_dw.dbo.dim_date t ON f.doosikey=t.datekey
		inner JOIN sonic_dw.dbo.dim_date ad ON f.AccountingDateKey=ad.datekey
		inner JOIN sonic_dw.dbo.dim_date cm ON f.CurrentMonthKey=cm.datekey
		inner JOIN Sonic_DW.dbo.dim_interfacecode ic ON f.DimInterfaceCodeID=ic.DimInterfaceCodeID
WHERE	e.entactive = 'active'
		AND cm.fulldate=DATEADD(DAY, 1, EOMONTH(GETDATE(), -1))
		and a.AccAccount IN ('2400','2401','2402','2403','2404','2405'--used inv
					 ,'2300','2320','2340','2341','2342'--new inv
					 ,'2605','2606' --loaner
					 )
GROUP BY e.EntADPCompanyID, e.EntCora_Account_ID ,d.Control
;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
