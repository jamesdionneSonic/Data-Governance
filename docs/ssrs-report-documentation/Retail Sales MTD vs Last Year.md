# Retail Sales MTD vs Last Year

Generated: 2026-06-15  
SSRS path: `/BI - FPnA/Retail Sales MTD vs Last Year`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Retail Sales MTD vs Last Year`                  |
| SSRS path           | `/BI - FPnA/Retail Sales MTD vs Last Year`       |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2017-12-13 17:59:03                              |
| Modified            | 2017-12-13 17:59:03                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                    | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------ | ---------------------------- | --------------- | ------- |
| `COR_BISQL_01`    | `/BI - FPnA/DataSource/COR-BISQL-01` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt   | Type     | Notes                                                |
| --------- | -------- | -------- | ---------------------------------------------------- |
| `BegDate` | Beg Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `EndDate` | End Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `Retail_Sales_MTD_lastyear` (Text): WITH VSC AS (SELECT DISTINCT c.related_acctg_cora_acct_id, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model FROM [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v INNER JOIN [COR-SQL-02].DMS.dbo.dm_cora_account AS c ON v.cora_acct_id = c.cora_acct_id WHERE (v.contractdate >= ...

## Backend Dependencies

| Object or command hint                   | Notes                                     |
| ---------------------------------------- | ----------------------------------------- |
| `COR-SQL-02.DMS.dbo.vehiclesalescurrent` | Referenced by one or more report datasets |
| `COR-SQL-02.DMS.dbo.dm_cora_account`     | Referenced by one or more report datasets |
| `factFIRE`                               | Referenced by one or more report datasets |
| `dim_FIGLAccounts`                       | Referenced by one or more report datasets |
| `Dim_Entity`                             | Referenced by one or more report datasets |
| `Dim_Date`                               | Referenced by one or more report datasets |
| `dim_DealType`                           | Referenced by one or more report datasets |
| `VSC`                                    | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales MTD vs Last Year`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Retail_Sales_MTD_lastyear

Type: `Text`

```sql
WITH VSC AS (SELECT DISTINCT c.related_acctg_cora_acct_id, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model                                FROM            [COR-SQL-02].DMS.dbo.vehiclesalescurrent AS v INNER JOIN                                                          [COR-SQL-02].DMS.dbo.dm_cora_account AS c ON v.cora_acct_id = c.cora_acct_id                                WHERE        (v.contractdate >= '11/01/2011') AND (v.stockno IS NOT NULL) AND (v.dealno IS NOT NULL) AND (v.vin IS NOT NULL))     SELECT        e.EntEssCode, e.EntBrand, e.EntRegion, e.EntHFMDealershipName,                                CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN d .DealTypeCode = 'Lease' THEN 'New' WHEN d .DealTypeCode = 'Demo' THEN 'New' ELSE                                d .DealTypeCode END AS Sale_Type, f.fiwipstatuscode AS DealStatus, t.CalendarYear, t.DayName, t.FullDate AS SaleDate, f.StockNo, VSC_1.ModelYear,                                VSC_1.Make, VSC_1.Model, VSC_1.VIN, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                AS FrontSaleAmount, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)                                - SUM(CASE WHEN a.FIAccountType = 'C' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross_noPackDoc,                                SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END)                                AS PackDoc, SUM(CASE WHEN FIAccountType = 'S' AND FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) - SUM(CASE WHEN FIAccountType = 'C' AND                                FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) + SUM(CASE WHEN FIAccountType = 'D' AND FIGLProductCategoryKey = 15 AND                                FIAccountCategory IN ('Pack', 'Doc Fees') THEN (Amount * - 1) ELSE 0 END) AS FrontGross_withPackDoc      FROM            factFIRE AS f WITH (NOLOCK) INNER JOIN                               dim_FIGLAccounts AS a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN                               Dim_Entity AS e ON e.EntityKey = f.EntityKey INNER JOIN                               Dim_Date AS t ON f.AccountingDateKey = t.DateKey INNER JOIN                               dim_DealType AS d ON d.DealTypeKey = f.DealTypeKey LEFT OUTER JOIN                               VSC AS VSC_1 ON e.EntCora_Account_ID = VSC_1.related_acctg_cora_acct_id AND f.StockNo = VSC_1.stockno AND f.dealno = VSC_1.dealno      WHERE        (t.FullDate BETWEEN DATEADD(yy, - 1, @BegDate) AND DATEADD(yy, - 1, @EndDate) OR                               t.FullDate BETWEEN @BegDate AND @EndDate) AND (a.FIAccountClassification IN ('New', 'Used')) AND (f.IsRetail = 'IsRetail') AND (e.EntActive = 'Active') AND                                (d.DealTypeCode NOT IN ('Fleet', 'Wholesale'))      GROUP BY e.EntEssCode, e.EntBrand, e.EntRegion, e.EntHFMDealershipName, f.fiwipstatuscode, t.CalendarYear, t.DayName, t.FullDate,                                CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN d .DealTypeCode = 'Lease' THEN 'New' WHEN d .DealTypeCode = 'Demo' THEN 'New' ELSE                                d .DealTypeCode END, f.StockNo, VSC_1.ModelYear, VSC_1.Make, VSC_1.Model, VSC_1.VIN      HAVING         (SUM(CASE WHEN f.IsRetail = 'IsRetail' AND FIGLProductCategory = 'FrontGross' AND FIAccountType = 'S' THEN f.statcount ELSE 0 END) = 1)      ORDER BY e.EntEssCode, SaleDate
```
