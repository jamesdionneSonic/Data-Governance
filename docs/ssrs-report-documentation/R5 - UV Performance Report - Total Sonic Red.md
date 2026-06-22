# R5 - UV Performance Report - Total Sonic Red

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RTC/R5 - UV Performance Report - Total Sonic Red`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the RTC reporting area. It retrieves data through embedded report dataset queries and presents the result as the R5 - UV Performance Report - Total Sonic Red report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                           |
| Asset type            | Report                                                                                                                                                                         |
| Native path           | `/RTC/R5 - UV Performance Report - Total Sonic Red`                                                                                                                            |
| Support role          | Review candidate report                                                                                                                                                        |
| Business process      | Use this report for RTC business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by f, t. |
| Primary source        | /RTC/Data Sources/SIMS6200                                                                                                                                                     |
| Primary target/output | SSRS report output                                                                                                                                                             |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                      |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                   |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                               |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                               |
| Report name           | `R5 - UV Performance Report - Total Sonic Red`                                                                                                                                 |
| Created               | 2014-10-17 11:35:45                                                                                                                                                            |
| Modified              | 2017-12-13 10:15:26                                                                                                                                                            |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                             |

## Business Use

Use this report for RTC business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by f, t.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RTC/R5 - UV Performance Report - Total Sonic Red`.
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

1. Dataset `DataSet1` (Text): SELECT o.Name AS 'Dealership', COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 THEN vi.Vehicle_ID END) AS 'B1', COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 THEN vi.Vehicle_ID END) AS 'B2', COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 THEN vi.Vehicle_ID END) AS 'B3', COU

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT o.Name AS 'Dealership',  COUNT(CASE WHEN vi.Age BETWEEN 0 AND 20 THEN vi.Vehicle_ID END) AS 'B1', COUNT(CASE WHEN vi.Age BETWEEN 21 AND 35 THEN vi.Vehicle_ID END) AS 'B2', COUNT(CASE WHEN vi.Age BETWEEN 36 AND 45 THEN vi.Vehicle_ID END) AS 'B3', COU
```
