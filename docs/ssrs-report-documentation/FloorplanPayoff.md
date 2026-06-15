# FloorplanPayoff

Generated: 2026-06-15  
SSRS path: `/BI - Shared Services/FloorplanPayoff`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports floorplan payoff or floorplan reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `FloorplanPayoff`                                |
| SSRS path           | `/BI - Shared Services/FloorplanPayoff`          |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2016-04-22 16:25:18                              |
| Modified            | 2019-01-02 10:27:52                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 1                                                |

## Shared Data Sources

| Report datasource | Shared datasource                          | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Shared Services/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `FloorplanPayoff` (Text): -------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------Shared Services Floorplan Payoff Report (based on CFPA report in CDK)----------------------------------------------- -------------...

## Backend Dependencies

| Object or command hint        | Notes                                     |
| ----------------------------- | ----------------------------------------- |
| `L1-5FSQL-01`                 | Referenced by one or more report datasets |
| `dms.dbo.glschedule`          | Referenced by one or more report datasets |
| `DMS.dbo.glschedulexref`      | Referenced by one or more report datasets |
| `dms.dbo.gljedetail_cur`      | Referenced by one or more report datasets |
| `DMS.dbo.vehiclesalescurrent` | Referenced by one or more report datasets |
| `DMS.dbo.dm_cora_account`     | Referenced by one or more report datasets |
| `DMS.dbo.customer`            | Referenced by one or more report datasets |
| `dms.dbo.dm_dms_server`       | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Shared Services/FloorplanPayoff`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### FloorplanPayoff

Type: `Text`

```sql
-------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------Shared Services Floorplan Payoff Report (based on CFPA report in CDK)----------------------------------------------- ------------------------------------------Version 1.1 - 4/22/2016 - Lindsay DePree/Mark Starnes---------------------------------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------  --Set variable dates  declare @scheddate as date declare @scheddatelm as date  select @scheddate = CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(GETDATE())-1),GETDATE()),101)  --first day of current month select @scheddatelm =  CONVERT(VARCHAR(25),DATEADD(m,-1,DATEADD(dd,-(DAY(GETDATE())-1),GETDATE())),101) --first day of last month  --Bring in big tables...  IF OBJECT_ID ('tempdb..#dim_account') is not null drop table #dim_account; select a.AccCoraAcctId, a.AccCompanyId, a.AccAccountNumber, a.AccPrefix  into #dim_account  from [L1-5FSQL-01,12013].Sonic_DW.dbo.dim_account  a   IF OBJECT_ID ('tempdb..#SchedTemp') is not null drop table #SchedTemp; SELECT gls.cora_acct_id ,gls.companyid ,gls.accountnumber ,gls.schedulenumber ,gls.control ,gls.dateofoldestscheditem ,gls.currentmonth into #SchedTemp  from dms.dbo.glschedule (nolock) gls WHERE gls.schedulenumber IN ('576','577','578','596','597','598') and gls.currentmonth in(@scheddate,@scheddatelm)   IF OBJECT_ID ('tempdb..#SchedLatestMonth') is not null drop table #SchedLatestMonth;       select cora_acct_id, companyid,max(currentmonth) currentmonth  into #SchedLatestMonth from #SchedTemp  group by cora_acct_id, companyid  --IF OBJECT_ID ('tempdb..#SchedxrefTemp') is not null drop table #SchedxrefTemp; --SELECT cora_acct_id --,companyid --,schedulenumber --,control --,accountnumber --,currentmonth --,dtljournalid --,dtlrefer --,dtlaccountingdate --,dtlpostingtime --,dtlpostingsequence --INTO #SchedxrefTemp --FROM [DMS].[dbo].[glschedulexref] --WHERE schedulenumber in ('576','577','578') --and currentmonth in(@scheddate,@scheddatelm)   ----------Floorplan Schedule-------- IF OBJECT_ID ('tempdb..#Floorplan') is not null drop table #Floorplan; SELECT  s.cora_acct_id ,s.companyid ,s.currentmonth ,e.entdealerlvl0 as Dealership ,s.accountnumber ,s.schedulenumber ,s.control ,SUM(d.postingamount) as Balance ,s.dateofoldestscheditem ,MIN(d.accountingdate) as min_acctgdate ,MAX(d.accountingdate) as max_acctgdate INTO #Floorplan FROM #schedtemp (nolock)s  --LEFT JOIN #SchedxrefTemp x LEFT JOIN [DMS].[dbo].[glschedulexref] (nolock)x on s.cora_acct_id = x.cora_acct_id and s.companyid = x.companyid and s.schedulenumber = x.schedulenumber and s.control = x.control and s.accountnumber = x.accountnumber and s.currentmonth = x.currentmonth LEFT JOIN dms.dbo.gljedetail_cur (nolock)d on x.cora_acct_id = d.cora_acct_id and x.companyid = d.companyid and x.dtljournalid = d.journalid and x.dtlrefer = d.refer and x.dtlaccountingdate = d.accountingdate and x.dtlpostingtime = d.postingtime and x.dtlpostingsequence =d.postingsequence JOIN #SchedLatestMonth cm on s.cora_acct_id = cm.cora_acct_id and s.companyid = cm.companyid and s.currentmonth = cm.currentmonth LEFT JOIN #dim_account a --[L1-5FSQL-01,12013].Sonic_DW.dbo.dim_account a  on s.cora_acct_id = a.AccCoraAcctId and s.companyid = a.AccCompanyId and s.accountnumber = a.AccAccountNumber LEFT JOIN [L1-5FSQL-01,12013].Sonic_DW.dbo.dim_entity e  on s.cora_acct_id = e.EntCora_Account_ID and s.companyid = e.EntADPCompanyID and a.AccPrefix = e.EntAccountingPrefix WHERE e.EntActive = 'Active' and e.EntCOAType = 'Dealership' and e.EntADPCompanyID IN('313','401','434','140','141','433','403','305','308','411','149','230','254','245','255','235' ,'226','234','166','171','432','108','201','202','211','143','144','110','105','148','410','449','412','315','413','423' ,'231','203','233','129','130','238','239','252','253','102','154','212','420','302','304','241','426','159','161','168','146' ,'220','104','173') --filtered to dealerships provided by Bernie that are in scope (floored with BofA) GROUP BY s.cora_acct_id,s.companyid,s.currentmonth,e.entdealerlvl0,s.accountnumber,s.schedulenumber,s.control,s.dateofoldestscheditem   ------Used to filter out floorplan balances that offset across FP accounts----- IF OBJECT_ID ('tempdb..#Filter') is not null drop table #Filter; SELECT  cora_acct_id ,companyid ,control ,SUM(Balance) as Floorplan_Bal INTO #Filter FROM #Floorplan GROUP BY cora_acct_id ,companyid ,control HAVING SUM(Balance) <> 0   -----REPORT----------- SELECT b.server_disp_nm as CDK_Box ,f.companyid ,f.Dealership ,f.currentmonth ,f.accountnumber ,f.Balance as Floorplan_Bal ,f.control ,v.vin ,v.makename as Make ,v.modelname as Model ,v.custno ,c.name1 as Customer ,v.fiwipstatuscode as FI_Status ,v.dealno as FI_Dealno ,v.contractdate as FI_ContractDate ,datediff(dd,v.contractdate,getdate()) age --,v.age ,v.financesource ,v.saletype FROM #Floorplan f JOIN #Filter x on f.cora_acct_id = x.cora_acct_id and f.companyid = x.companyid and f.control =x.control JOIN (SELECT d.related_acctg_cora_acct_id,dms_server_id,vsc.*             FROM DMS.dbo.vehiclesalescurrent vsc             JOIN DMS.dbo.dm_cora_account d             on vsc.cora_acct_id = d.cora_acct_id             WHERE fiwipstatuscode IN ('F','I','B')) as v on f.cora_acct_id = v.related_acctg_cora_acct_id and f.control = v.stockno LEFT JOIN DMS.dbo.customer c on f.cora_acct_id = c.cora_acct_id and v.custno = c.custno and SUBSTRING(c.hostitemid,3,38) = c.custno ---to deal with customer hostitemid duplicate issue  LEFT JOIN dms.dbo.dm_dms_server b on v.dms_server_id = b.dms_server_id WHERE f.Balance < 0 ORDER BY b.server_disp_nm,f.companyid, v.age desc   drop table #dim_account; drop table #SchedTemp; drop table #SchedLatestMonth; --drop table #SchedxrefTemp; drop table #Floorplan; drop table #Filter;
```
