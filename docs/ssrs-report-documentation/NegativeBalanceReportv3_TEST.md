# NegativeBalanceReportv3_TEST

Generated: 2026-06-15  
SSRS path: `/Test/NegativeBalanceReportv3_TEST`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report identifies negative cash balances or accounts that may need review, follow-up, or correction by Cash Management or accounting support teams.

## Executive Summary

| Field               | Value                                |
| ------------------- | ------------------------------------ |
| Report name         | `NegativeBalanceReportv3_TEST`       |
| SSRS path           | `/Test/NegativeBalanceReportv3_TEST` |
| Status signal       | Test or non-production review        |
| Created             | 2018-01-09 13:49:08                  |
| Modified            | 2018-01-09 13:49:08                  |
| Modified by         | SONIC\Mike.Kurn                      |
| Last 6 months usage | 0 executions by 0 users              |
| Last execution      | NULL                                 |
| Subscriptions       | 0                                    |

## Shared Data Sources

| Report datasource | Shared datasource       | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/Test/DataSource_TEST` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt                           | Type   | Notes                                                |
| ----------- | -------------------------------- | ------ | ---------------------------------------------------- |
| `YearMonth` | Enter Year and Month as: YYYY-MM | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `cmag.pNegativeBalanceRpt_Dev_BJ`.

## Backend Dependencies

| Object or command hint            | Notes                                     |
| --------------------------------- | ----------------------------------------- |
| `cmag.pNegativeBalanceRpt_Dev_BJ` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Test/NegativeBalanceReportv3_TEST`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

- This report appears to be test or non-production based on its path or name.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
cmag.pNegativeBalanceRpt_Dev_BJ
```
