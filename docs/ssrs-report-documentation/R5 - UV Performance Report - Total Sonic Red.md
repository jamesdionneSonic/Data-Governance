# R5 - UV Performance Report - Total Sonic Red

Generated: 2026-06-15  
SSRS path: `/RTC/R5 - UV Performance Report - Total Sonic Red`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                               |
| ------------------- | --------------------------------------------------- |
| Report name         | `R5 - UV Performance Report - Total Sonic Red`      |
| SSRS path           | `/RTC/R5 - UV Performance Report - Total Sonic Red` |
| Status signal       | Review candidate: no executions in last 6 months    |
| Created             | 2014-10-17 11:35:45                                 |
| Modified            | 2017-12-13 10:15:26                                 |
| Modified by         | SONIC\Mark.Starnes                                  |
| Last 6 months usage | 0 executions by 0 users                             |
| Last execution      | NULL                                                |
| Subscriptions       | 0                                                   |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type   | Notes                                                |
| --------- | ------ | ------ | ---------------------------------------------------- |
| `f`       | f      | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `t`       | t      | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT o.Name AS 'Dealership', COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 THEN vi.Vehicle_ID END) AS 'B1', COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 THEN vi.Vehicle_ID END) AS 'B2', COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 THEN vi.Vehicle_ID END) AS 'B3', COUNT(CASE WHEN vi.Age >45 THEN vi.Vehicle_ID END) AS 'B4', COUNT(vi...

## Backend Dependencies

| Object or command hint                  | Notes                                     |
| --------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory`        | Referenced by one or more report datasets |
| `FOR`                                   | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization_Association` | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Pricing`          | Referenced by one or more report datasets |
| `SIMS6200.dbo.FIREDealData`             | Referenced by one or more report datasets |
| `SIMS6200.dbo.Store_General_Options`    | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R5 - UV Performance Report - Total Sonic Red`.
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
SELECT o.Name AS 'Dealership',  COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 THEN vi.Vehicle_ID END) AS 'B1', COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 THEN vi.Vehicle_ID END) AS 'B2', COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 THEN vi.Vehicle_ID END) AS 'B3', COUNT(CASE WHEN vi.Age >45 THEN vi.Vehicle_ID END) AS 'B4',      COUNT(vi.Vehicle_ID) AS 'Total Sold',  CAST(COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 THEN vi.Vehicle_ID END) AS NUMERIC(4,0))/ CAST(COUNT(vi.Vehicle_ID) AS NUMERIC(4,0)) AS 'Bucket 1 %', CAST(COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 THEN vi.Vehicle_ID END) AS NUMERIC(4,0))/ CAST(COUNT(vi.Vehicle_ID) AS NUMERIC(4,0)) AS 'Bucket 2 %', CAST(COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 THEN vi.Vehicle_ID END) AS NUMERIC(4,0))/ CAST(COUNT(vi.Vehicle_ID) AS NUMERIC(4,0)) AS 'Bucket 3 %', CAST(COUNT(CASE WHEN vi.Age > 45 THEN vi.Vehicle_ID END) AS NUMERIC(4,0))/ CAST(COUNT(vi.Vehicle_ID) AS NUMERIC(4,0)) AS 'Bucket 4 %',  COUNT(vi.Vehicle_ID) - COUNT(CASE WHEN vi.Curr_Status_ID in (301,302) and fire.DealStatus = 'F' THEN vi.vehicle_id END) AS 'Unfinalized',     COUNT(CASE WHEN vi.Curr_Status_ID in (301,302) and fire.DealStatus = 'F' THEN vi.vehicle_id END) AS 'Finalized',      --AFTER EXCLUSIONS--     COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 and fire.DealStatus = 'F' THEN vi.Vehicle_ID END) AS 'A1',      COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 and fire.DealStatus = 'F' THEN vi.Vehicle_ID END) AS 'A2',  COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 and fire.DealStatus = 'F' THEN vi.Vehicle_ID END) AS 'A3',    COUNT(CASE WHEN vi.Age > 45 and fire.DealStatus = 'F' THEN vi.Vehicle_ID END) AS 'A4',      AVG(CASE WHEN vi.Age BETWEEN 0 AND 20 and fire.DealStatus = 'F' THEN ROUND(fire.FrontPUR,0) END) AS 'fGPU1',   AVG(CASE WHEN vi.Age BETWEEN 21 AND 35 and fire.DealStatus = 'F' THEN ROUND(fire.FrontPUR,0) END) AS 'fGPU2',   AVG(CASE WHEN vi.Age BETWEEN 36 AND 45 and fire.DealStatus = 'F' THEN ROUND(fire.FrontPUR,0) END) AS 'fGPU3',  AVG(CASE WHEN vi.Age >  45 and fire.DealStatus = 'F' THEN ROUND(fire.FrontPUR,0) END) AS 'fGPU4',   AVG(CASE WHEN fire.DealStatus = 'F' THEN ROUND(fire.FrontPUR,0) END) AS 'fGPUall',  -- SALES GAPS --  AVG(CASE   WHEN   vi.Age BETWEEN 0 AND 20   AND fire.DealStatus = 'F'    AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price > 100   And vp.sold_price IS not null   and vp.sold_price > 99   THEN ROUND((vp.retail_price - vp.sold_price),0)   END) AS 'Bucket 1 SG',   AVG(CASE   WHEN   vi.Age BETWEEN 21 AND 35   AND fire.DealStatus = 'F'    AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price > 100   And vp.sold_price IS not null   and vp.sold_price > 99   THEN ROUND((vp.retail_price - vp.sold_price),0)   END) AS 'Bucket 2 SG',  AVG(CASE   WHEN   vi.Age BETWEEN 35 AND 45   AND fire.DealStatus = 'F'    AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price > 100   And vp.sold_price IS not null   and vp.sold_price > 99   THEN ROUND((vp.retail_price - vp.sold_price),0)   END) AS 'Bucket 3 SG',     AVG(CASE   WHEN   vi.Age > 45   AND fire.DealStatus = 'F'    AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price > 100   And vp.sold_price IS not null   and vp.sold_price > 99   THEN ROUND((vp.retail_price - vp.sold_price),0)   END) AS 'Bucket 4 SG',      --AVG PUR UNFINALIZED + FINALIZED --   AVG(CASE   WHEN   vi.Age BETWEEN 0 AND 20   AND vi.Curr_Status_ID = 301--PD   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR + sgo.Dealer_Fee_Amt_USED + 325,0)   WHEN    vi.Age BETWEEN 0 AND 20   AND vi.Curr_Status_ID = 302--SR   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR,0)    WHEN    vi.Age NOT BETWEEN 0 AND 20    THEN '' END) AS 'cGPU1',   AVG(CASE   WHEN   vi.Age BETWEEN 21 AND 35   AND vi.Curr_Status_ID = 301--PD   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR + sgo.Dealer_Fee_Amt_USED + 325,0)   WHEN    vi.Age BETWEEN 21 AND 35   AND vi.Curr_Status_ID = 302 --SR   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR,0)    WHEN    vi.Age NOT BETWEEN 21 AND 25    THEN '' END) AS 'cGPU2', AVG(CASE   WHEN   vi.Age BETWEEN 36 AND 45   AND vi.Curr_Status_ID = 301--PD   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR + sgo.Dealer_Fee_Amt_USED + 325,0)     WHEN   vi.Age BETWEEN 36 AND 45   AND vi.Curr_Status_ID =  302 --SR   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR,0)    WHEN    vi.Age NOT BETWEEN 36 AND 45     THEN '' END) AS 'cGPU3', AVG(CASE   WHEN   vi.Age >= 46   AND vi.Curr_Status_ID = 301--PD   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR + sgo.Dealer_Fee_Amt_USED + 325,0)   WHEN   vi.Age >= 46   AND vi.Curr_Status_ID = 302--SR   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN ROUND(fire.FrontPUR,0)    WHEN   vi.Age < 46    THEN '' END) AS 'cGPU4',      ROUND(AVG(CASE   WHEN   vi.Curr_Status_ID = 301--PD   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0    THEN fire.FrontPUR + sgo.Dealer_Fee_Amt_USED + 325   WHEN   vi.Curr_Status_ID IN (302)--SR   AND vp.Retail_Price IS NOT NULL   AND vp.Retail_Price != 0   AND vp.Act_Recon_Amount IS NOT NULL   AND vp.Act_Recon_Amount != 0   AND vp.Sold_Price IS NOT NULL   AND vp.Sold_Price != 0      THEN fire.FrontPUR END),0) AS 'cGPUall'  FROM SIMS6200.dbo.Vehicle_Inventory AS vi  --JOIN FOR DEALERSHIP NAMES-- JOIN SIMS6200.dbo.Organization_Association AS oa ON oa.Child_Org_ID = vi.Store_ID JOIN SIMS6200.dbo.Organization AS o ON o.Org_ID = oa.Child_Org_ID  --JOIN FOR RETAIL PRICE,ACT RECON AMOUNT,SOLD PRICE-- JOIN SIMS6200.dbo.Vehicle_Pricing AS vp ON vp.Vehicle_ID = vi.Vehicle_ID AND vp.Store_ID = vi.Store_ID AND vp.Invtr_ID = vi.Invtr_ID  --APPLY FOR FRONTPUR-- OUTER APPLY (  SELECT TOP 1 *  FROM SIMS6200.dbo.FIREDealData AS fire  WHERE   fire.StockNo = vi.Stock_No  AND fire.DealTypeCode IN ('USED')--USED VEHICLES  ORDER BY  vi.Modification_Date DESC, fire.ContractDateKey DESC ) AS fire  --JOIN FOR USED DEALERSHIP FEES-- JOIN SIMS6200.dbo.Store_General_Options AS sgo ON sgo.Store_ID = vi.Store_ID  WHERE oa.IS_Act = 1--ACTIVE DEALERSHIPS AND vi.Curr_Status_ID IN (301,302)--PD,SR AND vi.Invtr_Type = 10--USED VEHICLES AND vi.Sold_Date BETWEEN @f AND @t --DATE RANGE AND vi.Store_ID not IN (0,137,119,109,175,229)  GROUP BY o.Name
```
