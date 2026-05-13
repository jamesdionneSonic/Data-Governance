---
name: vwFloorPlanCIT
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
column_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                 | Type    | Nullable | Description |
| -------------------- | ------- | -------- | ----------- |
| `CalendarYearMonth`  | char    |          |             |
| `CIT_Balance`        | money   | ✓        |             |
| `Control`            | varchar |          |             |
| `Control2`           | varchar | ✓        |             |
| `ControlDesc`        | varchar | ✓        |             |
| `EntCora_Account_ID` | int     | ✓        |             |
| `SaleDateCIT`        | date    | ✓        |             |
| `FundedAmt`          | money   | ✓        |             |
| `FundedDate`         | date    | ✓        |             |
| `FundedDate_Min`     | date    | ✓        |             |
| `CFT`                | int     | ✓        |             |

## Definition

```sql



CREATE view [dbo].[vwFloorPlanCIT] as


/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/
SELECT	CalendarYearMonth,
		SUM(ISNULL(PostingAmt,0)) AS CIT_Balance,
		Control,
		MAX(Control2) AS Control2,
		MAX(ControlDesc) AS ControlDesc,
		EntCora_Account_ID,
        --EntADPCompanyID, --raj remove
        --entitykey, --raj remove
        MIN(SaleDateCIT) AS SaleDateCIT,
        MAX(CASE WHEN rn_credit = 1 THEN ISNULL(postingamt,0) ELSE NULL END) AS FundedAmt,
		MAX(CASE WHEN rn_credit = 1 THEN accountingdate ELSE NULL END) AS FundedDate, --picks the date of the largest credit amt
        MIN(CASE WHEN RN_credit > 0 THEN accountingdate ELSE NULL END) AS FundedDate_Min, --picks the min date of the credit amts lesl than -1000
        DATEDIFF(dd, MIN(SaleDateCIT), MAX(CASE WHEN rn_credit=1 THEN accountingdate ELSE NULL END)) AS CFT
FROM	(
		SELECT	CASE WHEN f.postingamt<-3000 THEN ROW_NUMBER() OVER(PARTITION BY cm.CalendarYearMonth,e.EntCora_Account_ID
		--, e.EntADPCompanyID --Raj remove
		, d.Control
		ORDER BY CASE WHEN ic.InterfaceCode IN('REV', 'ADJ') THEN 1 ELSE 0 END,  f.PostingAmt ASC)
					 ELSE 0 END AS RN_credit,
		        RANK() OVER(PARTITION BY EntCora_Account_ID
						--, e.EntADPCompanyID --Raj remove
						, d.Control ORDER BY  cm.fulldate desc) AS month_rank,
				cm.CalendarYearMonth,
				d.Control,
		        d.control2,
				d.ControlDesc,
				e.EntCora_Account_ID,
		  --      e.EntADPCompanyID, --raj remove
				--f.entitykey, --raj remove
				ic.InterfaceCode,
		        --ic.InterfaceDescription,
		        t.FullDate AS SaleDateCIT,
				--t.FiscalYearMonth AS SaleMonthCIT,
		        ad.FullDate AS accountingdate,
				f.postingamt
		FROM	Sonic_DW.dbo.fact_glschedule f
				inner JOIN sonic_Dw.dbo.dim_glschedule_degen d ON f.GLSchedDegenKey=d.GLSchedDegenKey
				inner JOIN sonic_Dw.dbo.dim_account a ON f.accountkey=a.accountkey
		        inner JOIN sonic_dw.dbo.dim_date t ON f.doosikey=t.datekey
				inner JOIN sonic_dw.dbo.dim_date ad ON f.AccountingDateKey=ad.datekey
		        inner JOIN sonic_dw.dbo.dim_date cm ON f.CurrentMonthKey=cm.datekey
				inner JOIN Sonic_DW.dbo.dim_interfacecode ic ON f.DimInterfaceCodeID=ic.DimInterfaceCodeID
				inner JOIN Sonic_DW.dbo.Dim_Entity e ON f.entitykey = e.entitykey --raj add join
				--raj remove below join
				--inner JOIN (
				--	select	e.entityKey, e.EntADPCompanyID, e.EntCora_Account_ID
				--	from	Sonic_DW.dbo.Dim_Entity e
				--			inner join Sonic_DW.dbo.DimEntityRelationship r on e.entitykey = r.EntityKey
				--			inner join Sonic_DW.dbo.DimEntityRelationshipType t on r.relationshiptypeguid = t.RelationshipTypeGuid
				--	where	relationshiptype in ('Syndicate')
				--			and isactive = 1
				--	group by e.entityKey, e.EntADPCompanyID, e.EntCora_Account_ID
				--	) e ON f.entitykey=e.entitykey
		WHERE	cm.fulldate IN (DATEADD(DAY, 1, EOMONTH(GETDATE(), -1)), DATEADD(DAY, 1, EOMONTH(GETDATE(), -2)))
				AND a.AccAccount IN ('2030', '2031')
				and e.entactive = 'active' --Raj add
				and e.EntEntityType = 'Dealership'  --Raj add
				and e.entadpcompanyid <> '470'  --Raj add
		) c
WHERE  c.month_rank=1

GROUP BY c.EntCora_Account_ID
--, c.EntADPCompanyID, c.entitykey --raj remove
, c.CalendarYearMonth, c.Control
;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
