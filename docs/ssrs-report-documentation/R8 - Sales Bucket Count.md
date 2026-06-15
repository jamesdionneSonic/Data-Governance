# R8 - Sales Bucket Count

Generated: 2026-06-15  
SSRS path: `/RTC/R8 - Sales Bucket Count`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R8 - Sales Bucket Count`                        |
| SSRS path           | `/RTC/R8 - Sales Bucket Count`                   |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:46                              |
| Modified            | 2017-12-13 10:15:29                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

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

1. Dataset `DataSet1` (Text): SELECT DISTINCT o.Name 'Dealership', COUNT(CASE WHEN vi.Age < 21 THEN vi.Age END) 'Bucket 1' , COUNT(CASE WHEN vi.Age between 21 and 35 THEN vi.Age END) 'Bucket 2' , COUNT(CASE WHEN vi.Age between 36 and 45 THEN vi.Age END) 'Bucket 3' , COUNT(CASE WHEN vi.Age >45 THEN vi.Age END) 'Bucket 4' , COUNT(CASE WHEN vi.curr_st...

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R8 - Sales Bucket Count`.
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
SELECT DISTINCT o.Name 'Dealership', COUNT(CASE    WHEN vi.Age < 21     THEN vi.Age END) 'Bucket 1' ,      COUNT(CASE    WHEN vi.Age between 21 and 35     THEN vi.Age END) 'Bucket 2' ,    COUNT(CASE    WHEN vi.Age between 36 and 45     THEN vi.Age END) 'Bucket 3' ,      COUNT(CASE    WHEN vi.Age >45     THEN vi.Age END) 'Bucket 4' ,      COUNT(CASE   WHEN vi.curr_status_id IN (301,302,304)     THEN vi.Curr_Status_ID END) 'Total Sold'    FROM  [SIMS6200].[dbo].[Vehicle_Inventory] vi  --JOIN FOR DEALERSHIPS join SIMS6200.dbo.Organization o --UPDATED 8.12.13 on o.Org_ID = vi.Store_ID   WHERE o.Is_Act = 1 --ACTIVE STORES AND vi.Invtr_Type = 10 --USED VEHICLES AND vi.Store_ID not in (138,177,229,231,237,119,137,109,175) --SONIC TEST STORE AND vi.Curr_Status_ID IN (301,302,304) AND vi.Sold_Date BETWEEN @f and @t  GROUP BY o.Name   ORDER BY o.Name
```
