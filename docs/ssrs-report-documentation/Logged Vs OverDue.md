# Logged Vs OverDue

Generated: 2026-06-15  
SSRS path: `/BI - Retail Strategy/Logged Vs OverDue`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Retail Strategy reporting area. It primarily retrieves data through stored procedure `pSonicLoggedvsOverDue_v3`. Review the procedure name and parameters when troubleshooting what business question the report answers.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `Logged Vs OverDue`                              |
| SSRS path           | `/BI - Retail Strategy/Logged Vs OverDue`        |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2014-08-08 09:05:26                              |
| Modified            | 2014-08-08 09:05:26                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 1                                                |

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `eLeadDW`         | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `End`     | End    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Start`   | Start  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `pSonicLoggedvsOverDue_v3`.

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `pSonicLoggedvsOverDue_v3` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/Logged Vs OverDue`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
pSonicLoggedvsOverDue_v3
```
