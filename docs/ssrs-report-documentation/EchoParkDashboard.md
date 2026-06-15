# EchoParkDashboard

Generated: 2026-06-15  
SSRS path: `/Echo Park/CSI/EchoParkDashboard`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the Echo Park / CSI reporting area. It retrieves data through embedded report dataset queries and presents the result as the EchoParkDashboard report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `EchoParkDashboard`                              |
| SSRS path           | `/Echo Park/CSI/EchoParkDashboard`               |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2015-06-08 12:15:17                              |
| Modified            | 2015-06-08 12:15:17                              |
| Modified by         | bedanta.bordoloi                                 |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                        | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS_DataSource`  | `/Echo Park/Data Sources/COR-SQL-02.DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter             | Prompt              | Type    | Notes                                                |
| --------------------- | ------------------- | ------- | ---------------------------------------------------- |
| `CurrentMonthMM`      | CurrentMonthMM      | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `CurrentMonthStr`     | CurrentMonthStr     | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `CurrentMonthYearStr` | CurrentMonthYearStr | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `CurrentMonthYYYY`    | CurrentMonthYYYY    | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `IsAssociate`         | Select IsAssociate  | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `LastMonthMM`         | LastMonthMM         | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `LastMonthStr`        | LastMonthStr        | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `LastMonthYearStr`    | LastMonthYearStr    | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `LastMonthYYYY`       | LastMonthYYYY       | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `ReportType`          | Select Report Type  | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DatesDataSet` (Text): NULL
2. Dataset `SalesDataSet` (Text): NULL
3. Dataset `ServiceDataset` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Echo Park/CSI/EchoParkDashboard`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DatesDataSet

Type: `Text`

```sql
NULL
```

#### SalesDataSet

Type: `Text`

```sql
NULL
```

#### ServiceDataset

Type: `Text`

```sql
NULL
```
