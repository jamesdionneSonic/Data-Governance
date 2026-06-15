# ZR - InValue_VS_TradeValue

Generated: 2026-06-15  
SSRS path: `/RTC/ZR - InValue_VS_TradeValue`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `ZR - InValue_VS_TradeValue`                     |
| SSRS path           | `/RTC/ZR - InValue_VS_TradeValue`                |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 13:43:27                              |
| Modified            | 2017-12-13 10:15:32                              |
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

1. Dataset `DataSet1` (Text): SELECT --vi.Curr_Status_ID, --vi.Vehicle_ID, o.Name AS 'Dealership', v.VIN, vi.Stock_No, vi.Acquired_Type, vi.Acquired_Date, s.Status_Abbv 'Status', vp.Acquired_Value , sac.SAC_Recom_Apprsl_Value 'RTC_Recom Apprsl_Value', 'Difference' = vp.Acquired_Value - sac.SAC_Recom_Apprsl_Value, -----------------------------------...

## Backend Dependencies

| Object or command hint                | Notes                                     |
| ------------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory`      | Referenced by one or more report datasets |
| `FOR`                                 | Referenced by one or more report datasets |
| `SIMS6200.dbo.vehicle`                | Referenced by one or more report datasets |
| `SIMS6200.dbo.Vehicle_Pricing`        | Referenced by one or more report datasets |
| `SIMS6200.dbo.Sonic_Appraisal_Center` | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`           | Referenced by one or more report datasets |
| `SIMS6200.dbo.STATUS`                 | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/ZR - InValue_VS_TradeValue`.
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
SELECT --vi.Curr_Status_ID, --vi.Vehicle_ID, o.Name AS 'Dealership', v.VIN, vi.Stock_No, vi.Acquired_Type, vi.Acquired_Date, s.Status_Abbv 'Status', vp.Acquired_Value , sac.SAC_Recom_Apprsl_Value 'RTC_Recom Apprsl_Value', 'Difference' = vp.Acquired_Value - sac.SAC_Recom_Apprsl_Value,  --------------------------------------------------------- CASE  WHEN vp.Acquired_Value > sac.SAC_Recom_Apprsl_Value   THEN 'Over allow'  WHEN vp.Acquired_Value < sac.SAC_Recom_Apprsl_Value   THEN 'Holding' END AS 'Comment' ---------------------------------------------------------  FROM [SIMS6200].[dbo].[Vehicle_Inventory] AS vi  --JOIN FOR VIN----------------- JOIN SIMS6200.dbo.vehicle AS v ON v.Vehicle_ID = vi.Vehicle_ID  --APPLY FOR ACQUIRED_VALUE----------------------- CROSS APPLY (  SELECT TOP 1 *  FROM [SIMS6200].[dbo].[Vehicle_Pricing] AS vp  WHERE vp.Vehicle_ID = vi.Vehicle_ID   AND vp.Store_ID = vi.Store_ID  ORDER BY vp.Invtr_ID DESC, vi.Invtr_ID DESC ) AS vp  --APPLY FOR SAC_RECOM_APPRSL_VALUE----------------------- CROSS APPLY (  SELECT TOP 1 *  FROM [SIMS6200].[dbo].[Sonic_Appraisal_Center] AS sac  WHERE sac.Vehicle_ID = vi.Vehicle_ID   AND sac.Store_ID = vi.Store_ID  ORDER BY sac.Invtr_ID DESC, vi.Invtr_ID DESC ) AS sac  --JOIN FOR STORES------------------ JOIN SIMS6200.dbo.Organization AS o ON o.Org_ID = vi.Store_ID  JOIN SIMS6200.dbo.STATUS as s on s.Status_ID = vi.Curr_Status_ID  WHERE  Acquired_Type IN ('Tradein') AND  ------------------------------------------------------------------------ --RUN ONLY ON MONDAY'S-- --Acquired_Date BETWEEN DATEADD(DAY, DATEDIFF(DAY, 3, GETDATE()),0)  --               AND DATEADD(DAY, DATEDIFF(DAY, 0, GETDATE()),0)  --RUN TUES-FRI-- Acquired_Date BETWEEN DATEADD(DAY, DATEDIFF(DAY, 1, GETDATE()),0)        AND DATEADD(DAY, DATEDIFF(DAY, 1, GETDATE()),0) ------------------------------------------------------------------------ and vp.Acquired_Value !=sac.SAC_Recom_Apprsl_Value --and vi.Curr_Status_ID != 51 --research  --AND vi.Curr_Status_ID  in (203,301,302,303,305) --IS VEHICLES  ORDER BY --Dealership, v.VIN, vi.Stock_No [Comment] DESC, DIFFERENCE DESC
```
