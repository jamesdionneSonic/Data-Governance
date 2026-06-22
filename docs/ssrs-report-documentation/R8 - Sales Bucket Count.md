# R8 - Sales Bucket Count

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RTC/R8 - Sales Bucket Count`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the RTC reporting area. It retrieves data through embedded report dataset queries and presents the result as the R8 - Sales Bucket Count report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                           |
| Asset type            | Report                                                                                                                                                                         |
| Native path           | `/RTC/R8 - Sales Bucket Count`                                                                                                                                                 |
| Support role          | Review candidate report                                                                                                                                                        |
| Business process      | Use this report for RTC business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by f, t. |
| Primary source        | /RTC/Data Sources/SIMS6200                                                                                                                                                     |
| Primary target/output | SSRS report output                                                                                                                                                             |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                      |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                   |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                               |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                               |
| Report name           | `R8 - Sales Bucket Count`                                                                                                                                                      |
| Created               | 2014-10-17 11:35:46                                                                                                                                                            |
| Modified              | 2017-12-13 10:15:29                                                                                                                                                            |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                             |

## Business Use

Use this report for RTC business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by f, t.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RTC/R8 - Sales Bucket Count`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type   | Notes                                                |
| --------- | ------ | ------ | ---------------------------------------------------- |
| `f`       | f      | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `t`       | t      | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT DISTINCT o.Name 'Dealership', COUNT(CASE WHEN vi.Age < 21 THEN vi.Age END) 'Bucket 1' , COUNT(CASE WHEN vi.Age between 21 and 35 THEN vi.Age END) 'Bucket 2' , COUNT(CASE WHEN vi.Age between 36 and 45 THEN vi.Age END) 'Bu

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT DISTINCT o.Name 'Dealership', COUNT(CASE    WHEN vi.Age < 21     THEN vi.Age END) 'Bucket 1' ,      COUNT(CASE    WHEN vi.Age between 21 and 35     THEN vi.Age END) 'Bucket 2' ,    COUNT(CASE    WHEN vi.Age between 36 and 45     THEN vi.Age END) 'Bu
```
