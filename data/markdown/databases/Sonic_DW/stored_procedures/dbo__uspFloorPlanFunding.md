---
name: uspFloorPlanFunding
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Syndicate_Floorplan_Funding
  - vwFloorPlanBalance
  - vwFloorPlanDetailACV
dependency_count: 3
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Syndicate_Floorplan_Funding** (U )
- **dbo.vwFloorPlanBalance** (V )
- **dbo.vwFloorPlanDetailACV** (V )

## Parameters

| Name              | Type | Output | Default |
| ----------------- | ---- | ------ | ------- |
| `@insertedRowCnt` | int  | Yes    | No      |

## Definition

```sql



CREATE procedure [dbo].[uspFloorPlanFunding] (
       @insertedRowCnt INT OUTPUT
       ) as

/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2020-05-21		Comments: Intial Creation			*/
/* Modified: Keveana Carter		Date: 2020-05-22		Comments: Automate for ETL			*/
/* Modified:					Date:					Comments:							*/
/********************************************************************************************/

--Get a list of inventory where the Inventory Balance is not 0
with Inventory as (
	select	MAX(i.ACV) as ACV
			, MAX(i.CDK_Box) as CDK_Box
			, max(case when i.RN=1 then i.CompanyID else null end) as CompanyID
			, max(case when i.RN=1 then i.Dealership else null end) as Dealership
			--, max(case when i.RN=1 then i.Dealership_Lvl0 else null end) as Dealership_Lvl0
			, i.EntCora_Account_ID
			, max(case when i.rn=1 then i.entitykey else null end) as EntityKey
			, MAX(case when i.RN=1 then i.InvAccount else null end) as InvAccount
			, SUM(i.InventoryBalance) as InventoryBalance
			, MAX(i.InvServiceTotal) as InvServiceTotal
			, i.LineofBusiness
			, MAX(i.makename) as Make
			, MAX(i.Mileage) as Mileage
			, MAX(i.modelname) as Model
			, MAX(i.ModelYear) as ModelYear
			, MAX(case when i.RN=1 then i.Prefix else null end) as Prefix
			, MIN(StockInDate) as StockInDate
			--, max(case when i.RN =1 then StockInDate else null end) as StockInDate2
			, StockNo
			, MAX(case when i.RN=1 then i.StockType else null end) as StockType
			, MAX(i.VIN) as VIN
			, MAX(i.LastPayOffDate) as LastPayOffDate
			, CASE WHEN COALESCE(max(i.LastPayOffDate), '1900-01-01') >= max(StockInDate) AND DATEDIFF(DAY, max(StockInDate), GETDATE()) > 150 THEN 1 ELSE 0 END AS NoRefloor
	from	(
			select	sum(case when f.RN_ACV = 1 then f.postingamt else 0 end) as ACV
					, f.CDK_Box
					, f.EntADPCompanyID as CompanyID
					, f.EntDealerLvl1 as Dealership
					--, f.EntDealerLvl0 as Dealership_Lvl0
					, f.EntCora_Account_ID
					, f.EntityKey
					, f.InvAccount
					, f.EntLineOfBusiness as LineofBusiness
					--, InvControlBalance
					, sum(f.postingamt) as InventoryBalance
					, ServiceAmt as InvServiceTotal
					, i.MakeName
					, i.Mileage
					, i.ModelName
					, i.Year as ModelYear
					, f.Prefix
					, f.Control as StockNo
					, min(f.DoosiDate) as StockInDate
					, f.StockType
					, i.VIN
					, row_number() over (partition by f.EntCora_Account_ID,f.EntADPCompanyID,f.Control order by sum(f.postingamt) desc ) as RN
					, max(lpd.LastPayoffDate) LastPayOffDate
			FROM	vwFloorPlanDetailACV as f
					left join ETL_Staging.wrk.FloorPlanInventoryVehicle as i
						on f.EntCora_Account_ID = i.cora_acct_id
						and f.Control = i.stockno
					left join (SELECT VIN, Max(Meta_date) AS LastPayoffDate
						FROM [Sonic_DW].[dbo].[Syndicate_Floorplan_BoA_Response_Success]
						WHERE scenario = 'P' AND Meta_date <> CONVERT(DATE, GETDATE())
						GROUP BY VIN) lpd
						ON i.VIN = lpd.VIN
			where	InvControlBalance <> 0
			group by f.CDK_Box
					,f.EntADPCompanyID
					,f.EntDealerLvl1
					--,f.entdealerlvl0
					,f.EntCora_Account_ID
					,f.entitykey
					,f.InvAccount
					,f.EntLineOfBusiness
					--,InvControlBalance
					,ServiceAmt
					,i.makename
					,i.mileage
					,i.modelname
					,i.year
					,f.Prefix
					,f.Control
					,f.StockType
					,i.vin
			) as i
	group by i.CompanyID
			, i.LineofBusiness
			, i.StockNo
			,i.EntCora_Account_ID
	having SUM(i.InventoryBalance) <> 0
	),
inv as (
	select	i.ACV
			, i.CDK_Box, i.CompanyID, s.ContractDate
			, i.Dealership, s.Dealno, s.DealStatus, s.DealType
			, i.EntityKey
			, ISNULL(f.FloorplanBalance*-1,0) as FloorplanBalance
			,case when isnull((f.FloorplanBalance*-1),0) < 2000 then 0 else 1 end as FloorplanBalanceFlag
			,case when InvAccount IN ('2400','2401','2404') then '3306' --used car
			      when InvAccount IN ('2402','2403','2405') then '3307' --used truck
				  when InvAccount IN ('2341','2342') then '3301' --fleet
				  when InvAccount IN ('2300','2320') then '3300' --new car
				  when InvAccount IN ('2340') then '3303' --new truck
				  else null end as FP_Account
			,case when i.LineofBusiness = 'EchoPark' and left(i.StockNo,1) IN ('B', 'G', 'H') then 'NO' when i.ModelYear >= year(getdate())-6 and i.Mileage < 80000 then 'YES'
				  else 'NO' end as FP_Eligible
			,i.InvAccount
			,i.InventoryBalance
			,case when i.InventoryBalance >= 2000 then 1 else 0 end as InventoryBalanceFlag
			,i.InvServiceTotal
			,i.LineofBusiness
			,i.Make
			,i.Mileage
			,i.Model
			,i.ModelYear
			,i.Prefix
			,case when s.Dealno is null or (s.DealStatus = 'F' and i.InventoryBalance >= 2000) then 'NO'
				  else 'YES' end as SaleMatch
			,i.Stockno
			,i.StockType
			,i.StockInDate
			--,i.LastPayOffDate
			,i.VIN
			,count(1) over (PARTITION BY VIN) as VIN_count
			,row_number() over (PARTITION BY VIN order by StockInDate desc,i.InventoryBalance desc) as VIN_RN
			--,NoRefloor
	from	Inventory i
			left join dbo.vwFloorPlanBalance f
				on i.EntCora_Account_ID = f.EntCora_Account_ID
				and i.CompanyID = f.EntADPCompanyID
				and i.Stockno = f.control
			left join ETL_Staging.wrk.FloorPlanSales s
				on i.EntCora_Account_ID = s.related_acctg_cora_acct_id
				and i.Stockno = s.stockno
				and i.CompanyID = s.FI_companyid
				and i.StockInDate <= s.contractdate ---maybe add a 5 day buffer here?
		WHERE NoRefloor = 0
	)
insert into [dbo].[Syndicate_Floorplan_Funding] (
		ACV
		, CDK_Box, CompanyID, ContractDate
		, Dealership, DealNo, DealStatus, DealType
		, EntityKey
		, FloorplanBalance, FND_Bank_SentFlag, FND_File_LoadFlag, FP_Account, FP_Eligible, FP_FullAccount
		, InvAccount, InventoryBalance, InvServiceTotal
		, LineofBusiness
		, Make, Mileage, Model, ModelYear
		, Prefix
		, SaleMatch, SourceGroup, SSC_Entry_LoadFlag, StockInDate, StockNo, StockType
		, TRN_File_LoadFlag
		, VIN, VIN_count, VIN_RN
		, Meta_LoadDate
	)
Select	i.ACV
		, i.CDK_Box, i.CompanyID, i.ContractDate
		, i.Dealership, i.Dealno, i.DealStatus, i.DealType
		, i.EntityKey
		, i.FloorplanBalance
		, null as FND_Bank_SentFlag
		, case when InventoryBalanceFlag = 1 --RAJ fix
					and FloorplanBalanceFlag = 0
					and SaleMatch = 'NO'
					and FP_Eligible = 'YES'
					and VIN_RN = 1
					and InvServiceTotal <> InventoryBalance
					and ACV >= 2000 --RAJ fix
				then 1
				else 0 end as FND_File_LoadFlag --file 1
		, FP_Account
		, case when i.ModelYear >= year(getdate())-6 and i.Mileage < 80000 then 'YES'
			   else 'NO' end as FP_Eligible
		, case when Prefix = 0 then FP_Account
			   else concat(Prefix,FP_Account)  end as FP_FullAccount
		, i.InvAccount, i.InventoryBalance, i.InvServiceTotal
		, i.LineofBusiness
		, i.Make, i.Mileage, i.Model, i.ModelYear
		, i.Prefix
		, SaleMatch, 'Accounting' as SourceGroup
		, case when InventoryBalanceFlag = 1
					and FloorPlanBalanceFlag=0
					and SaleMatch = 'NO'
					and FP_Eligible = 'YES'
					and VIN_RN = 1
					and InvServiceTotal <> InventoryBalance
					and ACV >= 2000 --RAJ fix
					then 1 else 0 end as SSC_Entry_LoadFlag --file 2
		, i.StockInDate, i.StockNo, i.StockType
		, 0 as TRN_File_LoadFlag
		, i.VIN, VIN_count, VIN_RN
		, getdate() as Meta_LoadDate
FROM	inv as i
---add syndicat join --- RAJ Fix
join (select r.EntityKey, e.EntDealerLvl0,e.entadpcompanyid, Relationshiptype, AttributeField AS StockType
                from Sonic_DW.dbo.DimEntityRelationship r
                join Sonic_DW.dbo.DimEntityRelationshipType t
                on r.relationshiptypeguid = t.RelationshipTypeGuid
                join Sonic_DW.dbo.Dim_Entity e
                on e.entitykey = r.EntityKey
                where relationshiptype in ('Syndicate') --AND r.AttributeField In (N'Loaner Syndicate', N'New Syndicate', N'Used Syndicate')
                and   isactive = 1
              ) ss
ON i.entitykey = ss.EntityKey
AND i.StockType = ss.StockType
----AND ss.StockType = 'Used'--Raj remove filter 20210414



;



/* insert count */
SELECT	@insertedRowCnt = @@rowcount;


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
