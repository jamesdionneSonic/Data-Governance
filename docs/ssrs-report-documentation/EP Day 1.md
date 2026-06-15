# EP Day 1

Generated: 2026-06-15  
SSRS path: `/BI - Data Analytics/EP Day 1`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Data Analytics reporting area. It retrieves data through embedded report dataset queries and presents the result as the EP Day 1 report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                           |
| ------------------- | ------------------------------- |
| Report name         | `EP Day 1`                      |
| SSRS path           | `/BI - Data Analytics/EP Day 1` |
| Status signal       | Active                          |
| Created             | 2017-02-17 15:23:10             |
| Modified            | 2017-02-17 15:23:10             |
| Modified by         | SONIC\Mark.Starnes              |
| Last 6 months usage | 1 executions by 1 users         |
| Last execution      | 2026-01-23 13:07:07             |
| Subscriptions       | 0                               |

## Shared Data Sources

| Report datasource | Shared datasource                        | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------- | ---------------------------- | --------------- | ------- |
| `EpProd`          | `/BI - Data Analytics/DataSource/EpProd` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `Day1` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Data Analytics/EP Day 1`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### Day1

Type: `Text`

```sql
NULL
```
