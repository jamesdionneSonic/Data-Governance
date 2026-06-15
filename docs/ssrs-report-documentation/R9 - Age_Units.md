# R9 - Age_Units

Generated: 2026-06-15  
SSRS path: `/RTC/R9 - Age_Units`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R9 - Age_Units`                                 |
| SSRS path           | `/RTC/R9 - Age_Units`                            |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:47                              |
| Modified            | 2017-12-13 10:15:30                              |
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

1. Dataset `DataSet1` (Text): /**\*\*** Script for Aged Inventory Mark Downs**\***/ DECLARE @day VARCHAR(15) = DATENAME(dw,GETDATE()) IF @day = 'Friday' WITH bList AS ( SELECT vi.Store_ID, oa.Parent_Org_ID, o.Name 'Dealership', s.Status_Abbv 'Status', vi.stock_no, v.Year, v.Make, v.Model, vi.Trim, vi.Extr_Color, vi.Mileage, CASE WHEN vi.Is_Certified =...

## Backend Dependencies

| Object or command hint                  | Notes                                     |
| --------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory`        | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Pricing`          | Referenced by one or more report datasets |
| `SIMS6200.dbo.STATUS`                   | Referenced by one or more report datasets |
| `SIMS6200.dbo.VEHICLE`                  | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization_Association` | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Store_General_Options`    | Referenced by one or more report datasets |
| `RA_SIMS.dbo.Price_Recommendations`     | Referenced by one or more report datasets |
| `bList`                                 | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R9 - Age_Units`.
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
/****** Script for Aged Inventory Mark Downs*****/  DECLARE @day VARCHAR(15) = DATENAME(dw,GETDATE())  IF @day = 'Friday'    WITH bList AS ( SELECT vi.Store_ID,     oa.Parent_Org_ID,     o.Name 'Dealership',     s.Status_Abbv 'Status',     vi.stock_no,     v.Year,     v.Make,     v.Model,     vi.Trim,     vi.Extr_Color,     vi.Mileage,        CASE WHEN vi.Is_Certified = 1 THEN 'Y'       WHEN vi.Is_Certified = 0 THEN 'N'       WHEN vi.Is_Certified IS null THEN 'N'       ELSE ''     END 'CPO',             vi.Age,        vi.Group_Age,        vp.Acquired_Value 'ACV',        vp.GL_Balance 'GL',               vp.Retail_Price,                CASE WHEN vi.Age > 58 and oa.Parent_Org_ID = 70 THEN (vp.Retail_Price *.97) - vp.GL_Balance + 325    WHEN vi.Age < 58 and oa.Parent_Org_ID = 70 THEN (vp.Retail_Price *.98) - vp.GL_Balance + 325    WHEN vi.age < 58 and oa.Parent_Org_ID != 70 THEN (vp.Retail_Price *.98) - vp.GL_Balance + sg.Dealer_Fee_Amt_USED + 325      ELSE (vp.Retail_Price *.97) - vp.GL_Balance + 325     END 'New_Proj_Margin' ,       CASE WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 THEN (SELECT prr.NonCPO_Recommended_Price_d)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 THEN (SELECT prr.NonCPO_Recommended_Price_dplus)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 THEN (SELECT prr.NonCPO_Recommended_Price_dminus)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL THEN (SELECT prr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 THEN (SELECT prr.CPO_Recommended_Price_d)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 THEN (SELECT prr.CPO_Recommended_Price_dplus)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 THEN (SELECT prr.CPO_Recommended_Price_dminus)       WHEN vi.Is_Certified = 1 AND vi.D_Rating IS NULL THEN (SELECT prr.CPO_Recommended_Price_d)       WHEN vi.Is_Certified = 0 AND vi.D_Rating = 0 THEN (SELECT prr.NonCPO_Recommended_Price_d)          WHEN vi.Is_Certified = 0 AND vi.D_Rating = 1 THEN (SELECT prr.NonCPO_Recommended_Price_dplus)          WHEN vi.Is_Certified = 0 AND vi.D_Rating = -1 THEN (SELECT prr.NonCPO_Recommended_Price_dminus)          WHEN vi.Is_Certified = 0 AND vi.D_Rating IS NULL THEN (SELECT prr.NonCPO_Recommended_Price_d)       END 'SIMS_Sugg_Price'         FROM SIMS6200.dbo.Vehicle_Inventory vi       CROSS APPLY  (  SELECT TOP 1 *  FROM SIMS6200.dbo.Vehicle_Pricing vp  WHERE vi.Vehicle_ID = vp.Vehicle_ID   AND vi.Store_ID = vp.Store_ID  ORDER BY vp.Modification_Date DESC   ) vp      INNER JOIN SIMS6200.dbo.STATUS s ON s.Status_ID = vi.Curr_Status_ID   INNER JOIN SIMS6200.dbo.VEHICLE v ON v.Vehicle_ID = vp.Vehicle_ID   INNER JOIN SIMS6200.dbo.Organization_Association OA ON oa.Child_Org_ID = vi.Store_ID   INNER JOIN SIMS6200.dbo.Organization O ON o.Org_ID = vi.Store_ID   INNER JOIN SIMS6200.dbo.Organization oo ON oo.Org_ID = oa.Parent_Org_ID   INNER JOIN SIMS6200.dbo.Store_General_Options sg ON sg.Store_ID = vi.Store_ID    OUTER APPLY  (  SELECT TOP 1 *  FROM [RA_SIMS].[dbo].[Price_Recommendations] prr  WHERE prr.VIN = v.VIN   ) prr        WHERE     Status_ID IN (201,203,202)     and vp.Retail_Price is Not null    AND vi.Invtr_Type=10    and vi.Age in (19,20,21,34,35,36,44,45,46,58,59,60,88,89,90,118,119,120,148,149,150,178,179,180,208,209,210)    AND vi.Store_ID in (110,140,164,169,174,182,186,207,211,214,216,217,219,184,185,129)  --SONIC PILOT STORES  )    SELECT bl.Dealership,   bl.Status,   bl.[Stock_No],   bl.Make,   bl.Year,   bl.Model,   bl.Trim,   bl.[Extr_Color],   bl.Mileage,   bl.CPO,   bl.[Age],   bl.[Group_Age],     LEFT('$'+CONVERT(VARCHAR,CAST(bl.ACV AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST(bl.ACV AS MONEY),1))-3) AS 'ACV',   LEFT('$'+CONVERT(VARCHAR,CAST(bl.GL AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST(bl.GL AS MONEY),1))-3) AS 'GL',   LEFT('$'+CONVERT(VARCHAR,CAST(bl.Retail_Price AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST(bl.Retail_Price AS MONEY),1))-3) AS 'Current_Price',   LEFT('$'+CONVERT(VARCHAR,CAST(bl.SIMS_Sugg_Price AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST(bl.SIMS_Sugg_Price AS MONEY),1))-3) AS 'SIMS_Sugg_Price',        CASE WHEN bl.age < 34 and bl.Retail_Price < 6000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -100) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-100) AS MONEY),1))-5) + '82'        WHEN bl.age < 44 and bl.Retail_Price < 6000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -100) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-100) AS MONEY),1))-5) + '83'          WHEN bl.age < 34 and bl.Retail_Price between 6000 and 9000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -200) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-200) AS MONEY),1))-5) + '82'        WHEN bl.age < 44 and bl.Retail_Price between 6000 and 9000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -200) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-200) AS MONEY),1))-5) + '83'          WHEN bl.age < 34 and bl.Retail_Price > 9000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price *.98) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price*.98) AS MONEY),1))-5) + '82'        WHEN bl.age < 44 and bl.Retail_Price > 9000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price *.98) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price*.98) AS MONEY),1))-5) + '83'          WHEN bl.Age > 43 and bl.Retail_Price < 4000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -100) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-100) AS MONEY),1))-5) + '84'         WHEN bl.Age > 43 and bl.Retail_Price between 4000 and 8000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price -200) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price-200) AS MONEY),1))-5) + '84'              WHEN bl.Age > 43 and bl.Retail_Price > 8000 then LEFT('$'+CONVERT(VARCHAR,CAST((bl.retail_Price *.97) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price*.97) AS MONEY),1))-5) + '84'            ELSE LEFT('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price * .98) AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST((bl.Retail_Price*.98) AS MONEY),1))-5) + '81'        END 'Cal_Price',             LEFT('$'+CONVERT(VARCHAR,CAST(bl.New_Proj_Margin AS MONEY),1),LEN('$'+CONVERT(VARCHAR,CAST(bl.New_Proj_Margin AS MONEY),1))-3) AS 'New_Proj_Margin'        FROM bList bl      ORDER BY Dealership, Age    ELSE    WITH bList AS  (   SELECT vi.Store_ID,     oa.Parent_Org_ID,     o.Name 'Dealership',     s.Status_Abbv 'Status',     vi.stock_no,     v.Year,     v.Make,     v.Model,     vi.Trim,     vi.Extr_Color,     vi.Mileage,        CASE WHEN vi.Is_Certified = 1 THEN 'Y'       WHEN vi.Is_Certified = 0 THEN 'N'       WHEN vi.Is_Certified IS null THEN 'N'       ELSE ''     END 'CPO',             vi.Age,        vi.Group_Age,        vp.Acquired_Value 'ACV',        vp.GL_Balance 'GL',               vp.Retail_Price,                CASE WHEN vi.age < 60 and oa.Parent_Org_ID != 70 THEN (vp.Retail_Price *.98) - vp.GL_Balance + sg.Dealer_Fee_Amt_USED + 325    WHEN vi.Age > 59 and oa.Parent_Org_ID = 70 THEN (vp.Retail_Price *.97) - vp.GL_Balance + sg.Dealer_Fee_Amt_USED + 325    WHEN vi.Age < 59 and oa.Parent_Org_ID = 70 THEN (vp.Retail_Price *.98) - vp.GL_Balance + 325      ELSE (vp.Retail_Price *.97) - vp.GL_Balance + 325     END 'New_Proj_Margin' ,       CASE WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 0 THEN (SELECT prr.NonCPO_Recommended_Price_d)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating = 1 THEN (SELECT prr.NonCPO_Recommended_Price_dplus)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating = -1 THEN (SELECT prr.NonCPO_Recommended_Price_dminus)          WHEN vi.Is_Certified IS NULL AND vi.D_Rating IS NULL THEN (SELECT prr.NonCPO_Recommended_Price_d)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = 0 THEN (SELECT prr.CPO_Recommended_Price_d)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = 1 THEN (SELECT prr.CPO_Recommended_Price_dplus)       WHEN vi.Is_Certified = 1 AND vi.D_Rating = -1 THEN (SELECT prr.CPO_Recommende
```
