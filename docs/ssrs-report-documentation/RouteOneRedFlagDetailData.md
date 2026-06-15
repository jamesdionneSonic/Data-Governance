# RouteOneRedFlagDetailData

Generated: 2026-06-15  
SSRS path: `/RouteOne/RouteOneRedFlagDetailData`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the RouteOne reporting area. It retrieves data through embedded report dataset queries and presents the result as the RouteOneRedFlagDetailData report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `RouteOneRedFlagDetailData`                      |
| SSRS path           | `/RouteOne/RouteOneRedFlagDetailData`            |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2018-04-27 10:11:21                              |
| Modified            | 2018-04-27 10:11:21                              |
| Modified by         | SONIC\Val.Marz                                   |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource     | Shared datasource                 | Connection                   | Credential mode | Enabled |
| --------------------- | --------------------------------- | ---------------------------- | --------------- | ------- |
| `Sonic_DW_DataSource` | `/RouteOne/Data Sources/Speed_Db` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter                 | Prompt               | Type   | Notes                                                |
| ------------------------- | -------------------- | ------ | ---------------------------------------------------- |
| `paramApplicantName`      | Applicant Name       | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `paramDealerName`         | Dealer Name          | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `paramPurchaseVehicleVIN` | Purchase Vehicle VIN | String | Nullable: true; Allow blank: true; Multi-value: NULL |

## Data Logic

1. Dataset `RedFlagReport_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/RouteOne/RouteOneRedFlagDetailData`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### RedFlagReport_DS

Type: `Text`

```sql
NULL
```
