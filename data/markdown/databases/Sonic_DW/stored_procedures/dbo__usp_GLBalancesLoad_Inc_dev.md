---
name: usp_GLBalancesLoad_Inc_dev
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql



/* ============================================================================================================================================================================================================
-- Author:           Owen D. McPeak - Analytic Vision, Inc.
-- Create date: 2013-05-29
-- Description:      Cycle through each day and populate account balances to Fact_GLBalances
-- Modifications:	NAME		DATE		DESCRIPTION
					ncarpender	2-11-2014	had issue where new accounts do not have a prior year for January month. Modified final query to use a full outer join and default missing values
												to zero to january numbers will generate. Also added some code to account for potential padding in text values used in joins as a defensive move.
-- ============================================================================================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_GLBalancesLoad_Inc_dev]
AS

BEGIN
       SET NOCOUNT ON;

       declare @BalanceForDate datetime = convert(varchar(10),dateadd(mm,-1,dateadd(dd,(DATEPART(dd,getdate())-1) * -1,getdate())),120)  --- update date Raj/Lindsay ---3/10/2017
       declare @BalanceForDateInt int
       declare @BalanceForDateMonthEnd datetime
       declare @BalanceForDateMonthBeginInt Int
       declare @BalanceForDateThisMonthEndInt int
       declare @MaxRunDate datetime

       set @MaxRunDate = dateadd(mm,1,DATEADD(dd,(datepart(dd,getdate())) * -1,getdate()))

		--------------------------------------------------------------------------------------------------------------
        -- This loop takes the current months gljedetail_cur totals, up to current day, and adds them to last months
        --		glAccountLedger to totals to get a curr total by day.
        --------------------------------------------------------------------------------------------------------------
       while @BalanceForDate <= @MaxRunDate
              begin
                     set @BalanceForDateInt				= convert(int,CONVERT(varchar(10),@BalanceForDate,112))
                     set @BalanceForDateMonthEnd		= DATEADD(dd,datepart(dd,@BalanceForDate) * -1,@BalanceForDate)
                     set @BalanceForDateMonthBeginInt	= convert(int,convert(varchar(10),DATEADD(dd,(datepart(dd,@BalanceForDate) - 1) * -1,@BalanceForDate),112))
                     set @BalanceForDateThisMonthEndInt = convert(int,convert(varchar(10),dateadd(mm,1,@BalanceForDateMonthEnd),112))

					--------------------------------------------------------------------------------------------------------------
                    -- This cte shows the GLAccountLedger records by month
                    --------------------------------------------------------------------------------------------------------------
                     ;with CTE as
								 (
									 select
										   DE.EntityKey
										   , DE.EntDealerLvl1
										   , GL.cora_acct_id
										   , GL.companyid
										   , GL.accountnumber
										   , GL.AccountKey
										   , GL.YTD
									 from
										   ETL_Staging.wrk.GLBalance_Step_3 GL (nolock)
											left join sonic_DW.dbo.dim_Entity DE (nolock)
												on ltrim(rtrim(GL.companyid))	= ltrim(rtrim(DE.EntADPCompanyID))		--added trim functions 2-11-2014 by nwc
													and ltrim(rtrim(GL.prefix)) = ltrim(rtrim(DE.EntAccountingPrefix)) --added trim functions 2-11-2014 by nwc
													and GL.cora_acct_id = DE.entCora_account_id
									 where CurrentMonth = @BalanceForDateMonthEnd
								 )

                    --------------------------------------------------------------------------------------------------------------
                    -- This cte shows the GLJEDetail_Cur totals by month
                    --------------------------------------------------------------------------------------------------------------
                     , CTA as
								 (
									 select
										   DE.entitykey,
										   accountkey,
										   SUM(isnull(PostingAmount,0)) as PostingAmount
									 from
										   ETL_Staging.wrk.GLBalance_Step_2 GL (nolock)
											left join sonic_DW.dbo.Dim_Entity DE (nolock)
												on ltrim(rtrim(GL.companyid))	= ltrim(rtrim(DE.EntADPCompanyID))		--added trim functions 2-11-2014 by nwc
													and ltrim(rtrim(GL.Prefix)) = ltrim(rtrim(DE.EntAccountingPrefix))  --added trim functions 2-11-2014 by nwc
													and GL.cora_acct_id = DE.entCora_account_id
									 where
										   accountingdatekey between @BalanceForDateMonthBeginInt and @BalanceForDateInt --@BalanceForDateThisMonthEndInt
									 group by
										   DE.entitykey,
										   accountkey
								 )



                     insert into [Sonic_DW].dbo.Fact_GLBalances_test (EntityKey,AccountKey,MonthBeginDateKey,BalanceForDateKey,YTD,PostingAmount,BalAsOf,[User_ID],Meta_Src_Sys_ID,
                     Meta_ComputerName,Meta_LoadDate)
                     select
                           isnull(EE.EntityKey,aa.EntityKey)		as EntityKey			--added isnull function to default for missing values 2-11-2014 by nwc
                           , isnull(EE.AccountKey,AA.AccountKey)	as AccountKey			--added isnull function to default for missing values 2-11-2014 by nwc
                           , @BalanceForDateMonthBeginInt			as MonthBeginDateKey
                           , @BalanceForDateInt						as BalanceForDateKey
                           , isnull(EE.YTD,0)						as YTD					--added isnull function to default for missing values 2-11-2014 by nwc
                           , isnull(AA.PostingAmount,0)				as PostingAmount
                           , isnull(EE.YTD,0) + isnull(AA.PostingAmount,0) as BalAsOf		--added isnull function to default for missing values 2-11-2014 by nwc
                           ,SYSTEM_USER
                          ,1
                           ,'D1-SSIS-01'
                           ,GETDATE()----- added by raj 05-31-2017

                     from CTE EE
						--left join CTA AA
						full outer join CTA AA	--added full outer join from left join 2-11-2014 by nwc
                           on EE.EntityKey = AA.entitykey
								and EE.AccountKey = AA.accountkey

                     set @BalanceForDate = DATEADD(dd,1,@balancefordate)


                     	/***********************************************************
						----------------------------------------------------------
							OLD FINAL QUERY PRIOR TO NWC MODIFICATIONS 2-11-2014
						----------------------------------------------------------
							 select
								   EE.EntityKey,
								   EE.AccountKey,
								   @BalanceForDateMonthBeginInt,
								   @BalanceForDateInt as BalanceForDateKey,
								   EE.YTD,
								   isnull(AA.PostingAmount,0) as PostingAmount,
								   EE.YTD+isnull(AA.PostingAmount,0) as BalAsOf
							 from
								   CTE EE left join CTA AA
								   on
										  EE.EntityKey = AA.entitykey and
										  EE.AccountKey = AA.accountkey
						**************************************************************/


              end

END




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
