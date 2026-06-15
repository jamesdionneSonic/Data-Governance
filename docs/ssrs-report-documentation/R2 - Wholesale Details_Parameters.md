# R2 - Wholesale Details_Parameters

Generated: 2026-06-15  
SSRS path: `/RTC/R2 - Wholesale Details_Parameters`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R2 - Wholesale Details_Parameters`              |
| SSRS path           | `/RTC/R2 - Wholesale Details_Parameters`         |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-21 10:50:42                              |
| Modified            | 2017-12-13 10:15:17                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt     | Type   | Notes                                                |
| ------------ | ---------- | ------ | ---------------------------------------------------- |
| `Dealership` | Dealership | String | Nullable: NULL; Allow blank: true; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age FROM SIMS6200.dbo.Vehicle_Inventory AS vi --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200.dbo.VEHICLE AS v ON v.Vehicle_ID = vi.Vehicle_ID --JOIN FOR DEALERSHIPS JOIN SIMS6200.dbo.Organization as o --UPDATED 8.12.13 on o.Org_ID ...
2. Dataset `DataSet2` (Text): SELECT distinct o.Name AS 'Dealership' FROM SIMS6200.dbo.Organization as o --UPDATED 8.12.13
3. Dataset `DataSet3` (Text): SELECT o.Name as 'Dealership', COUNT(CASE WHEN vi.curr_status_id = 204 THEN vi.Curr_Status_ID END) AS 'OGT', COUNT(CASE WHEN vi.curr_status_id = 201 THEN vi.Curr_Status_ID END) AS 'PA', COUNT(CASE WHEN vi.curr_status_id = 203 THEN vi.Curr_Status_ID END) AS 'INS', COUNT(CASE WHEN vi.curr_status_id = 205 THEN vi.Curr_Sta...

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.VEHICLE`           | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R2 - Wholesale Details_Parameters`.
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
SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age  FROM SIMS6200.dbo.Vehicle_Inventory AS vi  --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200.dbo.VEHICLE AS v  ON v.Vehicle_ID = vi.Vehicle_ID  --JOIN FOR DEALERSHIPS JOIN SIMS6200.dbo.Organization as o --UPDATED 8.12.13 on o.Org_ID = vi.Store_ID  WHERE o.Is_Act = 1 --ACTIVE STORES --AND o.Org_Type = 20  AND vi.Curr_Status_ID IN (205) --PW units AND vi.Invtr_Type = 10 --USED VEHICLES AND vi.Store_ID not in (0,138,177,229,231,235,109,175)  --SONIC TEST STORE  and o.Name in (@Dealership) ORDER BY DEALERSHIP, vi.Curr_Status_ID
```

#### DataSet2

Type: `Text`

```sql
SELECT distinct o.Name AS 'Dealership'  FROM SIMS6200.dbo.Organization as o --UPDATED 8.12.13
```

#### DataSet3

Type: `Text`

```sql
SELECT       o.Name as 'Dealership',       COUNT(CASE       WHEN vi.curr_status_id = 204       THEN vi.Curr_Status_ID END) AS 'OGT',       COUNT(CASE       WHEN vi.curr_status_id = 201       THEN vi.Curr_Status_ID END) AS 'PA',       COUNT(CASE       WHEN vi.curr_status_id = 203       THEN vi.Curr_Status_ID END) AS 'INS',       COUNT(CASE       WHEN vi.curr_status_id = 205       THEN vi.Curr_Status_ID END) AS 'PW',       COUNT(CASE       WHEN vi.curr_status_id IN ('201','203','204','205')       THEN vi.Curr_Status_ID END) AS 'Total Inventory'       FROM       [SIMS6200].[dbo].[Vehicle_Inventory] AS vi        --JOIN FOR DEALERSHIPS       join SIMS6200.dbo.Organization as o --UPDATED 8.12.13       on o.Org_ID = vi.Store_ID        WHERE       o.Is_Act = 1 --ACTIVE STORES       --AND o.Org_Type = 20       AND vi.Invtr_Type = 10 --USED VEHICLES       AND vi.Store_ID not in (0,138,177,229,231,235,109,175)  --SONIC TEST STORE  and o.Name in (@Dealership)       GROUP BY o.Name        ORDER BY       o.Name
```
