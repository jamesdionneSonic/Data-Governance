---
name: vwFloorPlanPayoffBalance
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


create view [dbo].[vwFloorPlanPayoffBalance] as



/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/

SELECT	a.accaccount as Account,
        a.AccAccountNumber as AccountNumber,
		MIN(dd.FullDate) AS AgeDate,
		MAX(e.entDMSservername) AS CDK_Box,
		d.Control,
		SUM(f.Amount) OVER(PARTITION BY e.EntCora_Account_ID, e.EntADPCompanyID, d.Control) AS ControlBalance,
        COUNT(*) OVER(PARTITION BY e.EntCora_Account_ID, e.EntADPCompanyID, d.Control) AS ControlCount,
        e.EntADPCompanyID,
		e.EntCora_Account_ID,
		e.EntDealerLvl0,
        f.entitykey,
        SUM(f.Amount) AS FloorplanBalance,
        cm.FullDate AS ScheduleMonth,
        ROW_NUMBER() OVER(PARTITION BY e.EntCora_Account_ID, e.EntADPCompanyID, d.Control ORDER BY cm.FullDate DESC) AS RN
FROM	Sonic_DW.dbo.Fact_GLScheduleSummary f
		INNER JOIN Sonic_DW.dbo.Dim_GLScheduleSummary_degen d ON f.GLSchedSumDegenKey=d.GLSchedSumDegenKey
        INNER JOIN sonic_Dw.dbo.dim_account a ON f.accountkey=a.accountkey
        INNER JOIN sonic_dw.dbo.dim_date cm ON f.currentmonthkey=cm.datekey
        INNER JOIN sonic_dw.dbo.dim_date dd ON f.DoosiKey=dd.datekey
		INNER JOIN (
				select	e.EntityKey, e.EntADPCompanyID, e.EntCora_Account_ID, e.EntDealerLvl0, e.EntDMSServerName
				from	Sonic_DW.dbo.Dim_Entity e
						inner join Sonic_DW.dbo.DimEntityRelationship r on e.entitykey = r.EntityKey
						inner join Sonic_DW.dbo.DimEntityRelationshipType t on r.relationshiptypeguid = t.RelationshipTypeGuid
				where	relationshiptype in ('Syndicate')
						and   isactive = 1
				group by e.EntityKey, e.EntADPCompanyID, e.EntCora_Account_ID, e.EntDealerLvl0, e.EntDMSServerName
					) e ON f.entitykey = e.entitykey
WHERE	cm.fulldate=DATEADD(DAY, 1, EOMONTH(GETDATE(), -1))
        AND a.AccAccount IN (
							'3306', '3307', --used
							'3300', '3301', '3303', --new
							'3405'--loaner
							)
GROUP BY e.EntCora_Account_ID, e.EntADPCompanyID, e.EntDealerLvl0, cm.FullDate, f.entitykey, d.Control, a.accaccount, a.AccAccountNumber, f.Amount;
;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
