# EchoParkDashboard

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Echo Park/CSI/EchoParkDashboard`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the Echo Park / CSI reporting area. It retrieves data through embedded report dataset queries and presents the result as the EchoParkDashboard report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                             |
| Asset type            | Report                                                                                                                                                                                                                                                                           |
| Native path           | `/Echo Park/CSI/EchoParkDashboard`                                                                                                                                                                                                                                               |
| Support role          | Review candidate report                                                                                                                                                                                                                                                          |
| Business process      | Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by CurrentMonthMM, CurrentMonthStr, CurrentMonthYearStr, CurrentMonthYYYY, Select IsAssociate. |
| Primary source        | /Echo Park/Data Sources/COR-SQL-02.DMS                                                                                                                                                                                                                                           |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                               |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                        |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                     |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                 |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                 |
| Report name           | `EchoParkDashboard`                                                                                                                                                                                                                                                              |
| Created               | 2015-06-08 12:15:17                                                                                                                                                                                                                                                              |
| Modified              | 2015-06-08 12:15:17                                                                                                                                                                                                                                                              |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                                                                                                 |

## Business Use

Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by CurrentMonthMM, CurrentMonthStr, CurrentMonthYearStr, CurrentMonthYYYY, Select IsAssociate.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Echo Park/CSI/EchoParkDashboard`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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
