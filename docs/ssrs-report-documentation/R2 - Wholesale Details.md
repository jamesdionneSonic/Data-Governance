# R2 - Wholesale Details

Generated: 2026-06-15  
SSRS path: `/RTC/R2 - Wholesale Details`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `R2 - Wholesale Details`                         |
| SSRS path           | `/RTC/R2 - Wholesale Details`                    |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-10-17 11:35:43                              |
| Modified            | 2017-12-13 10:15:16                              |
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

1. Dataset `DataSet1` (Text): SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age FROM SIMS6200Retail.dbo.Vehicle_Inventory AS vi --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200Retail.dbo.VEHICLE AS v ON v.Vehicle_ID = vi.Vehicle_ID --JOIN FOR DEALERSHIPS JOIN SIMS6200Retail.dbo.Organization as o --UPDATED 8....
2. Dataset `DataSet2` (Text): SELECT distinct o.Name AS 'Dealership' FROM SIMS6200retail.dbo.Organization as o --UPDATED 8.12.13

## Backend Dependencies

| Object or command hint                 | Notes                                     |
| -------------------------------------- | ----------------------------------------- |
| `SIMS6200Retail.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                                  | Referenced by one or more report datasets |
| `SIMS6200Retail.dbo.VEHICLE`           | Referenced by one or more report datasets |
| `SIMS6200Retail.dbo.Organization`      | Referenced by one or more report datasets |
| `SIMS6200retail.dbo.Organization`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RTC/R2 - Wholesale Details`.
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
SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age  FROM SIMS6200Retail.dbo.Vehicle_Inventory AS vi  --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200Retail.dbo.VEHICLE AS v  ON v.Vehicle_ID = vi.Vehicle_ID  --JOIN FOR DEALERSHIPS JOIN SIMS6200Retail.dbo.Organization as o --UPDATED 8.12.13 on o.Org_ID = vi.Store_ID  WHERE o.Is_Act = 1 --ACTIVE STORES --AND o.Org_Type = 20  AND vi.Curr_Status_ID IN (205) --PW units AND vi.Invtr_Type = 10 --USED VEHICLES AND vi.Store_ID not in (0,138,177,229,231,235,109,175)  --SONIC TEST STORE  and o.Name in (@Dealership) ORDER BY DEALERSHIP, vi.Curr_Status_ID
```

#### DataSet2

Type: `Text`

```sql
SELECT distinct o.Name AS 'Dealership'  FROM SIMS6200retail.dbo.Organization as o --UPDATED 8.12.13
```
