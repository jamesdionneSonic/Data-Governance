# R6 - Inventory Level Query

Generated: 2026-06-15  
SSRS path: `/RTC/R6 - Inventory Level Query`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R6 - Inventory Level Query`                     |
| SSRS path           | `/RTC/R6 - Inventory Level Query`                |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:46                              |
| Modified            | 2017-12-13 10:15:27                              |
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

1. Dataset `DataSet1` (Text): SELECT DISTINCT o.Name 'Dealership', count(case when LEFT(vi.stock_no,1) = 'T' then vi.Vehicle_ID end) 'Trade Units' ,count(case when LEFT(vi.stock_no,1) = 'P' then vi.Vehicle_ID end) 'Purchase Units' ,count(case when LEFT(vi.stock_no,1) = 'B' then vi.Vehicle_ID end) 'Buyer Units' ,count(case when LEFT(vi.stock_no,1) n...

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R6 - Inventory Level Query`.
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
SELECT DISTINCT o.Name 'Dealership', count(case when LEFT(vi.stock_no,1) = 'T' then vi.Vehicle_ID end) 'Trade Units' ,count(case when LEFT(vi.stock_no,1) = 'P' then vi.Vehicle_ID  end) 'Purchase Units' ,count(case when LEFT(vi.stock_no,1) = 'B' then vi.Vehicle_ID  end) 'Buyer Units' ,count(case when LEFT(vi.stock_no,1) not in ('T','B','P') OR vi.Stock_No IS null then vi.Vehicle_ID  end) 'Other Units' ,COUNT(case when vi.is_certified = 1 then vi.Vehicle_ID end) '# CPO Units' ,COUNT(case when vi.Curr_Status_ID = 205 then vi.Vehicle_ID end) 'PW'  FROM  [SIMS6200].[dbo].[Vehicle_Inventory] vi  --JOIN FOR DEALERSHIPS inner join SIMS6200.dbo.Organization o --UPDATED 8.12.13 on o.Org_ID = vi.Store_ID  WHERE o.Is_Act = 1 --ACTIVE STORES --AND o.Org_Type = 20  AND vi.Invtr_Type = 10 --USED VEHICLES AND vi.Curr_Status_ID in (201,202,203,205) --PA, IGT, IS, PW AND vi.Store_ID not in (0,138,177,229,231,235,237,119,137,109,175)  GROUP BY o.Name   ORDER BY o.Name
```
