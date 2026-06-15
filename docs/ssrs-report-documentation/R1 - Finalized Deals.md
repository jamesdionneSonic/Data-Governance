# R1 - Finalized Deals

Generated: 2026-06-15  
SSRS path: `/RTC/R1 - Finalized Deals`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R1 - Finalized Deals`                           |
| SSRS path           | `/RTC/R1 - Finalized Deals`                      |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:42                              |
| Modified            | 2017-12-13 10:15:14                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `f`       | From   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `t`       | To     | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT oo.Name ,o.Name 'Dealership' ,vi.Stock_No 'Stock #' ,CASE WHEN LEFT(vi.stock_no,1) != 'S' THEN app.Appraised_By ELSE NULL END 'Appraiser' ,v.Year ,v.Make ,v.Model ,vi.Trim ,vi.Age ,CASE WHEN vi.Age < 21 THEN '1' WHEN vi.Age < 36 THEN '2' WHEN vi.Age < 46 THEN '3' ELSE '4' END AS 'Bucket #' ,vi.Mileage ,CASE WHEN...

## Backend Dependencies

| Object or command hint                  | Notes                                     |
| --------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory`        | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Pricing`          | Referenced by one or more report datasets |
| `sims6200.dbo.STATUS`                   | Referenced by one or more report datasets |
| `sims6200.dbo.VEHICLE`                  | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization_Association` | Referenced by one or more report datasets |
| `sims6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.FIREDealData`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Appraisal`                | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R1 - Finalized Deals`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT     oo.Name    ,o.Name  'Dealership'    ,vi.Stock_No 'Stock #'    ,CASE WHEN LEFT(vi.stock_no,1) != 'S' THEN app.Appraised_By    ELSE NULL     END 'Appraiser'    ,v.Year    ,v.Make    ,v.Model    ,vi.Trim    ,vi.Age     ,CASE WHEN vi.Age < 21 THEN '1'       WHEN vi.Age < 36 THEN '2'       WHEN vi.Age < 46 THEN '3'    ELSE '4'     END AS 'Bucket #'    ,vi.Mileage    ,CASE WHEN vi.Is_Certified = 1 THEN 'Y'   WHEN vi.Is_Certified = 0 THEN 'N'   WHEN vi.Is_Certified IS Null THEN 'N'   ELSE ''   END AS 'CPO'     ,vp.Est_Recon_Amount    ,f.ReconCostAmount    ,CASE WHEN vp.Est_Recon_Amount IS null OR f.ReconCostAmount IS null THEN NULL     ELSE f.ReconCostAmount - vp.Est_Recon_Amount     END AS 'DIFF(Recon)'       ,f.FrontCostAmount  'Front Cost'       ,vp.[Retail_Price] 'Retail Price'           ,f.FrontSaleAmount  'Sold Price'       ,Vp.Retail_Price - f.FrontSaleAmount 'Sales Gap'       ,f.FrontPUR  'Front PUR'          ,vi.Sold_Date 'Sold Date'       FROM [SIMS6200].[dbo].[Vehicle_Inventory] vi      CROSS APPLY (  SELECT TOP 1 *  FROM [SIMS6200].[dbo].[Vehicle_Pricing] vp  WHERE vi.Vehicle_ID = vp.Vehicle_ID   AND vi.Store_ID = vp.Store_ID  ORDER BY vp.Modification_Date DESC ) vp      INNER JOIN sims6200.dbo.STATUS s ON s.Status_ID = vi.Curr_Status_ID   INNER JOIN sims6200.dbo.VEHICLE v ON v.Vehicle_ID = vp.Vehicle_ID   INNER JOIN SIMS6200.dbo.Organization_Association oa ON oa.Child_Org_ID = vi.Store_ID   INNER JOIN sims6200.dbo.Organization  O ON o.Org_ID = vi.Store_ID   INNER JOIN SIMS6200.dbo.Organization  oo ON oo.Org_ID = oa.Parent_Org_ID      CROSS APPLY  (SELECT TOP 1*   FROM SIMS6200.dbo.FIREDealData F   WHERE F.StockNo = vi.Stock_No  and f.IsRetail = 'IsRetail'  ORDER BY AccountingDateKey DESC, FireDeal_Id DESC   )  f      OUTER APPLY   (SELECT TOP 1*   FROM SIMS6200.dbo.Appraisal app  WHERE app.Vehicle_ID = vi.Vehicle_ID  and app.Invtr_ID = vi.Invtr_ID   ORDER by app.Apprsl_Date DESC, app.Invtr_ID DESC ) app      WHERE    vi.Curr_Status_ID in (301,302)     AND vi.Invtr_Type=10     AND vi.Sold_Date BETWEEN @f and @t    AND o.Is_Act = 1     AND F.DealStatus = 'F'    AND vi.Store_ID not in (0,109,175)
```
