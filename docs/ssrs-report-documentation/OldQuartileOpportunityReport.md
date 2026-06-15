# OldQuartileOpportunityReport

Generated: 2026-06-15  
SSRS path: `/CRM/OldQuartileOpportunityReport`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the CRM reporting area. It retrieves data through embedded report dataset queries and presents the result as the OldQuartileOpportunityReport report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `OldQuartileOpportunityReport`                   |
| SSRS path           | `/CRM/OldQuartileOpportunityReport`              |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2015-09-15 14:01:46                              |
| Modified            | 2020-04-15 12:42:16                              |
| Modified by         | bedanta.bordoloi                                 |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `Sonic_DW`        | `/CRM/Data Sources/Sonic_DW` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter       | Prompt            | Type    | Notes                                                |
| --------------- | ----------------- | ------- | ---------------------------------------------------- |
| `Dealership_RP` | Select Dealership | String  | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `Year_RP`       | Select Year       | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `YYYYMM_RP`     | Select Month      | String  | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DafaultDates_DS` (Text): NULL
2. Dataset `Dealership_DS` (Text): NULL
3. Dataset `Month_DS` (Text): NULL
4. Dataset `QuartileReport_DS` (Text): NULL
5. Dataset `Year_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/CRM/OldQuartileOpportunityReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DafaultDates_DS

Type: `Text`

```sql
NULL
```

#### Dealership_DS

Type: `Text`

```sql
NULL
```

#### Month_DS

Type: `Text`

```sql
NULL
```

#### QuartileReport_DS

Type: `Text`

```sql
NULL
```

#### Year_DS

Type: `Text`

```sql
NULL
```
