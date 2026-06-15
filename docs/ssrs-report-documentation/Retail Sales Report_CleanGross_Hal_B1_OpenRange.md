# Retail Sales Report_CleanGross_Hal_B1_OpenRange

Generated: 2026-06-15  
SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1_OpenRange`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Report name         | `Retail Sales Report_CleanGross_Hal_B1_OpenRange`            |
| SSRS path           | `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1_OpenRange` |
| Status signal       | Review candidate: no executions in last 6 months             |
| Created             | 2015-11-20 11:29:55                                          |
| Modified            | 2017-12-13 17:59:09                                          |
| Modified by         | SONIC\Mark.Starnes                                           |
| Last 6 months usage | 0 executions by 0 users                                      |
| Last execution      | NULL                                                         |
| Subscriptions       | 0                                                            |

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
2. Dataset `Retail_Sales_MTD_lastyear` (Text): WITH VSC AS (SELECT DISTINCT c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model, v.color ,v.age FROM [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v WITH (nolock) INNER JOIN [COR-SQL-02].DMS.dbo.dm_cora_account AS c WITH (nolock) ON...

## Backend Dependencies

| Object or command hint                   | Notes                                     |
| ---------------------------------------- | ----------------------------------------- |
| `COR-SQL-02.DMS.dbo.vehiclesalescurrent` | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.dm_cora_account`     | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.glschedule`          | Referenced by one or more report datasets |
| `factFIRE`                               | Referenced by one or more report datasets |
| `dim_DealType`                           | Referenced by one or more report datasets |
| `Dim_Entity`                             | Referenced by one or more report datasets |
| `dim_FIGLAccounts`                       | Referenced by one or more report datasets |
| `Dim_Date`                               | Referenced by one or more report datasets |
| `Details`                                | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1_OpenRange`.
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
WITH VSC AS (SELECT DISTINCT                                                           c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model,                                                           v.color ,v.age                                FROM            [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v WITH (nolock) INNER JOIN                                                          [COR-SQL-02].DMS.dbo.dm_cora_account AS c WITH (nolock) ON v.cora_acct_id = c.cora_acct_id                                WHERE        (v.fiwipstatuscode IN ('F', 'B')) AND (v.dealevent2date >= @BegDate))  , Schedule AS      (SELECT        companyid, control, max(YEAR(currentmonth)) AS SchedYear, max(MONTH(currentmonth)) AS SchedMonth, min(dateofoldestscheditem) AS StockDate       FROM            [COR-SQL-02].DMS.dbo.glschedule AS nolock       WHERE        (currentmonth BETWEEN DATEADD(m, - 2, @BegDate) AND @EndDate) AND (RIGHT(accountnumber, 4) IN ('2320', '2340', '2300', '2341') OR                                 RIGHT(accountnumber, 4) BETWEEN '2400' AND '2405')  --and control = 'TAD615015'        GROUP BY companyid, control--, max(YEAR(currentmonth)), max(MONTH(currentmonth)) ) , Details AS     (SELECT        e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEssCode, e.EntBrand, e.EntRegion, e.EntDealerLvl1,                                  CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Lease' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Demo' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Fleet' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Wholesale' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Rental' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Misc' THEN 'Unknown' ELSE d .DealTypeCode END AS AcctgDealType, f.fiwipstatuscode AS DealStatus, f.StockNo, MAX(f.dealno) AS dealno,                                  CASE WHEN MAX(f.VehicleMileage) = - 1 THEN NULL ELSE MAX(f.VehicleMileage) END AS Mileage, t.CalendarYear, t.MonthNumberOfYear, MIN(t.FullDate)                                  AS AccountingDate, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontSaleAmount,                                  SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontCostAmount,                                  SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross_noPackDoc, SUM(CASE WHEN FIAccountType = 'S' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                  + SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END)                                  AS FrontGross_wPackDoc, SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                  - SUM(CASE WHEN FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'D' AND                                  FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross_wPackDocFactory$, SUM(CASE WHEN FIAccountType = 'D' AND                                  FIGLProductCategoryKey = 15 AND FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END) AS PackDoc,                                  SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Factory $' THEN (Amount * - 1) ELSE 0 END) AS Factory_$,                                  SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Other' THEN (Amount * - 1) ELSE 0 END) AS Other,                                  SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'C' AND                                  FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS BackGross, SUM(CASE WHEN (FIAccountType = 'C' AND SUBSTRING(CONVERT(VARCHAR(4),                                  FIAccount), 4, 1) IN ('1', '3', '5', '7', '9') AND FIAccount BETWEEN '6301' AND '6347') THEN Amount ELSE 0 END) AS Recon,                                  SUM(CASE WHEN a.FIGLProductCategoryKey = 15 AND a.FIAccountType = 'S' THEN f.statcount ELSE 0 END) AS Deal_Count       FROM            factFIRE AS f INNER JOIN                                 dim_DealType AS d ON f.DealTypeKey = d.DealTypeKey INNER JOIN                                 Dim_Entity AS e ON f.EntityKey = e.EntityKey INNER JOIN                                 dim_FIGLAccounts AS a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN                                 Dim_Date AS t ON f.AccountingDateKey = t.DateKey       WHERE        (f.AccountingDateKey BETWEEN CONVERT(int, CONVERT(varchar(8), @BegDate, 112)) AND CONVERT(int, CONVERT(varchar(8), @EndDate, 112))) AND                                  (f.fiwipstatuscode IN ('F', 'B')) AND (f.IsRetail = 'IsRetail') AND (e.EntActive = 'Active')       GROUP BY e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntEssCode, e.EntBrand, e.EntRegion, e.EntDealerLvl1, t.CalendarYear,                                  t.MonthNumberOfYear, CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Lease' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Demo' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Fleet' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Wholesale' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND                                  d .DealTypeCode = 'Rental' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Misc' THEN 'Unknown' ELSE d .DealTypeCode END,                                  f.fiwipstatuscode, f.StockNo)     SELECT        f.EntCora_Account_ID, f.EntADPCompanyID, f.EntAccountingPrefix, f.EntEssCode, f.EntBrand, f.EntRegion, f.EntDealerLvl1, f.AcctgDealType, f.DealStatus,                                f.StockNo, LEFT(f.StockNo, 1) AS StockPrefix, f.dealno, VSC_1.ModelYear, VSC_1.Make, VSC_1.Model, VSC_1.color, VSC_1.VIN, f.Mileage, f.AccountingDate,                                s.StockDate, CASE WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) < 0 THEN 0 ELSE DATEDIFF(dd, s.StockDate, f.AccountingDate) END AS Age,                                CASE WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) < 0 THEN 1 WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) BETWEEN 0 AND                                20 THEN 1 WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) BETWEEN 21 AND 35 THEN 2 WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) BETWEEN                                36 AND 45 THEN 3 WHEN DATEDIFF(dd, s.StockDate, f.AccountingDate) > 45 THEN 4 ELSE '' END AS AgeBucket, f.FrontSaleAmount, f.FrontCostAmount,                                f.FrontGross_noPackDoc, f.FrontGross_wPackDoc, f.FrontGross_wPackDocFactory$, CASE WHEN f.FrontCostAmount = 0 AND                                dealstatus = 'b' THEN 0 ELSE f.FrontGross_wPackDocFactory$ END AS FrontGross_wPackDocFactory$_, f.PackDoc, f.Factory_$, f.Other, f.BackGross, f.Recon,                                f.Deal_Count ,VSC_1.age      FROM            Details AS f LEFT OU
```
