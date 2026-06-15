# Retail Sales Report_CleanGross

Generated: 2026-06-15  
SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Retail Sales Report_CleanGross`                 |
| SSRS path           | `/BI - FPnA/Retail Sales Report_CleanGross`      |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-08-15 13:39:34                              |
| Modified            | 2017-12-13 17:59:05                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                    | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------ | ---------------------------- | --------------- | ------- |
| `COR_BISQL_01`    | `/BI - FPnA/DataSource/COR-BISQL-01` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt      | Type     | Notes                                                |
| ------------ | ----------- | -------- | ---------------------------------------------------- |
| `BegDate`    | Beg Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `DealStatus` | Deal Status | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `EndDate`    | End Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DealTypes` (Text): select 'F' as DealType union select 'B'
2. Dataset `Retail_Sales_MTD_lastyear` (Text): -------------------------------------------------------------------------------------------------------------------- --view to pull vehicle information --GOOD -------------------------------------------------------------------------------------------------------------------- WITH VSC AS ( SELECT DISTINCT c.related_acct...

## Backend Dependencies

| Object or command hint                   | Notes                                     |
| ---------------------------------------- | ----------------------------------------- |
| `COR-SQL-02.DMS.dbo.vehiclesalescurrent` | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.dm_cora_account`     | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.glschedule`          | Referenced by one or more report datasets |
| `Sonic_DW.dbo.factFIRE`                  | Referenced by one or more report datasets |
| `Sonic_DW.dbo.dim_DealType`              | Referenced by one or more report datasets |
| `Sonic_DW.dbo.dim_entity`                | Referenced by one or more report datasets |
| `Sonic_DW.dbo.dim_FIGLAccounts`          | Referenced by one or more report datasets |
| `Sonic_DW.dbo.dim_Date`                  | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DealTypes

Type: `Text`

```sql
select 'F' as DealType union  select 'B'
```

#### Retail_Sales_MTD_lastyear

Type: `Text`

```sql
-------------------------------------------------------------------------------------------------------------------- --view to pull vehicle information  --GOOD -------------------------------------------------------------------------------------------------------------------- WITH VSC AS                            ( SELECT DISTINCT c.related_acctg_cora_acct_id as acctg_cora                                                                                     ,v.stockno as stockno                                                                                     ,v.dealno as dealno                                                                                     ,v.vin as VIN                                                                                     ,v.[year] as ModelYear                                                                                     ,v.makename as Make                                                                                     ,v.modelname as Model                                                                                     ,v.color as color                                                                                     -- ,v.vehiclemileage as Mileage                                                                                                                           FROM [COR-SQL-02].DMS.dbo.vehiclesalescurrent v (nolock)                                                                   JOIN [COR-SQL-02].DMS.dbo.dm_cora_account c (nolock)                                                                   on v.cora_acct_id = c.cora_acct_id                                                                   WHERE v.fiwipstatuscode IN ('F','B')                                                                   and v.dealevent2date >= @BegDate   ---ADD DYNAMIC DATE FILTER HERE---- using booked date, but should it be contract date??                                                                                                                      )  ----------------------------------------------------------------------------------------------------------------------------      ------view to pull aging of vehicles   ----------------------------------------------------------------------------------------------------------------------                                                            , Schedule as (                         SELECT companyid as  companyid                                 ,control as control                                 ,YEAR(currentmonth) as SchedYear                                 ,MONTH(currentmonth) as SchedMonth                                 ,MIN(dateofoldestscheditem)as StockDate                           FROM [COR-SQL-02].DMS.dbo.glschedule nolock                           where currentmonth between dateadd(m,-2,@BegDate)  and @EndDate ---ADD DYNAMIC DATE HERE where it equals the first day of the starting date month                                  and  (RIGHT(accountnumber,4) IN ('2320','2340','2300','2341') --used inventory                                             or RIGHT(accountnumber,4) between '2400' and '2405') --new inventory                                                                GROUP BY                                  companyid                                 ,control                                 ,YEAR(currentmonth)                                 ,MONTH(currentmonth)                         )  ,Details as (                        SELECT e.EntCora_Account_ID ,e.EntADPCompanyID ,e.EntAccountingPrefix ,e.EntEssCode ,e.EntBrand ,e.EntRegion ,e.EntDealerLvl1  ,CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Lease' THEN 'New'         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Demo' THEN 'New'         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Fleet' THEN 'New'         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Wholesale' THEN 'Used'         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Rental'     THEN 'Used'         WHEN f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Misc' THEN 'Unknown'         ELSE d.DealTypeCode END AS AcctgDealType ,f.fiwipstatuscode as DealStatus ,f.StockNo ,MAX(f.dealno) as dealno ,CASE WHEN MAX(f.VehicleMileage) = -1 then NULL       ELSE MAX(f.VehicleMileage) end AS Mileage        ,t.CalendarYear                ,t.MonthNumberOfYear ,MIN(t.FullDate) as AccountingDate ,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)   AS FrontSaleAmount ,SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)   AS FrontCostAmount ,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15        THEN Amount                           ELSE 0 END)       -SUM(CASE WHEN a.FIAccountType = 'C' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)   AS FrontGross_noPackDoc ,SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)       - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)       + SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory IN ( 'Pack', 'Doc Fees' )       THEN ( Amount * -1 )       ELSE 0 END)   AS FrontGross_wPackDoc ,SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)       - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)       - SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15        THEN Amount       ELSE 0 END)   AS FrontGross_wPackDocFactory$   ,SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory IN ( 'Pack', 'Doc Fees' )       THEN (Amount*-1)       ELSE 0 END)   AS PackDoc ,SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Factory $'        THEN (Amount*-1)       ELSE 0 END)   AS Factory_$ ,SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Other'        THEN (Amount*-1)       ELSE 0 END)   AS Other ,SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey <> 15 THEN Amount       ELSE 0 END)       - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey <> 15 THEN Amount       ELSE 0 END)   AS BackGross ,SUM(CASE WHEN ( FIAccountType = 'C' AND SUBSTRING(CONVERT(VARCHAR(4), FIAccount), 4, 1) IN ('1', '3', '5', '7', '9' ) AND FIAccount BETWEEN '6301' AND '6347')       THEN Amount       ELSE 0 END)   AS Recon ,SUM(CASE when a.FIGLProductCategoryKey = 15 and a.FIAccountType = 'S' then f.statcount else 0 end)   AS Deal_Count         FROM Sonic_DW.dbo.factFIRE f  JOIN Sonic_DW.dbo.dim_DealType d on f.DealTypeKey = d.DealTypeKey JOIN Sonic_DW.dbo.dim_entity e ON f.EntityKey = e.EntityKey JOIN Sonic_DW.dbo.dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey JOIN Sonic_DW.dbo.dim_Date t ON f.Accountingdatekey = t.DateKey              WHERE f.AccountingDateKey between  CONVERT(int,CONVERT(varchar(8),@BegDate,112))  and  CONVERT(int,CONVERT(varchar(8),@EndDate,112))    and f.fiwipstatuscode IN ('F','B')          and f.IsRetail = 'IsRetail' and e.EntActive = 'Active'  GROUP BY  e.EntCora_Account_ID ,e.EntADPCompanyID ,e.EntAccountingPrefix ,e.EntEssCode ,e.EntBrand ,e.EntRegion ,e.EntDealerLvl1 ,t.CalendarYear                ,t.MonthNumberOfYear  ,case when f.fiwipstatuscode = 'F'       then a.FIAccountClassification       when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Lease'       then 'New'       when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Demo'       then 'New'       when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Fleet'       then 'New'       when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Wholesale'       then 'Used'       when f.fiwipstatuscode <> 'F' and d.DealTypeCode = 'Rental'
```
