# EchoParkSalesCustomer

Generated: 2026-06-15  
SSRS path: `/Echo Park/CSI/EchoParkSalesCustomer`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the Echo Park / CSI reporting area. It retrieves data through embedded report dataset queries and presents the result as the EchoParkSalesCustomer report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `EchoParkSalesCustomer`                          |
| SSRS path           | `/Echo Park/CSI/EchoParkSalesCustomer`           |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2015-07-16 14:44:18                              |
| Modified            | 2015-07-17 15:43:04                              |
| Modified by         | bedanta.bordoloi                                 |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                        | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS_DataSource`  | `/Echo Park/Data Sources/COR-SQL-02.DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter       | Prompt     | Type     | Notes                                                |
| --------------- | ---------- | -------- | ---------------------------------------------------- |
| `TranEndDate`   | End Date   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `TranStartDate` | Start Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `MaxTranDateDataSet` (Text): SELECT CAST(CAST(YEAR(MAX(TransactionDate)) AS VARCHAR(4))+'-01-01' AS DATE) FirstDayofTranYear ,MAX(TransactionDate) AS MaxTranDate FROM EchoParkCSISales
2. Dataset `ReportDataSet` (Text): NULL

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `EchoParkCSISales`     | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Echo Park/CSI/EchoParkSalesCustomer`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### MaxTranDateDataSet

Type: `Text`

```sql
SELECT  CAST(CAST(YEAR(MAX(TransactionDate)) AS VARCHAR(4))+'-01-01' AS DATE) FirstDayofTranYear  ,MAX(TransactionDate) AS MaxTranDate  FROM EchoParkCSISales
```

#### ReportDataSet

Type: `Text`

```sql
NULL
```
