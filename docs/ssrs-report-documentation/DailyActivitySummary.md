# DailyActivitySummary

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CMA/DailyActivitySummary`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report summarizes daily Cash Management activity so users can review transaction volume and activity trends without opening transaction-level detail first. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                              |
| Asset type            | Report                                                                                                                                                                            |
| Native path           | `/CMA/DailyActivitySummary`                                                                                                                                                       |
| Support role          | User-facing report                                                                                                                                                                |
| Business process      | Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Activity Date. |
| Primary source        | /CMA/DataSource/CMA                                                                                                                                                               |
| Primary target/output | SSRS report output                                                                                                                                                                |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                         |
| Runtime/usage signal  | 2291 executions by 144 users; last used 2026-06-08 12:11:14                                                                                                                       |
| Status signal         | Active, high usage                                                                                                                                                                |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                  |
| Report name           | `DailyActivitySummary`                                                                                                                                                            |
| Created               | 2014-08-15 10:38:10                                                                                                                                                               |
| Modified              | 2021-11-15 20:37:05                                                                                                                                                               |
| Modified by           | SONIC\Doug.Morgan                                                                                                                                                                 |

## Business Use

Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Activity Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CMA/DailyActivitySummary`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
cmag.usp_DailyActivity
```
