---
name: usp_FireSummaryDetail_update
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





--EXEC [dbo].[usp_FireSummaryDetail]
/***************************************************************************************************/
/* CHANGE LOG *************************************************************************************/
------ 03/25/20 DMD:  Updated Unwind Joins as requested in PBI 4663
------ 03/25/20 DMD:  Added Join to [ETL_Staging].[dbo].[DMSCustomerKeyIDX] instead of DimDMSCustomer for dupes
/*************************************************************************************************/


create procedure [dbo].[usp_FireSummaryDetail_update] as

BEGIN
/***************************************************************************************************/
/* Get Unwinds and Reversals **********************************************************************/
/*************************************************************************************************/
IF OBJECT_ID ('tempdb..#FIREMatches') is not null drop table #FIREMatches;
IF OBJECT_ID ('tempdb..#unwind_original') is not null drop table #unwind_original;
IF OBJECT_ID ('tempdb..#unwind_reversal0') is not null drop table #unwind_reversal0;
IF OBJECT_ID ('tempdb..#unwind_reversal') is not null drop table #unwind_reversal;
IF OBJECT_ID ('tempdb..#unwind_reversal2') is not null drop table #unwind_reversal2;
IF OBJECT_ID ('tempdb..#unwind_reversal3') is not null drop table #unwind_reversal3;
/***************************************************************************************************/
/* Insert Fire Matches *****************************************************************************/
/***************************************************************************************************/
select	d.ID
		,ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
		,'FIRE_Match' as MatchType
		,d.AssignedFlag
		,d.DealNumber
		,VSC.FICORA
		,vsc.FILogon
		,d.EntLineOfBusiness
into #FIREMatches
from	etl_staging.wrk.FireSummary_Detail as d
		left join etl_staging.wrk.FireSummary_VSC as vsc
			on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
			and d.StockNumber = vsc.StockNumber
			and d.DealNumber = vsc.DealNumber
where	d.AssignedFlag = 1

/***************************************************************************************************/
---------#unwind_original
/***************************************************************************************************/
select	*
into #unwind_original
from	(
			select	d.ID
					, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
					,'Unwind_OrigSale' as MatchType
					, 1 as AssignedFlag
					, vsc.DealNumber
					, vsc.FICora
					, vsc.FILogon
					, d.EntLineOfBusiness
			from	etl_staging.wrk.FireSummary_Detail as d
					inner join etl_staging.wrk.FireSummary_VSC as vsc
						on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
						and d.EntADPCompanyID = vsc.CompanyID
						and d.StockNumber = vsc.referencenumber
						and d.AccountingDate = vsc.dealaccountingdate
						and vsc.statuscode = 'U'
						and d.AssignedFlag = 0
			) unwinds
where	rn = 1

/***************************************************************************************************/
---------#unwind_reversal0
/***************************************************************************************************/
select	*
into #unwind_reversal0
from	(
			select	d.ID
					, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
					,'Unwind_Reversal' as MatchType
					, 1 as AssignedFlag
					, vsc.DealNumber
					, vsc.FICora
					, vsc.FILogon
					, d.EntLineOfBusiness
			from	etl_staging.wrk.FireSummary_Detail as d
					inner join etl_staging.wrk.FireSummary_VSC as vsc
						on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
						and d.EntADPCompanyID = vsc.CompanyID
						and d.StockNumber = vsc.referencenumber
						and d.PostingDate = vsc.accountingdate
						and vsc.statuscode = 'U'
						AND d.StatCount = -1
						and d.AssignedFlag = 0
			) unwinds
where	rn = 1

/***************************************************************************************************/
---------#unwind_reversal
/***************************************************************************************************/
select	*
INTO #unwind_reversal
from	(
		select	d.ID
				, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
				, 'Unwind_Reversal' as MatchType
				, 1 as AssignedFlag
				, vsc.DealNumber
				, vsc.FICora
				, vsc.FILogon
				, d.EntLineOfBusiness
		from	etl_staging.wrk.FireSummary_Detail as d
				inner join etl_staging.wrk.FireSummary_VSC as vsc
					on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
					and d.EntADPCompanyID = vsc.CompanyID
					and d.StockNumber = vsc.referencenumber
					and MONTH(d.AccountingDate) = MONTH(vsc.accountingdate)
					and YEAR(d.AccountingDate) = YEAR(vsc.accountingdate)
					and vsc.statuscode = 'U'
					and d.StatCount = -1
					and d.AssignedFlag = 0
					and d.ID NOT IN (select ID from #unwind_reversal0)
		--Where	d.AccountingDate > vsc.contractdate
		--		or
		--		(MONTH(d.AccountingDate) = MONTH(vsc.accountingdate) and YEAR(d.AccountingDate) = YEAR(vsc.accountingdate))
		) unwinds
where	rn = 1


/***************************************************************************************************/
---------#unwind_reversal2
/***************************************************************************************************/
select	*
INTO #unwind_reversal2
from	(
		select	d.ID
				, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
				, 'Unwind_Reversal' as MatchType
				, 1 as AssignedFlag
				, vsc.DealNumber
				, vsc.FICora
				, vsc.FILogon
				, d.EntLineOfBusiness
		from	etl_staging.wrk.FireSummary_Detail as d
				inner join etl_staging.wrk.FireSummary_VSC as vsc
					on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
					and d.EntADPCompanyID = vsc.CompanyID
					and d.StockNumber = vsc.referencenumber
					AND d.AccountingDate > vsc.ContractDate
					and vsc.statuscode = 'U'
					and d.StatCount = -1
					and d.AssignedFlag = 0
					and d.ID NOT IN (select ID from #unwind_reversal0
                                  union
                                  select ID from #unwind_reversal)
		) unwinds
where	rn = 1

/***************************************************************************************************/
---------#unwind_reversal3
/***************************************************************************************************/
select	*
INTO #unwind_reversal3
from	(
		select	d.ID
				, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
				, 'Unwind_Reversal' as MatchType
				, 1 as AssignedFlag
				, vsc.DealNumber
				, vsc.FICora
				, vsc.FILogon
				, d.EntLineOfBusiness
		from	etl_staging.wrk.FireSummary_Detail as d
				inner join etl_staging.wrk.FireSummary_VSC as vsc
					on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
					and d.EntADPCompanyID = vsc.CompanyID
					and d.StockNumber = vsc.referencenumber
					AND d.AccountingDate = vsc.AccountingDate
					and vsc.statuscode = 'U'
					and d.StatCount <= 0
					and d.AssignedFlag = 0
					and d.ID NOT IN (select ID from etl_staging.wrk.FireSummary_Matches
                                  union
                                  select ID from #unwind_original
                                  union
                                  select ID from #unwind_reversal0
                                  union
                                  select ID from #unwind_reversal
                                  union
                                  select ID from #unwind_reversal2 )
		) unwinds
where	rn = 1
;

/***************************************************************************************************/
/* Insert Fire Matches *****************************************************************************/
/***************************************************************************************************/
insert into etl_staging.wrk.FireSummary_Matches
SELECT * FROM #FIREMatches

/***************************************************************************************************/
/* Insert Unwind and Reversals *********************************************************************/
/***************************************************************************************************/
insert into etl_staging.wrk.FireSummary_Matches
SELECT 	 ur.ID
		,ur.RN
		,ur.MatchType
		,ur.AssignedFlag
		,ur.DealNumber
		,ur.FICora
		,ur.FILogon
		,ur.EntLineOfBusiness
FROM
(
SELECT ROW_NUMBER() OVER(PARTITION BY ID, EntLineOfBusiness ORDER BY ID desc) as Num, *
	FROM
	(
	SELECT * FROM #unwind_original
	UNION
	SELECT * FROM #unwind_reversal
	UNION
	SELECT * FROM #unwind_reversal0
	UNION
	SELECT * FROM #unwind_reversal2
	) unwnd
) ur
WHERE ur.Num = 1
;


/***************************************************************************************************/
/* Insert Wrong StockNumber ************************************************************************/
/***************************************************************************************************/
insert into etl_staging.wrk.FireSummary_Matches
select	d.ID
		, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
		, 'WrongStockno' as MatchType
		, 1 as AssignedFlag
		, vsc.DealNumber
		, vsc.FICora
		, vsc.FILogon
		, d.EntLineOfBusiness
from	etl_staging.wrk.FireSummary_Detail as d
		inner join etl_staging.wrk.FireSummary_VSC as vsc
			on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
			and d.EntADPCompanyID = vsc.CompanyID
			and d.StockNumber = vsc.referencenumber
			and d.AccountingDate = vsc.dealaccountingdate
			and vsc.statuscode = 'F'
			and d.AssignedFlag = 0
;



/***************************************************************************************************/
/* Insert Contract Date ****************************************************************************/
/***************************************************************************************************/
insert into etl_staging.wrk.FireSummary_Matches
select	*
from	(
		select	d.ID
				, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
				, 'Contract Date' as MatchType
				, 1 as AssignedFlag
				, vsc.DealNumber
				, vsc.FICora
				, vsc.FILogon
				, d.EntLineOfBusiness
		from	etl_staging.wrk.FireSummary_Detail as d
				inner join etl_staging.wrk.firesummary_vsc as vsc
					on d.EntCoraAccountID = vsc.related_acctg_cora_acct_id
					and d.EntADPCompanyID = vsc.CompanyID
					and d.StockNumber = vsc.referencenumber
					and d.AccountingDate = vsc.contractdate
					and d.AssignedFlag = 0
		where	not exists (
					select	1
					from	etl_staging.wrk.firesummary_matches m
					where	d.id = m.id
							and d.EntLineOfBusiness = m.EntLineOfBusiness
					)
		) as dups
where rn = 1
;



/***************************************************************************************************/
/* Insert Unmatched ********************************************************************************/
/***************************************************************************************************/
insert into etl_staging.wrk.FireSummary_Matches
select	d.ID
		, ROW_NUMBER() OVER(PARTITION BY d.ID, d.EntLineOfBusiness ORDER BY d.ContractDate desc) as RN
		, 'Unmatched' as MatchType
		, d.AssignedFlag
		, d.DealNumber
		, -1 as FICora
		, null FILogon
		, d.EntLineOfBusiness
from	etl_staging.wrk.FireSummary_Detail as d
where	not exists (
				select	1
				from	etl_staging.wrk.firesummary_matches m
				where	d.id = m.id
						and d.EntLineOfBusiness = m.EntLineOfBusiness-------------- Raj 11/182019
				)
;


/****************************************************************************************************/
/* Insert Final *************************************************************************************/
/* Modified: Keveana Carter		Date: 2019-10-08		Comments: change columns					*/
/* Modified: Keveana Carter		Date: 2019-10-15		Comments: remove columns & change defaults	*/
/* Modified: Rajamani Bandi		Date: 2019-10-23		Comments: added column HardWeOweGross       */
--- ---added 2019-10-31
/****************************************************************************************************/
--insert into sonic_dw.dbo.FactFireSummary_history
insert into sonic_dw.dbo.FactFireSummary_update
SELECT DISTINCT              --removed 2019-10-15 det.AccountingDate

                               ISNULL(d.DateKey,19000101) as AccountingDateKey -- added 2019-10-08
                              , case when vsc.Age < 0 then 0 else ISNULL(vsc.Age,0) End as Age
                              , ISNULL(vsc.Apr,0)
                              , ISNULL(mat.AssignedFlag,0)
                              , ISNULL(det.BackCost,0)
                              , ISNULL(det.BackGross,0)
                              , ISNULL(det.BackSale,0)
                              , ISNULL(BankFee,0)        --added 2019-10-08
                              , ISNULL(convert(int,convert(char(8),vsc.BookedDate, 112)),19000101) as BookedDateKey -- change to int 2019-10-15
                              , ISNULL(vsc.BuyRate,0)
                              -- removed 2019-10-15, ISNULL(det.CalendarYearMonth,'Unknown')
                              , ISNULL(vsc.CashDown,0)
                              , case when ISDATE(vsc.CashInBankDate) = 0 then 19000101
                                                            WHEN ISDATE(vsc.CashInBankDate) = 1  AND LEN(vsc.CashInBankDate) = 10 AND (vsc.CashInBankDate LIKE '%/%/%' OR vsc.CashInBankDate LIKE '%-%-%') THEN convert(int,convert(char(8),convert(date,vsc.CashInBankDate), 112))
                                                            ELSE 19000101
                                                            END as CashInBankDate --change to int 2019-10-15
                              -- remove 2019-10-08 , ISNULL(vsc.CDKDate,'1900-01-01')
                              , ISNULL(det.CertifiedFlag,'N')
                              , ISNULL(det.Chargebacks,0)
                              , ISNULL(det.ChargebacksOver90,0)
                              , ISNULL(det.ChargebacksUnder90,0)
                              , ISNULL(vsc.ClosingManager,'Unknown')
                              , ISNULL(cm.AssociateKey,-1) as ClosingManagerKey ---added 2019-10-31
                              , CASE WHEN ISDATE(vsc.ContractDate) = 1 then convert(int,convert(char(8),convert(date,vsc.ContractDate), 112))
                                                            else ISNULL(convert(int,convert(char(8),convert(date,det.ContractDate), 112)),19000101) end as ContractDateKey -- change to int 2019-10-15
                              , ISNULL(det.COS_Adj,0)
                              , ISNULL(vsc.CustomerNumber,'Unknown')
                              -- removed 2019-10-15,, ISNULL(det.Dealership,'Unknown')
                              , ISNULL(c.DMSCustomerKey,-1) --- added 2019-10-31
                              , ISNULL(vsc.DealEvent6,'')
                              , ISNULL(vsc.DealEvent6Date,'1900-01-01')
                              , ISNULL(vsc.DealEvent7,'')
                              , ISNULL(vsc.DealEvent7Date,'1900-01-01')
                              , ISNULL(vsc.DealEvent8,'')
                              , ISNULL(vsc.DealEvent8Date,'1900-01-01')
                              , ISNULL(vsc.DealEvent9,'')
                              , ISNULL(vsc.DealEvent9Date,'1900-01-01')
                              , ISNULL(vsc.DealEvent10,'')
                              , ISNULL(vsc.DealEvent10Date,'1900-01-01')
                              , ISNULL(mat.DealNumber,'')
                              , COALESCE(vsc.statuscode,det.DealStatus,'') as DealStatus
                              , ISNULL(det.FIAccountClassification,'') as DealType
                              --, ISNULL(vsc.DealType,'') as DealTypeFI --aftermarket fix 9-15: replace with below
                              , COALESCE(vsc.DealType,det.dealtypeFI,'') as DealTypeFI --aftermarket fix 9-15
                              , ISNULL(det.DingDentChargeback,0)
                              , ISNULL(det.DingDentCost,0)
                              , ISNULL(det.DingDentCount,0)
                              , ISNULL(det.DingDentSale,0)
                              --, CASE WHEN ISNULL(vsc.StatusCode,det.DealStatus) = 'F' then ISNULL(det.DocFee,0) else ISNULL(vsc.DocFee,0) end as DocFee
        , CASE WHEN ISNULL(vsc.StatusCode,det.DealStatus) IN ('F','U') then ISNULL(det.DocFee,0) else ISNULL(vsc.DocFee,0) end as DocFee ---- updated 07/24/2020 RB/LD
                              , ISNULL(det.EntAccountingPrefix,'-1')
                              , ISNULL(det.EntADPCompanyID,'-1')
                              -- removed 2019-10-15,, ISNULL(det.EntBrand,'Unknown')
                              , ISNULL(det.EntCoraAccountID,-1)
                              , ISNULL(det.EntityKey,-1)
                              -- removed 2019-10-15,, ISNULL(det.EntLineOfBusiness,'Unknown')
                              -- removed 2019-10-15,, ISNULL(det.EntRegion,'Unknown')
                              , ISNULL(det.FactoryBonus,0)
                              , ISNULL(vsc.FICORA,-1)
                              , ISNULL(vsc.FIIncome,0)
                              , ISNULL(vsc.FILogon,'Unknown')
                              , ISNULL(vsc.FinanceAmount,0)
                              , ISNULL(vsc.FinanceCharge,0)
                              , COALESCE(vsc.FinanceCompany,l.Custno ,'Unknown')--9-24-20 aftermarket fix add
                              --, ISNULL(vsc.FinanceManager,'Unknown')--9-15-20 aftermarket fix replace with below
                              , COALESCE(vsc.FinanceManager,fimFF.custno,'Unknown')--9-15-20 aftermarket fix add
                              , ISNULL(det.FinanceReserve,0)
                              , ISNULL(det.FinanceReserveChargeback,0)
                              , ISNULL(det.FinanceReserveCount,0)
                              , ISNULL(det.FINet,0)
                              , ISNULL(det.FIPack,0)
                              , ISNULL(vsc.StockNumber,'') as FIStockNumber
                              , ISNULL(det.FrontCost,0)
                              , ISNULL(det.FrontGross,0)
                              , ISNULL(det.FrontGrossPackDocFactory,0)
                              , ISNULL(det.FrontSale,0)
                              , ISNULL(det.FrontWeOwes,0)
                              --2019-10-08 use dealeventdate6 as priority, ISNULL(vsc.FundedDate,'1900-01-01')
               ,COALESCE(convert(VARCHAR(1024),vsc.dealevent6date,23), vsc.FundedDate,'1900-01-01')
               ---               ,ISNULL(fim.AssociateKey,-1) as FinanceManagerKey ---- --added 2019-10-31
        ,COALESCE(fim.AssociateKey,det.fimgrkey,-1) as FinanceManagerKey --9-15-20 aftermarket fix update
                              , ISNULL(det.GapChargeback,0)
                              , ISNULL(det.GapCost,0)
                              , ISNULL(det.GapCount,0)
                              , ISNULL(det.GapSale,0)
                              , ISNULL(vsc.HardWeOweGross,0) --added 2019-10-23
                              , ISNULL(det.Incentives,0)
                              , ISNULL(det.LenderKey,-1)
                              , ISNULL(vsc.MakeName,'Unknown')
                              , ISNULL(mat.MatchType,'')
                              , ISNULL(vsc.ModelName,'Unknown')
                              , ISNULL(vsc.ModelYear,-1)
                              , case when ISNULL(vsc.statuscode,det.DealStatus) = 'U' then coalesce(vsc.dealaccountingdate,vsc.contractdate,'1900-01-01') else '1900-01-01' end as OriginalAccountingDate
                              , ISNULL(det.OtherAdjustment,0)
                              , ISNULL(det.Pack,0)
                              , ISNULL(vsc.Payment,0)
                              , ISNULL(det.PenetrationCount,0)
                              , ISNULL(det.PermaPlateChargeback,0)
                              , ISNULL(det.PermaPlateCost,0)
                              , ISNULL(det.PermaPlateCount,0)
                              , ISNULL(det.PermaPlateSale,0)
                              -- remove 2019-10-08 , ISNULL(det.ProductCountEP,0)
                              , ISNULL(vsc.Apr,0) - ISNULL(vsc.BuyRate,0) as PointsHeld --added 2019-10-08
                              --renamed 2019-10-08 to ProductCount, ISNULL(det.ProductCountSonic,0)
                              , ISNULL(det.ProductCount,0)
                              , case when vsc.FinanceCompany = 'AFTMRKT' Then 1
                                                when l.Custno = 'AFTMRKT' then 1 else 0 end as ProductOnlyFlag
                              -- remove 2019-10-08 , ISNULL(vsc.PurchasedBy,'Unknown')
                              , ISNULL(det.Recon,0)
                              , ISNULL(vsc.SalesManager,'Unknown')
                              , Case When COALESCE(vsc.salesperson1,s1FF.custno,'-1') = '-1' and COALESCE(vsc.salesperson2,s2FF.custno,'-1') = '-1' then 1  -- no salesman
                                                            when COALESCE(vsc.salesperson1,s1FF.custno,'-1') = COALESCE(vsc.salesperson2,s2FF.custno,'-1') then 1 -- same salesman
                                                            when COALESCE(vsc.salesperson1,s1FF.custno,'-1') != '-1' and COALESCE(vsc.salesperson2,s2FF.custno,'-1') != '-1' then .5 -- shared salesman
                                                            when COALESCE(vsc.salesperson1,s1FF.custno,'-1') != '-1' or COALESCE(vsc.salesperson2,s2FF.custno,'-1') != '-1' then 1 -- only 1 salesman
                                                            else 0 end as SalesPercent ---updated with aftermarket fix
                              --, ISNULL(vsc.salesperson1,'-1') as Salesperson1 --aftermarket fix 9-15-20: replace with below
                              , COALESCE(vsc.salesperson1,s1FF.custno,'-1') as Salesperson1 --aftermarket fix: add
                              --, ISNULL(vsc.salesperson2,'-1') as Salesperson2 --aftermarket fix 9-15-20: replace with below
                              , COALESCE(vsc.salesperson2,s2FF.custno,'-1') as Salesperson2 --aftermarket fix: add
                              , coalesce(vsc.SaleType,det.saletype,'Unknown') as SaleType
                              -- remove 2019-10-08 , ISNULL(vsc.SoldDate,'1900-01-01')
                              --,ISNULL(s1.AssociateKey,-1) as SalesPerson1key ---added 2019-10-31,9-15-20 Aftermarket fix replace with below
               ,COALESCE(s1.AssociateKey,det.SalesPerson1Key,-1) as SalesPerson1key ---added for aftermarket fix
                              --,ISNULL(s2.AssociateKey,-1) as SalesPerson2key ---added 2019-10-31,9-15-20 Aftermarket fix replace with below
               ,COALESCE(s2.AssociateKey,det.SalesPerson2Key,-1) as SalesPerson2key ---added for aftermarket fix
                              ,ISNULL(sm.AssociateKey,-1) as SalesManagerKey ---added 2019-10-31
                              , ISNULL(det.StatCount,0)
                              , ISNULL(det.StockNumber,'Unknown')
                              , ISNULL(vsc.Term,0)
                              , ISNULL(det.TotalGross,0)
                              , ISNULL(vsc.TradeACV,0)
                              , ISNULL(det.TradeAllowance,0)
                              , ISNULL(vsc.TradeGross,0)
                              , ISNULL(vsc.TradeStockNumber,'')
                              , ISNULL(vsc.TradeVIN,'')
                              , ISNULL(vsc.Trade2ACV,0)
                              , ISNULL(vsc.Trade2Gross,0)
                              , ISNULL(vsc.Trade2StockNumber,'')
                              , ISNULL(vsc.Trade2VIN,'')
                              , ISNULL(vsc.VIN,'Unknown')
                              , ISNULL(det.VSAChargeback,0)
                              , ISNULL(det.VSACost,0)
                              , ISNULL(det.VSACount,0)
                              , ISNULL(det.VSASale,0)
                              ------ Added new FI Columns 11/13/2019 ------
                              , ISNULL(det.KeyChargeback,0)
                              , ISNULL(det.KeyCost,0)
                              , ISNULL(det.KeyCount,0)
                              , ISNULL(det.KeySale,0)
                              , ISNULL(det.OtherChargeback,0)
                              , ISNULL(det.OtherCost,0)
                              , ISNULL(det.OtherCount,0)
                              , ISNULL(det.OtherSale,0)
                              , ISNULL(det.InsuranceChargeback,0)
                              , ISNULL(det.InsuranceCost,0)
                              , ISNULL(det.InsuranceCount,0)
                              , ISNULL(det.InsuranceSale,0)
                              , ISNULL(det.LeaseWearTearChargeback,0)
                              , ISNULL(det.LeaseWearTearCost,0)
                              , ISNULL(det.LeaseWearTearCount,0)
                              , ISNULL(det.LeaseWearTearSale,0)
                              , ISNULL(det.PhantomChargeback,0)
                              , ISNULL(det.PhantomCost,0)
                              , ISNULL(det.PhantomCount,0)
                              , ISNULL(det.PhantomSale,0)
                              , ISNULL(det.MaintenanceChargeback,0)
                              , ISNULL(det.MaintenanceCost,0)
                              , ISNULL(det.MaintenanceCount,0)
                              , ISNULL(det.MaintenanceSale,0)
                              , ISNULL(det.RoadstarChargeback,0)
                              , ISNULL(det.RoadstarCost,0)
                              , ISNULL(det.RoadstarCount,0)
                              , ISNULL(det.RoadstarSale,0)
                              , ISNULL(det.TireWheelChargeback,0)
                              , ISNULL(det.TireWheelCost,0)
                              , ISNULL(det.TireWheelCount,0)
                              , ISNULL(det.TireWheelSale,0)
                              , ISNULL(det.SecurityChargeback,0)
                              , ISNULL(det.SecurityCost,0)
                              , ISNULL(det.SecurityCount,0)
                              , ISNULL(det.SecuritySale ,0)
                              -- remove 2019-10-08 , ISNULL(vsc.WherePurchased,'Unknown')
                              , det.ETLExecution_ID
                              , det.Meta_ComputerName
                              , det.Meta_LoadDate
                              , det.meta_userid
                              --, mat.ID
from        ETL_Staging.wrk.FireSummary_Detail as det
                              left join ETL_Staging.wrk.FireSummary_Matches as mat
                                             on det.ID = mat.ID
                                             and det.EntLineOfBusiness = mat.EntLineOfBusiness  -------------- Raj 11/182019
                              left join ETL_Staging.wrk.FireSummary_VSC as vsc
                                             on mat.FICora = vsc.FICora
                                             and mat.DealNumber = vsc.DealNumber
                              left join Sonic_DW.dbo.Dim_Date as d
                                             on det.AccountingDate = d.fulldate
                              left join [ETL_Staging].[dbo].[DMSCustomerKeyIDX] as c   --- DMD added 04/15/2020
                                  on det.EntCoraAccountID = c.DMSCstCoraAcct
                                             and vsc.CustomerNumber = c.DMSCstCustNo
                              --left join sonic_dw.dbo.dim_dmscustomer as c   --- added 10/31/2019
                              --    on det.EntCoraAccountID = c.DMSCstCoraAcct
                              --            and vsc.CustomerNumber = c.DMSCstCustNo
                              left join sonic_dw.dbo.Dim_DMSEmployee as s1 ---added 2019-10-31
            on det.EntCoraAccountID = s1.cora_acct_id
            and vsc.SalesPerson1 = s1.custno
            and s1.EMPNameCode = 7
        left join sonic_dw.dbo.Dim_DMSEmployee as s2 ---added 2019-10-31
            on det.EntCoraAccountID = s2.cora_acct_id
            and vsc.SalesPerson2 = s2.custno
            and s2.EMPNameCode = 7
        left join sonic_dw.dbo.Dim_DMSEmployee as sm ---added 2019-10-31
            on det.EntCoraAccountID = sm.cora_acct_id
            and vsc.SalesManager = sm.custno
            and sm.EMPNameCode = 7
        left join sonic_dw.dbo.Dim_DMSEmployee as cm ---added 2019-10-31
            on det.EntCoraAccountID = cm.cora_acct_id
            and vsc.ClosingManager = cm.custno
            and cm.EMPNameCode = 7
        left join sonic_dw.dbo.Dim_DMSEmployee as fim ---added 2019-10-31
            on det.EntCoraAccountID = fim.cora_acct_id
            and vsc.FinanceManager = fim.custno
            and fim.EMPNameCode = 7
               ----update 9-24-20: add for aftermarket fix to pull through the associate from the FIRE match since D-FI not in VSC
                              left join sonic_dw.dbo.Dim_DMSEmployee as fimFF ---
           on det.fimgrkey = fimFF.AssociateKey
                                             and fimFF.AssociateKey <> -1
                              left join sonic_dw.dbo.Dim_DMSEmployee as s1FF
            on det.SalesPerson1Key = s1FF.AssociateKey
                                             and s1ff.associatekey <> -1
        left join sonic_dw.dbo.Dim_DMSEmployee as s2FF
            on det.SalesPerson2Key = s2FF.AssociateKey
                                             and s2FF.AssociateKey <> -1
                              left join sonic_dw.dbo.dim_lender l --added 9-24-20 for ProductOnlyFlag
                                             on det.lenderkey = l.lenderkey

;


end






```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
