---
name: usp_FIRE_BuildSummaryFact_BK_827
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - dim_FIGLAccounts
  - dim_FIGLProductCategory
  - factFIRE
  - factFIRE_A
dependency_count: 4
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.dim_FIGLAccounts** (U )
- **dbo.dim_FIGLProductCategory** (U )
- **dbo.factFIRE** (U )
- **dbo.factFIRE_A** (U )

## Parameters

| Name            | Type | Output | Default |
| --------------- | ---- | ------ | ------- |
| `@StartDateKey` | int  | No     | No      |
| `@EndDateKey`   | int  | No     | No      |

## Definition

```sql







-- ====================================================================================
-- Author:		Owen D. McPeak - Analytic Vision, Inc.
-- Create date: 2011-09-26
-- Updated CDE 05/04/2012 Added columns stockytype - certified
-- Description:	This procedure build the summary fact table factFIRE_A
-- Updated CDE 06/18/2012 to add FIAccountClassification for Wholesale and InterCompany
-- Added IsRetail to factFIREA CDE 09/04/2012
-- Updated by RAJ/NICK 01/22/02014 added DMSCustomerKey
-- =====================================================================================
CREATE   PROCEDURE [dbo].[usp_FIRE_BuildSummaryFact_BK_827] (@StartDateKey int,@EndDateKey int)
AS
BEGIN
	SET NOCOUNT ON;

	--
	--	Delete from dbo.factFIRE_A for the date range specified in the parms. Note
	--	that the delete is batched...
	--	odmcpeak 9/26/2011
	--
	declare @cnt int = 1
	while @cnt <> 0
		begin
			begin transaction
				delete
					top (10000)
				from
					dbo.factFIRE_A
				where
					AccountingDateKey between @StartDateKey and @EndDateKey
				set @cnt = @@ROWCOUNT
			commit transaction
		end


	--
	--	CTE defines the salesperson counts by entity, deal, and stockno. Note that
	--	unknown or duplicate salespersons do not add to salesperson counts
	--	odmcpeak 9/26/2011
	--
	;with CTE as
	(
	select distinct entitykey,dealno,stockno,
	case when salesperson1key = -1 then 0 else 1 end as S1,
	case when salesperson2key = -1 then 0 else case when SalesPerson1Key = SalesPerson2Key then 0 else 1 end end as S2,
	case when salesperson3key = -1 then 0 else case when salesperson1key = salesperson3key or SalesPerson3Key=salesperson2key then 0 else 1 end end as S3
	from factFIRE where dealno <> '' and AccountingDateKey between @StartDateKey and @EndDateKey
	)

	--
	--	CTA gets the total number of unique salespersons per entity, dealno, and stockno
	--	odmcpeak 9/26/2011
	--
	,CTA as
	(
	select entitykey,dealno,stockno,SUM(S1+S2+S3) as SalesCount
	from CTE
	group by entitykey,dealno,stockno
	)

	--
	--	CTB performs the first stage of the unpivot by unioning the distinct salespersons
	--	vertically by entity, dealno, stockno
	--	odmcpeak 9/26/2011
	--
	,CTB as
	(
	select distinct entitykey,dealno,stockno,salesperson1key as SalesPersonKey from factfire
	where SalesPerson1Key <> -1 and dealno <> ''  and AccountingDateKey between @StartDateKey and @EndDateKey
	union
	select distinct entitykey,dealno,stockno,salesperson2key as SalesPersonKey from factfire
	where SalesPerson2Key <> -1 and dealno <> '' and AccountingDateKey between @StartDateKey and @EndDateKey
	union
	select distinct entitykey,dealno,stockno,salesperson3key as SalesPersonKey from factfire
	where SalesPerson3Key <> -1 and dealno <> '' and AccountingDateKey between @StartDateKey and @EndDateKey
	)

	--
	--	CTC calculates the percent per deal of each salesperson for each entity, dealno, and stockno
	--	odmcpeak 9/26/2011
	--

	, CTC as
	(
	select BB.*,convert(float,1.00/AA.Salescount) as SalesPercent
	from CTB BB left join CTA AA
	on BB.dealno = AA.dealno and BB.StockNo = AA.StockNo and BB.EntityKey = AA.EntityKey
	)

	--
	--	The final stage of the unpivot forces the cartesian of the unique salesperson times the % per deal
	--	into the summary fact table dbo.factFIRE_A.
	--	odmcpeak 9/26/2011
	--

	insert into factfire_A
	(
		EntityKey,
		DealNo,
		FIMgrKey,
		SalesMgrKey,
		SalesPersonKey,
		AccountingDateKey,
		ContractDateKey,
		Stockno,
		DealTypeKey,
		VehicleKey,
		FIGLProductCategoryKey,
		FIAccountType ,
		Amount,
		DealCount,
		ProductCount,
		PenetrationCount,
		CustomerKey,
		DMSCustomerKey,
		fiwipstatuscode,
		LenderKey,
		StockType,
		PurchaseType,
		TransactionType,
		VehicleMileage,
		VehicleYear,
		IsRetail,
		CertifiedFlag,
		apr,
		age,
		buyrateapr,
		buyrateaddon,
		buyratelfm,
		extwarrantyexpmileslease,
		extwarrantytermlease,
		frontweowesgrosssales,
		mbilimit,
		mbiname,
		mbiterm,
		sellrateapr,
		totaltradesover,
		term,
		VSC_RowLastUpdated
	)
	SELECT
			FF.EntityKey,
			FF.DealNo,
			FIMgrKey,
			SalesMgrKey,
			ISNULL(SalesPersonKey,-1) as SalesPersonKey,
			FF.AccountingDateKey,
			ContractDateKey,
			FF.Stockno,
			DealTypeKey,
			ISNULL(VehicleKey,-1) as VehicleKey,
			GL.FIGLProductCategoryKey,
			GL.FIAccountType ,
			SUM(Amount) * ISNULL(CC.SalesPercent,1) as Amount,
			Case when PC.DealCountFlag ='Y' and GL.FIAccountType = 'S' THEN ISNULL(CC.SalesPercent,1) * sum(FF.statcount) else 0 end as DealCount,
			Case when PC.ProductCountFlag ='Y' and GL.FIAccountType = 'S' THEN ISNULL(CC.SalesPercent,1) * sum(FF.statcount)  else 0 end as ProductCount,
			Case when PC.PenetrationCountFlag ='Y' and GL.FIAccountType = 'S' THEN isnull(CC.SalesPercent,1) * sum(FF.statcount)  else 0 end as PenetrationCount,
			CustomerKey,
			DMSCustomerKey,
			fiwipstatuscode,
			LenderKey,
			StockType,
			PurchaseType,
			TransactionType,
			VehicleMileage,
			VehicleYear,
			IsRetail,
			CertifiedFlag,
			apr,
			age,
			buyrateapr,
			buyrateaddon,
			buyratelfm,
			extwarrantyexpmileslease,
			extwarrantytermlease,
			frontweowesgrosssales,
			mbilimit,
			mbiname,
			mbiterm,
			sellrateapr,
			totaltradesover,
			term,
			VSC_RowLastUpdated
		FROM
		  factFIRE FF
		  LEFT OUTER JOIN CTC CC on
		  FF.dealno = CC.dealno and FF.StockNo = CC.StockNo and FF.EntityKey = CC.EntityKey --and FF.AccountingDateKey = CC.AccountingDateKey
		  INNER JOIN dim_FIGLAccounts GL on FF.FIGLProductKey = GL.FIGLProductKey
		  INNER JOIN dim_FIGLProductCategory PC on GL.FIGLProductCategoryKey = PC.FIGLProductCategoryKey
	WHERE GL.FIAccountClassification NOT IN('Wholesale', 'InterCompany')
	AND FF.AccountingDateKey BETWEEN @StartDateKey and @EndDateKey
	GROUP BY
			FF.EntityKey,
			FF.DealNo,
			FIMgrKey,
			SalesMgrKey,
			SalesPersonKey,
			FF.AccountingDateKey,
			ContractDateKey,
			FF.Stockno,
			DealTypeKey,
			VehicleKey,
			GL.FIGLProductCategoryKey,
			SalesPercent,
			PC.FIGLProductCategory,
			FIAccountType,
			DealCountFlag,
			ProductCountFlag,
			PenetrationCountFlag,
			statcount ,
			CustomerKey,
			DMSCustomerKey,
			fiwipstatuscode,
			LenderKey,
			StockType,
			PurchaseType,
			TransactionType,
			VehicleMileage,
			VehicleYear,
			IsRetail,  -- Added CDE 09/04/2012
			CertifiedFlag ,
			apr,
			age,
			buyrateapr,
			buyrateaddon,
			buyratelfm,
			extwarrantyexpmileslease,
			extwarrantytermlease,
			frontweowesgrosssales,
			mbilimit,
			mbiname,
			mbiterm,
			sellrateapr,
			totaltradesover,
			term,
			VSC_RowLastUpdated



END









```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
