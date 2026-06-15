# Replenishment

Generated: 2026-06-15  
SSRS path: `/BI - EchoPark/Replenishment`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Replenishment`                                  |
| SSRS path           | `/BI - EchoPark/Replenishment`                   |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2016-08-08 18:16:31                              |
| Modified            | 2016-08-08 18:24:47                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 1                                                |

## Shared Data Sources

| Report datasource | Shared datasource                    | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------ | ---------------------------- | --------------- | ------- |
| `EchoPark`        | `/BI - EchoPark/DataSource/EchoPark` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `ReplenishmentList` (Text): SELECT Replace_Now, New_StockNo, New_VIN, New_Year, New_Make, New_Model, New_Miles, New_Price, New_Class, Move_To_Location, Move_From_Location, Sold_VIN, Sold_StockNo, Sold_Year, Sold_Make, Sold_Model, Sold_Miles, Sold_Price, Sold_Class, Sold_Date FROM vw_ReplenishList ORDER BY Sold_Date, Move_To_Location, Replace_Now ...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vw_ReplenishList`     | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - EchoPark/Replenishment`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### ReplenishmentList

Type: `Text`

```sql
SELECT        Replace_Now, New_StockNo, New_VIN, New_Year, New_Make, New_Model, New_Miles, New_Price, New_Class, Move_To_Location, Move_From_Location,                           Sold_VIN, Sold_StockNo, Sold_Year, Sold_Make, Sold_Model, Sold_Miles, Sold_Price, Sold_Class, Sold_Date FROM            vw_ReplenishList ORDER BY Sold_Date, Move_To_Location, Replace_Now DESC
```
