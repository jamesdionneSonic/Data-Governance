# Sonic Quartile Report

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/Sonic Quartile Report`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the Sonic Quartile Report report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Sonic Quartile Report`                          |
| SSRS path           | `/BI - Retail Strategy/Sonic Quartile Report`    |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-08-04 17:07:59                              |
| Modified            | 2015-01-05 11:43:58                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `eLeadDW`         | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `end`     | end    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `start`   | start  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): exec pSonicQuartileReport @start,@end

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `pSonicQuartileReport` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/Sonic Quartile Report`.
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
exec pSonicQuartileReport @start,@end
```
