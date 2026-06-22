# TrafficManagementReport

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CRM/TrafficManagementReport`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the CRM reporting area. It retrieves data through embedded report dataset queries and presents the result as the TrafficManagementReport report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                    |
| Asset type            | Report                                                                                                                                                                                                                                                                  |
| Native path           | `/CRM/TrafficManagementReport`                                                                                                                                                                                                                                          |
| Support role          | Review candidate report                                                                                                                                                                                                                                                 |
| Business process      | Use this report for CRM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Dealership, Select Left Month, Select Left Year, Select Right Month, Select Right Year. |
| Primary source        | NULL                                                                                                                                                                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                      |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                               |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                            |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                        |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                        |
| Report name           | `TrafficManagementReport`                                                                                                                                                                                                                                               |
| Created               | 2016-02-04 15:42:53                                                                                                                                                                                                                                                     |
| Modified              | 2016-02-04 15:42:53                                                                                                                                                                                                                                                     |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                                                                                        |

## Business Use

Use this report for CRM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Dealership, Select Left Month, Select Left Year, Select Right Month, Select Right Year.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CRM/TrafficManagementReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `NULL`            | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

| Parameter       | Prompt             | Type     | Notes                                                |
| --------------- | ------------------ | -------- | ---------------------------------------------------- |
| `Dealership_RP` | Select Dealership  | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `L_Month_RP`    | Select Left Month  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `L_Year_RP`     | Select Left Year   | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `R_Month_RP`    | Select Right Month | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `R_Year_RP`     | Select Right Year  | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Region_RP`     | Select Region      | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `Dealership_DS` (Text): NULL
2. Dataset `DefaultDates_DS` (Text): NULL
3. Dataset `L_Month_DS` (Text): NULL
4. Dataset `R_Month_DS` (Text): NULL
5. Dataset `Region_DS` (Text): NULL
6. Dataset `TMReportDataSet` (Text): NULL
7. Dataset `Year_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Dealership_DS

Type: `Text`

```sql
NULL
```

#### DefaultDates_DS

Type: `Text`

```sql
NULL
```

#### L_Month_DS

Type: `Text`

```sql
NULL
```

#### R_Month_DS

Type: `Text`

```sql
NULL
```

#### Region_DS

Type: `Text`

```sql
NULL
```

#### TMReportDataSet

Type: `Text`

```sql
NULL
```

#### Year_DS

Type: `Text`

```sql
NULL
```
