---
name: vwFloorPlanBalance
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


----drop view if exists dbo.vwFloorPlanBalance;
----go


create view [dbo].[vwFloorPlanBalance] as


/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/


select	e.EntCora_Account_ID
		,e.EntADPCompanyID
		,d.[Control]
		,sum(ISNULL(f.Amount,0)) as FloorplanBalance
FROM	Sonic_DW.dbo.Fact_GLScheduleSummary f
		inner join Sonic_DW.dbo.Dim_GLScheduleSummary_degen d on f.GLSchedSumDegenKey = d.GLSchedSumDegenKey
		inner join sonic_Dw.dbo.dim_account a on f.accountkey = a.accountkey
		inner join sonic_dw.dbo.dim_entity e on f.entitykey = e.entitykey
		inner join sonic_dw.dbo.dim_date cm on f.currentmonthkey = cm.datekey
where	e.entactive = 'active'
		and e.EntEntityType = 'Dealership'
		and e.entadpcompanyid <> '470'
		and cm.fulldate = DATEADD(DAY, 1, EOMONTH(getdate(), -1))
		and a.AccAccount IN (
				 '3306','3307'--used
				,'3300','3301','3303'--new
				,'3405' --loaner
				)
group by e.EntCora_Account_ID
		,e.EntADPCompanyID
		,d.[Control]
having sum(ISNULL(f.Amount,0)) <> 0
;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
