# DailyActivitySummary

Generated: 2026-06-15  
SSRS path: `/CMA/DailyActivitySummary`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report summarizes daily Cash Management activity so users can review transaction volume and activity trends without opening transaction-level detail first.

## Executive Summary

| Field               | Value                        |
| ------------------- | ---------------------------- |
| Report name         | `DailyActivitySummary`       |
| SSRS path           | `/CMA/DailyActivitySummary`  |
| Status signal       | Active, high usage           |
| Created             | 2014-08-15 10:38:10          |
| Modified            | 2021-11-15 20:37:05          |
| Modified by         | SONIC\Doug.Morgan            |
| Last 6 months usage | 2317 executions by 144 users |
| Last execution      | 2026-06-08 12:11:14          |
| Subscriptions       | 0                            |

## Shared Data Sources

| Report datasource | Shared datasource     | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------- | ---------------------------- | --------------- | ------- |
| `CMAG`            | `/CMA/DataSource/CMA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter      | Prompt        | Type     | Notes                                                |
| -------------- | ------------- | -------- | ---------------------------------------------------- |
| `ActivityDate` | Activity Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `cmag.usp_DailyActivity`.

## Backend Dependencies

| Object or command hint   | Notes                                     |
| ------------------------ | ----------------------------------------- |
| `cmag.usp_DailyActivity` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/CMA/DailyActivitySummary`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
cmag.usp_DailyActivity
```
