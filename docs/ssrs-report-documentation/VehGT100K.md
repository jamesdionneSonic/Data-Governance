# VehGT100K

Generated: 2026-06-15  
SSRS path: `/BI - Financial Reporting/VehGT100K`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `VehGT100K`                                      |
| SSRS path           | `/BI - Financial Reporting/VehGT100K`            |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-08-04 16:46:23                              |
| Modified            | 2017-12-13 08:36:11                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 1                                                |

## Shared Data Sources

| Report datasource | Shared datasource                                         | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Financial Reporting/DataSource/COR_SQL_02_DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt      | Type   | Notes                                                |
| ------------ | ----------- | ------ | ---------------------------------------------------- |
| `ReportDate` | Report Date | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT stocktype, AccountingName, Region, control, currentmonth, companyid, accountnumberright, accountnumber, Prefix, Balance, StockDate, DaysInStock, Year, Make, Model, dasha, vehBal, Status, vehPrice1, mileage, trimlevel, color, engineno FROM vw_newVehAging WHERE (currentmonth = CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `vw_newVehAging`       | Referenced by one or more report datasets |
| `vw_UsedVehAging`      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Financial Reporting/VehGT100K`.
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
SELECT     stocktype, AccountingName, Region, control, currentmonth, companyid, accountnumberright, accountnumber, Prefix, Balance, StockDate, DaysInStock, Year, Make,                        Model, dasha, vehBal, Status, vehPrice1, mileage, trimlevel, color, engineno FROM         vw_newVehAging WHERE     (currentmonth = CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(@ReportDate)-1),@ReportDate),101) )   AND (Balance >= 100000)   Union  SELECT     stocktype, AccountingName, Region, control, currentmonth, companyid, accountnumberright, accountnumber, Prefix, Balance, StockDate, DaysInStock, Year, Make,                        Model, dasha, vehBal, Status, vehPrice1, mileage, trimlevel, color, engineno FROM         vw_UsedVehAging WHERE     (currentmonth = CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(@ReportDate)-1),@ReportDate),101) )   AND (Balance >= 100000)
```
