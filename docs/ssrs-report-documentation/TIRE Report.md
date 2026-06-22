# TIRE Report

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - FORCE/TIRE Report`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - FORCE reporting area. It retrieves data through embedded report dataset queries and presents the result as the TIRE Report report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                            |
| Asset type            | Report                                                                                                                                                                                                                                                                                          |
| Native path           | `/BI - FORCE/TIRE Report`                                                                                                                                                                                                                                                                       |
| Support role          | User-facing report                                                                                                                                                                                                                                                                              |
| Business process      | Use this report for BI - FORCE business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by End Date, Start Date. It reads or calls Adam, so support should validate those sources when results look wrong. |
| Primary source        | /BI - FORCE/DataSource/DMS_DWA                                                                                                                                                                                                                                                                  |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                              |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                       |
| Runtime/usage signal  | 1 executions by 1 users; last used 2026-06-10 14:16:22                                                                                                                                                                                                                                          |
| Status signal         | Active                                                                                                                                                                                                                                                                                          |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                |
| Report name           | `TIRE Report`                                                                                                                                                                                                                                                                                   |
| Created               | 2014-09-26 14:58:36                                                                                                                                                                                                                                                                             |
| Modified              | 2018-02-13 15:39:23                                                                                                                                                                                                                                                                             |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                                                              |

## Business Use

Use this report for BI - FORCE business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by End Date, Start Date. It reads or calls Adam, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - FORCE/TIRE Report`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                | Connection                   | Credential mode | Enabled |
| ----------------- | -------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - FORCE/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt     | Type     | Notes                                                |
| ----------- | ---------- | -------- | ---------------------------------------------------- |
| `EndDate`   | End Date   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `StartDate` | Start Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): --from Adam Vogel --DECLARE @DaysOfHistory INT; --DECLARE @StartDate DATE; --DECLARE @EndDate DATE; ------------------------------------------------------------------------------------ -- Set the value to determine how far back you want to pull data. ----

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `Adam`                 | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
--from Adam Vogel --DECLARE @DaysOfHistory INT; --DECLARE @StartDate DATE; --DECLARE @EndDate DATE;  ------------------------------------------------------------------------------------ -- Set the value to determine how far back you want to pull data. ----
```
