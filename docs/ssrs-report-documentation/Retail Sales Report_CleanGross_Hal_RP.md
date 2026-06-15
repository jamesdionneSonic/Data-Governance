# Retail Sales Report_CleanGross_Hal_RP

Generated: 2026-06-15  
SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_RP`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                              |
| ------------------- | -------------------------------------------------- |
| Report name         | `Retail Sales Report_CleanGross_Hal_RP`            |
| SSRS path           | `/BI - FPnA/Retail Sales Report_CleanGross_Hal_RP` |
| Status signal       | Active                                             |
| Created             | 2016-11-30 15:46:31                                |
| Modified            | 2017-12-13 17:59:12                                |
| Modified by         | SONIC\Mark.Starnes                                 |
| Last 6 months usage | 82 executions by 1 users                           |
| Last execution      | 2026-06-15 10:00:12                                |
| Subscriptions       | 1                                                  |

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
2. Dataset `Retail_Sales_MTD_lastyear` (Text): WITH VSC AS (SELECT DISTINCT c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model, v.color ,v.age,vi.price1 FROM [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v WITH (nolock) INNER JOIN [COR-SQL-02].DMS.dbo.dm_cora_account AS c WITH (...

## Backend Dependencies

| Object or command hint                   | Notes                                     |
| ---------------------------------------- | ----------------------------------------- |
| `COR-SQL-02.DMS.dbo.vehiclesalescurrent` | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.dm_cora_account`     | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.vehicle`             | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.glschedule`          | Referenced by one or more report datasets |
| `factFIRE`                               | Referenced by one or more report datasets |
| `dim_DealType`                           | Referenced by one or more report datasets |
| `Dim_Entity`                             | Referenced by one or more report datasets |
| `dim_FIGLAccounts`                       | Referenced by one or more report datasets |
| `Dim_Date`                               | Referenced by one or more report datasets |
| `Cor-epsqldb-01`                         | Referenced by one or more report datasets |
| `lastpriceEPID`                          | Referenced by one or more report datasets |
| `COR-RARDB-05`                           | Referenced by one or more report datasets |
| `lastpriceSonicID`                       | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_RP`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

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
WITH VSC AS (SELECT DISTINCT                                                           c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model,                                                           v.color ,v.age,vi.price1                                FROM            [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v WITH (nolock) INNER JOIN                                                          [COR-SQL-02].DMS.dbo.dm_cora_account AS c WITH (nolock) ON v.cora_acct_id = c.cora_acct_id                inner join [cor-sql-02].dms.dbo.vehicle vi with (nolock) on v.accountingaccount = vi.accountingaccount and v.vin = vi.vin and v.dealno = vi.dealno                                WHERE        (v.fiwipstatuscode IN ('F', 'B')) AND (v.dealevent2date >= @BegDate))  , Schedule AS      (SELECT        companyid, control, max(YEAR(currentmonth)) AS SchedYear, max(MONTH(currentmonth)) AS SchedMonth, min(dateofoldestscheditem) AS StockDate       FROM            [COR-SQL-02].DMS.dbo.glschedule AS nolock       WHERE        (currentmonth BETWEEN DATEADD(m, - 2, @BegDate) AND @EndDate) AND (RIGHT(accountnumber, 4) IN ('2320', '2340', '2300', '2341') OR                                 RIGHT(accountnumber, 4) BETWEEN '2400' AND '2405')  --and control = 'TAD615015'        GROUP BY companyid, control--, max(YEAR(currentmonth)), max(MONTH(currentmonth)) ) , Details AS     (SELECT        e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEssCode, e.EntBrand, e.EntRegion, e.EntDealerLvl1,                                  CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Lease' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Demo' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Fleet' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Wholesale' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Rental' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Misc' THEN 'Unknown' ELSE d .DealTypeCode END AS AcctgDealType, f.fiwipstatuscode AS DealStatus, f.StockNo, MAX(f.dealno) AS dealno,                                  CASE WHEN MAX(f.VehicleMileage) = - 1 THEN NULL ELSE MAX(f.VehicleMileage) END AS Mileage, t.CalendarYear, t.MonthNumberOfYear, MIN(t.FullDate)                                  AS AccountingDate, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontSaleAmount,                                  SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontCostAmount,                                  SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross_noPackDoc, SUM(CASE WHEN FIAccountType = 'S' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                  + SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END)                                  AS FrontGross_wPackDoc, SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                  - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'D' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross_wPackDocFactory$, SUM(CASE WHEN FIAccountType = 'D' AND                                  FIGLProductCategoryKey = 15 AND FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END) AS PackDoc,                                  SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Factory $' THEN (Amount * - 1) ELSE 0 END) AS Factory_$,                                  SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Other' THEN (Amount * - 1) ELSE 0 END) AS Other,                                  SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'C' AND                                  FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS BackGross, SUM(CASE WHEN (FIAccountType = 'C' AND SUBSTRING(CONVERT(VARCHAR(4),                                  FIAccount), 4, 1) IN ('1', '3', '5', '7', '9') AND FIAccount BETWEEN '6301' AND '6347') THEN Amount ELSE 0 END) AS Recon,                                  SUM(CASE WHEN a.FIGLProductCategoryKey = 15 AND a.FIAccountType = 'S' THEN f.statcount ELSE 0 END) AS Deal_Count       FROM            factFIRE AS f INNER JOIN                                 dim_DealType AS d ON f.DealTypeKey = d.DealTypeKey INNER JOIN                                 Dim_Entity AS e ON f.EntityKey = e.EntityKey INNER JOIN                                 dim_FIGLAccounts AS a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN                                 Dim_Date AS t ON f.AccountingDateKey = t.DateKey       WHERE        (f.AccountingDateKey BETWEEN CONVERT(int, CONVERT(varchar(8), @BegDate, 112)) AND CONVERT(int, CONVERT(varchar(8), @EndDate, 112))) AND                                  (f.fiwipstatuscode IN ('F', 'B')) AND (f.IsRetail = 'IsRetail') AND (e.EntActive = 'Active')       GROUP BY e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEssCode, e.EntBrand, e.EntRegion, e.EntDealerLvl1, t.CalendarYear,                                  t.MonthNumberOfYear, CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Lease' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Demo' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Fleet' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Wholesale' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Rental' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Misc' THEN 'Unknown' ELSE d .DealTypeCode END,                                  f.fiwipstatuscode, f.StockNo)  , lastpriceEPID as ( SELECT vi.Vehicle_ID,vi.Store_ID,max(vi.Invtr_ID)Invtr_ID,vi.Stock_No,v.UVC,v.vin                FROM [Cor-epsqldb-01\epsqldb01].SIMS6200.dbo.vehicle_inventory vi (nolock)                LEFT JOIN [Cor-epsqldb-01\epsqldb01].SIMS6200.dbo.vehicle v (nolock) ON vi.Vehicle_ID = v.Vehicle_ID --where vi.Vehicle_ID = 699404 group by vi.Vehicle_ID,vi.Store_ID,vi.Stock_No,v.UVC,v.vin ) ,lastpriceEP as ( select lpid.*,vp.Retail_Price from lastpriceEPID lpid inner join  [Cor-epsqldb-01\epsqldb01].SIMS6200.dbo.vehicle_pricing vp (nolock) ON vp.vehicle_id = lpid.vehicle_id AND vp.store_id = lpid.store_id AND vp.invtr_id = lpid.invtr_id )   , lastpriceSonicID as ( SELECT vi.Vehicle_ID,vi.Store_ID,max(vi.Invtr_ID)Invtr_ID,vi.Stock_No,v.UVC,v.vin                FROM [COR-RARDB-05\RARDB01].SIMS6200.dbo.vehicle_inventory vi (nolock)                LEFT JOIN [COR-RARDB-05\RARDB01].SIMS6200.dbo.vehicle v (nolock) ON vi.Vehicle_ID = v.Vehicle_ID --where vi.Vehicle_ID = 699404 group by vi.Vehicle_ID,vi.Store_ID,vi.Stock_No,v.UVC,v.vin ) ,lastpriceSonic as ( select lpid.*,vp.Retail_Price from lastpriceSonicID lpid inner join  [COR-RARDB-05\RARDB01].SIMS6200.dbo.vehicle_pricing vp (nolock) ON vp.vehicle_id = lpid.vehicle_id AND vp.store_id = lpid.store_id AN
```
