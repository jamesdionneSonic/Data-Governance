# ZR - Price_Overrides_Updated_KLor

Generated: 2026-06-15  
SSRS path: `/RTC/ZR - Price_Overrides_Updated_KLor`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `ZR - Price_Overrides_Updated_KLor`              |
| SSRS path           | `/RTC/ZR - Price_Overrides_Updated_KLor`         |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 13:43:29                              |
| Modified            | 2017-12-13 10:15:33                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): CREATE TABLE #Priceovr (Dealership varchar(50),VIN varchar(17),Stock# varchar(50),PostDate DATETIME,Status varchar(50),Age numeric(4),Year numeric(4),Make varchar(50),Model varchar(50),Trim varchar(125),Mileage numeric(6), Color varchar(50),CPO varchar(2),CARFAX varchar(50),AUTOCHECK varchar(50),RetailPrice numeric(18,...

## Backend Dependencies

| Object or command hint                  | Notes                                     |
| --------------------------------------- | ----------------------------------------- |
| `RA_SIMS.DBO.Price_Recommendations`     | Referenced by one or more report datasets |
| `SIMS6200.dbo.vehicle`                  | Referenced by one or more report datasets |
| `FOR`                                   | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization_Association` | Referenced by one or more report datasets |
| `sims6200.dbo.vehicle_inventory`        | Referenced by one or more report datasets |
| `SIMS6200.dbo.STATUS`                   | Referenced by one or more report datasets |
| `sims6200.dbo.Vehicle_Pricing`          | Referenced by one or more report datasets |
| `SIMS6200.dbo.External_Vehicle_Data`    | Referenced by one or more report datasets |
| `SIMS6200.dbo.EXTERNAL_REPORT_ICON`     | Referenced by one or more report datasets |
| `SIMS6`                                 | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/ZR - Price_Overrides_Updated_KLor`.
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
CREATE TABLE #Priceovr (Dealership varchar(50),VIN varchar(17),Stock# varchar(50),PostDate DATETIME,Status varchar(50),Age numeric(4),Year numeric(4),Make varchar(50),Model varchar(50),Trim varchar(125),Mileage numeric(6), Color varchar(50),CPO varchar(2),CARFAX varchar(50),AUTOCHECK varchar(50),RetailPrice numeric(18,0),SuggestedPrice numeric(18,0),Diff numeric(18,6),Above_Below varchar(50), Confidence varchar(50), Desirability varchar(50))  INSERT INTO #Priceovr SELECT DISTINCT o.Name as 'Dealership', v.VIN, --v.Vehicle_ID, vi.Stock_No, pr.Post_Date, stat.Status_Abbv,  vi.Age, v.Year, v.Make, v.Model, vi.Trim, vi.Mileage, vi.Extr_Color, CASE WHEN vi.Is_Certified = 1 THEN 'Y'   ELSE 'N' END AS 'CPO', i.Rpt_Status as 'CARFAX', ii.Rpt_Status as 'AUTOCHECK', vp.Retail_Price,  CASE        WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 THEN (SELECT pr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 THEN (SELECT pr.NonCPO_Recommended_Price_dplus)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 THEN (SELECT pr.NonCPO_Recommended_Price_dminus)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL THEN (SELECT pr.NonCPO_Recommended_Price_d)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 THEN (SELECT pr.CPO_Recommended_Price_d)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 THEN (SELECT pr.CPO_Recommended_Price_dplus)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 THEN (SELECT pr.CPO_Recommended_Price_dminus)    WHEN vi.Is_Certified = 1 AND vi.D_Rating IS NULL THEN (SELECT pr.CPO_Recommended_Price_d)    WHEN vi.Is_Certified = 0 AND vi.D_Rating = 0 THEN (SELECT pr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified = 0 AND vi.D_Rating = 1 THEN (SELECT pr.NonCPO_Recommended_Price_dplus)       WHEN vi.Is_Certified = 0 AND vi.D_Rating = -1 THEN (SELECT pr.NonCPO_Recommended_Price_dminus)       WHEN vi.Is_Certified = 0 AND vi.D_Rating IS NULL THEN (SELECT pr.NonCPO_Recommended_Price_d)       END AS 'Suggested Price',       CASE        WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_dplus)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_dminus)       WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_d)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 THEN (SELECT vp.retail_price-pr.CPO_Recommended_Price_d)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 THEN (SELECT vp.retail_price-pr.CPO_Recommended_Price_dplus)    WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 THEN (SELECT vp.retail_price-pr.CPO_Recommended_Price_dminus)    WHEN vi.Is_Certified = 1 AND vi.D_Rating IS NULL THEN (SELECT vp.retail_price-pr.CPO_Recommended_Price_d)    WHEN vi.Is_Certified = 0 AND vi.D_Rating = 0 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified = 0 AND vi.D_Rating = 1 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_dplus)       WHEN vi.Is_Certified = 0 AND vi.D_Rating = -1 THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_dminus)       WHEN vi.Is_Certified = 0 AND vi.D_Rating IS NULL THEN (SELECT vp.retail_price-pr.NonCPO_Recommended_Price_d) END AS 'Diff',  CASE        WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 and vp.retail_price-pr.NonCPO_Recommended_Price_d <-100 then 'Below'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 and vp.retail_price-pr.NonCPO_Recommended_Price_d >100 then 'Above'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 and vp.retail_price-pr.NonCPO_Recommended_Price_dplus <-100 then 'Below'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 and vp.retail_price-pr.NonCPO_Recommended_Price_dplus >100 then 'Above'        WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 and vp.retail_price-pr.NonCPO_Recommended_Price_dminus <-100 then 'Below'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 and vp.retail_price-pr.NonCPO_Recommended_Price_dminus >100 then 'Above'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL and vp.retail_price-pr.NonCPO_Recommended_Price_d <-100 then 'Below'       WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL and vp.retail_price-pr.NonCPO_Recommended_Price_d >100 then 'Above'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 and vp.retail_price-pr.CPO_Recommended_Price_d <-100 then 'Below'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 and vp.retail_price-pr.CPO_Recommended_Price_d >100 then 'Above'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 and vp.retail_price-pr.CPO_Recommended_Price_dplus <-100 then 'Below'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 and vp.retail_price-pr.CPO_Recommended_Price_dplus >100 then 'Above'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 and vp.retail_price-pr.CPO_Recommended_Price_dminus <-100 then 'Below'    WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 and vp.retail_price-pr.CPO_Recommended_Price_dminus >100 then 'Above'    WHEN vi.Is_Certified = 1 AND vi.D_Rating IS NULL and vp.retail_price-pr.CPO_Recommended_Price_d <-100 then 'Below'    WHEN vi.Is_Certified = 1 AND vi.D_Rating IS NULL and vp.retail_price-pr.CPO_Recommended_Price_d >100 then 'Above'    WHEN vi.Is_Certified = 0 AND vi.D_Rating = 0 and vp.retail_price-pr.NonCPO_Recommended_Price_d <-100 then 'Below'    WHEN vi.Is_Certified = 0 AND vi.D_Rating = 0 and vp.retail_price-pr.NonCPO_Recommended_Price_d >100 then 'Above'       WHEN vi.Is_Certified = 0 AND vi.D_Rating = 1 and vp.retail_price-pr.NonCPO_Recommended_Price_dplus <-100 then 'Below'       WHEN vi.Is_Certified = 0 AND vi.D_Rating = 1 and vp.retail_price-pr.NonCPO_Recommended_Price_dplus >100 then 'Above'       WHEN vi.Is_Certified = 0 AND vi.D_Rating = -1 and vp.retail_price-pr.NonCPO_Recommended_Price_dminus <-100 then 'Below'       WHEN vi.Is_Certified = 0 AND vi.D_Rating = -1 and vp.retail_price-pr.NonCPO_Recommended_Price_dminus >100 then 'Above'       WHEN vi.Is_Certified = 0 AND vi.D_Rating IS NULL and vp.retail_price-pr.NonCPO_Recommended_Price_d <-100 then 'Below'       WHEN vi.Is_Certified = 0 AND vi.D_Rating IS NULL and vp.retail_price-pr.NonCPO_Recommended_Price_d >100 then 'Above'    else ''   END AS 'Above/Below',  CASE WHEN pr.confidence = 3 THEN 'Green'   WHEN pr.confidence = 2 THEN 'Yellow'   WHEN pr.confidence = 1 THEN 'Red'   ELSE 'NA' END AS 'Confidence', CASE WHEN vi.D_Rating =0 THEN 'D'   WHEN vi.D_rating = -1 THEN 'D-'   WHEN vi.D_rating = 1 THEN 'D+'   ELSE 'NA' END AS 'Desirability'  FROM RA_SIMS.DBO.Price_Recommendations AS PR ------------------------------------------------------------------------------------------------------------------------- JOIN SIMS6200.dbo.vehicle AS v ON v.VIN = pr.VIN  --JOIN FOR STORES------------------------------- JOIN SIMS6200.dbo.Organization AS o ON o.Org_ID = PR.Store_ID JOIN SIMS6200.dbo.Organization_Association AS oa ON oa.Child_Org_ID = o.Org_ID   OUTER APPLY  (  SELECT TOP 1 *  FROM sims6200.dbo.vehicle_inventory AS vi  WHERE v.Vehicle_ID = vi.Vehicle_ID  and vi.Store_ID = pr.Store_ID  ORDER By vi.Modification_Date desc ) AS vi  JOIN SIMS6200.dbo.STATUS AS stat ON stat.Status_ID = vi.Curr_Status_ID  CROSS APPLY  (  SELECT TOP 1 *  FROM sims6200.dbo.Vehicle_Pricing AS vp  WHERE vi.Vehicle_ID = vp.Vehicle_ID  AND vp.Store_ID = vi.Store_ID  ORDER BY vp.Invtr_ID DESC, vi.Invtr_ID desc ) AS vp  ---JOIN FOR CARFAX & AUTOCHECK DATA ------------------------------------------------------------------------------------------------------ join SIMS6200.dbo.External_Vehicle_Data as e on e.Vehicle_ID = vi.Vehicle_ID and e.Store_ID = vi.Store_ID and e.Invtr_ID = vi.Invtr_ID join SIMS6200.dbo.EXTERNAL_REPORT_ICON as i on i.Rpt_Icon_ID = e.Rpt_Icon_ID join SIMS6200.dbo.External_Vehicle_Data as a on a.Vehicle_ID = vi.Vehicle_ID and a.Store_ID = vi.Store_ID and a.Invtr_ID = vi.Invtr_ID join SIMS6
```
