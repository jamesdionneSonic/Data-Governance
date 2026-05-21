---
name: uspFloorPlanPayoff
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql


CREATE procedure [dbo].[uspFloorPlanPayoff] (
      @insertedRowCnt INT OUTPUT
       ) as


/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified: Keveana Carter		Date: 2020-05-22		Comments: Automate for ETL			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/

drop table if exists #FloorPlanPayoffs;
drop table if exists #FloorPlanDates;

SELECT	f.Account,
		f.CDK_Box,c.CIT_Balance,
		CASE WHEN c.fundeddate IS NOT NULL THEN COUNT(*) OVER(PARTITION BY s.custno, f.EntADPCompanyID) ELSE NULL END AS CIT_DealCount,
		f.EntADPCompanyID AS CompanyID, s.contractdate,f.Control, s.custno, s.CustomerName,
		f.EntDealerlvl0 AS Dealership, s.dealno, s.DealStatus, s.dealtype,
		CASE WHEN s.saletype='Cash' THEN DATEADD(day, 5, s.contractdate)
			 WHEN s.saletype IN('Lease', 'Finance') AND c.FundedDate_Min IS NOT NULL
				THEN CASE WHEN DATEADD(day, 5, c.FundedDate_Min)>DATEADD(day, 15, s.contractdate) THEN DATEADD(day, 15, s.contractdate) ELSE DATEADD(day, 5, c.FundedDate_Min) END
             ELSE DATEADD(day, 15, s.contractdate) END duedate,
		f.EntCora_Account_ID,
		f.entitykey,
		s.financesource, f.FloorplanBalance,
		case when (isnull(i.inventorybalance,0) < 2000 and floorplanbalance < 0 and ((s.dealno is null or (s.DealStatus = 'F' and isnull(i.inventorybalance,0)>=2000)))) then 'YES'
			 else 'NO' end  as FPnoINV,
		f.accountnumber AS FullAccount,
		CASE WHEN s.saletype='Cash' THEN NULL ELSE c.FundedAmt END AS FundedAmt,
		CASE WHEN s.saletype='Cash' THEN NULL ELSE c.FundedDate_Min END AS fundeddate,
		isnull(i.InventoryBalance,0) as InventoryBalance,
	    s.make, s.model, s.modelyear,
	---	case when (s.dealno is null or (s.DealStatus = 'F' and isnull(inventorybalance,0)>=2000)) then 'NO' else 'YES' end as SaleMatch,
		case when (s.dealno is null or (s.DealStatus = 'F' AND s.dealtype = 'IC SisterStore' and isnull(inventorybalance,0)>=2000)) then 'NO' else 'YES' end as SaleMatch, --- added raj/adam - 06/01/2022
		s.saletype, f.ScheduleMonth,
		CASE WHEN f.account IN('3306', '3307') THEN 'Used'
             WHEN f.account IN('3300', '3301', '3303') THEN 'New'
             WHEN f.account IN('3405') THEN 'Loaner' END AS StockType,
	    s.vin
into	#floorplanpayoffs
FROM   dbo.vwFloorPlanPayoffBalance f
		LEFT JOIN etl_staging.wrk.FloorPlanPayoffSales s
			ON f.EntCora_Account_ID = s.related_acctg_cora_acct_id AND f.control = s.stockno AND LEFT(CONVERT(INT, CONVERT(CHAR(8), f.AgeDate, 112)), 6)-1 <= s.SalesBufferDate --with 1 month buffer
        LEFT JOIN dbo.vwFloorPlanCIT c
		--ON f.EntADPCompanyID=c.EntADPCompanyID --raj remove
		ON f.EntCora_Account_ID=c.EntCora_Account_ID --raj add
		AND s.Custno=c.Control
		LEFT JOIN dbo.vwFloorPlanInventory i on f.EntCora_Account_ID = i.EntCora_Account_ID and f.EntADPCompanyID = i.EntADPCompanyID and f.[Control] = i.Control
WHERE	f.ControlBalance <> 0
;

with
weekdays AS (
	SELECT	ROW_NUMBER() OVER( ORDER BY datekey) AS RN, dd.DateKey, dd.FullDate, dd.IsBankHoliday, dd.IsWeekend
	FROM	Sonic_DW.dbo.Dim_Date dd
    WHERE	dd.IsWeekend = 'N'
			AND dd.IsBankHoliday = 'N'
            AND dd.FullDate BETWEEN (SELECT	CAST(DATEADD(dd, -30, MIN(i.contractdate)) AS DATE) FROM #floorplanpayoffs i)
									AND
									(SELECT	CAST(DATEADD(dd, 30, MAX(i.contractdate)) AS DATE) FROM #floorplanpayoffs i)
	),
holidays AS (
	SELECT	ROW_NUMBER() OVER( ORDER BY datekey) AS RN, dd.DateKey, dd.FullDate, dd.IsBankHoliday, dd.IsWeekend
    FROM	Sonic_DW.dbo.Dim_Date dd
    WHERE   (dd.IsWeekend='Y' OR dd.IsBankHoliday='Y')
            AND dd.FullDate BETWEEN (SELECT CAST(DATEADD(dd, -30, MIN(i.contractdate)) AS DATE) FROM #floorplanpayoffs i)
									AND
									(SELECT CAST(DATEADD(dd, 30, MAX(i.contractdate)) AS DATE) FROM #floorplanpayoffs i)
	)
SELECT	b.RN AS RN_Old, b.FullDate AS Old_Date, b.IsBankHoliday, a.RN AS RN_New, a.FullDate AS New_Date, b.IsWeekend
into	#FloorPlanDates
FROM    holidays b
	    OUTER APPLY (
			SELECT	TOP 1 a.RN, a.FullDate
			FROM	weekdays a
            WHERE	a.FullDate = DATEADD(dd, -1, b.fulldate)
	                OR a.FullDate = DATEADD(dd, -2, b.fulldate)
		            OR a.FullDate = DATEADD(dd, -3, b.fulldate)
			        OR a.FullDate = DATEADD(dd, -4, b.fulldate)
				    OR a.FullDate = DATEADD(dd, -5, b.fulldate)
            ORDER BY a.rn DESC
		        ) a
				;



insert into [dbo].[Syndicate_Floorplan_Payoff] (
	Account,
	CDK_Box, CIT_Balance, CIT_DealCount, CompanyID, contractdate, Control, CustomerName, custno,
	days_until_due,
	Dealership, dealno, DealStatus, DealType,
	duedate,
	duedate_old,
	entitykey,
	financesource, FloorplanBalance, FPnoINV, FullAccount, FundedAmt, fundeddate,
	InventoryBalance,
    make, model, modelyear,
	salematch, saletype, ScheduleMonth,
	StockType,
	vin,
	Payoff_File_Loadflag, TRN_File_Loadflag, Meta_LoadDate
)
SELECT	i.Account,
		i.CDK_Box, i.CIT_Balance, i.CIT_DealCount, i.CompanyID,	i.contractdate, i.Control, i.CustomerName, i.custno,
		isnull(DATEDIFF(dd, GETDATE(), ISNULL(d.New_Date, i.duedate))
				,datediff(dd,convert(date,getdate()),dateadd(dd,-1,convert(date,getdate())))) AS days_until_due,
		i.Dealership, i.dealno,	i.DealStatus, i.DealType,
		ISNULL(ISNULL(d.New_Date, i.duedate), dateadd(dd,-1,convert(date,getdate()))) as duedate,
		convert(date,i.duedate) AS duedate_old,
		i.entitykey,
		i.financesource, i.FloorplanBalance, i.FPnoINV,i.FullAccount, i.FundedAmt, i.fundeddate,
		i.InventoryBalance,
        isnull(i.make, iv.makename) as make ,  isnull(i.model, iv.modelname) as model ,  isnull(i.modelyear, iv.year) as modelyear,
		i.salematch, i.saletype, i.ScheduleMonth, i.StockType,
		isnull(i.vin, iv.vin) as vin
		, 1 as Payoff_File_Loadflag, 0 as TRN_File_Loadflag, getdate() as Meta_LoadDate
FROM	#FloorPlanPayoffs i
		inner join (
			select	r.EntityKey, convert(varchar,r.AttributeField) as StockType
			from	Sonic_DW.dbo.DimEntityRelationship r
					inner join .Sonic_DW.dbo.DimEntityRelationshipType t on r.relationshiptypeguid = t.RelationshipTypeGuid
			where	relationshiptype in ('Syndicate')
					and r.isactive = 1
			) e
			ON i.entitykey=e.entitykey
			and i.StockType = e.StockType
		LEFT JOIN #FloorPlanDates d ON CAST(i.duedate AS DATE) = d.Old_Date
		left join ETL_Staging.wrk.FloorPlanInventoryVehicle iv
			on i.EntCora_Account_ID = iv.cora_acct_id
			and i.Control = iv.stockno
			and i.vin is null
WHERE	i.SaleMatch = 'YES' or i.FPnoINV = 'YES'
;



/* insert count */
SELECT	@insertedRowCnt = @@rowcount;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
