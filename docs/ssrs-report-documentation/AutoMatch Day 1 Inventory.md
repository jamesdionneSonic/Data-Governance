# AutoMatch Day 1 Inventory

Generated: 2026-06-15  
SSRS path: `/Echo Park/Inventory/AutoMatch Day 1 Inventory`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `AutoMatch Day 1 Inventory`                      |
| SSRS path           | `/Echo Park/Inventory/AutoMatch Day 1 Inventory` |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2017-01-09 10:28:09                              |
| Modified            | 2017-01-09 10:40:03                              |
| Modified by         | bedanta.bordoloi                                 |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 1                                                |

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `NULL`            | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `AMDay1DataSet` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/Echo Park/Inventory/AutoMatch Day 1 Inventory`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### AMDay1DataSet

Type: `Text`

```sql
NULL
```
