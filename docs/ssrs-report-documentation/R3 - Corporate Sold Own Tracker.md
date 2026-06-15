# R3 - Corporate Sold Own Tracker

Generated: 2026-06-15  
SSRS path: `/RTC/R3 - Corporate Sold Own Tracker`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R3 - Corporate Sold Own Tracker`                |
| SSRS path           | `/RTC/R3 - Corporate Sold Own Tracker`           |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:43                              |
| Modified            | 2017-12-13 10:15:21                              |
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

1. Dataset `DataSet1` (Text): SELECT COUNT(CASE WHEN vi.curr_status_id IN (301,302,304) THEN vi.Curr_Status_ID END) 'Total Sold' INTO #sold FROM [SIMS6200].[dbo].[Vehicle_Inventory] vi --JOIN FOR DEALERSHIPS join SIMS6200.dbo.Organization o --UPDATED 8.12.13 ON o.Org_ID = vi.Store_ID WHERE o.Is_Act = 1 --ACTIVE STORES --AND o.Org_Type = 20 AND vi.I...

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R3 - Corporate Sold Own Tracker`.
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
SELECT     COUNT(CASE   WHEN vi.curr_status_id IN (301,302,304)     THEN vi.Curr_Status_ID END) 'Total Sold'  INTO #sold    FROM [SIMS6200].[dbo].[Vehicle_Inventory] vi  --JOIN FOR DEALERSHIPS join SIMS6200.dbo.Organization o --UPDATED 8.12.13 ON o.Org_ID = vi.Store_ID   WHERE o.Is_Act = 1 --ACTIVE STORES --AND o.Org_Type = 20  AND vi.Invtr_Type = 10 --USED VEHICLES AND vi.Store_ID not in (0,138,177,229,231,237,119,137) --SONIC TEST STORE AND vi.Curr_Status_ID IN (301,302,304) AND vi.Sold_Date BETWEEN @f and @t  SELECT  COUNT(CASE    WHEN vii.curr_status_id IN (201,203,204,205) and vii.Store_ID Not IN (109,175) -- PA,IS, OGT, PW    THEN vii.Vehicle_ID END) 'Total Inventory',            COUNT(CASE    WHEN vii.curr_status_id IN ('201','203','204') and vii.Store_ID Not IN (109,175) -- PA,IGT,IS    THEN vii.Vehicle_ID END) 'Retail Units'    INTO #owned   FROM  [SIMS6200].[dbo].[Vehicle_Inventory] vii  --JOIN FOR DEALERSHIPS inner join SIMS6200.dbo.Organization o --UPDATED 8.12.13 ON o.Org_ID = vii.Store_ID  WHERE o.Is_Act = 1 --ACTIVE STORES AND vii.Invtr_Type = 10 --USED VEHICLES AND vii.Curr_Status_ID in (201,203,204,205) AND vii.Store_ID not in (0,138,177,229,231,237,119,137) --SONIC TEST STORE  SELECT * FROM #sold,#owned  DROP TABLE #sold,#owned
```
