# SummaryReport

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/JobStatusReports/SummaryReport`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report summarizes job status information so support teams can monitor batch or scheduled processing and identify failed or delayed work. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                       |
| Asset type            | Report                                                                                                                                                                     |
| Native path           | `/JobStatusReports/SummaryReport`                                                                                                                                          |
| Support role          | User-facing report                                                                                                                                                         |
| Business process      | Use this to monitor scheduled job or batch-processing status so support can identify failed, delayed, or missing processing. The report is filtered by Select Report Date. |
| Primary source        | /JobStatusReports/Data Sources/AFScrape                                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                                                         |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                  |
| Runtime/usage signal  | 1 executions by 1 users; last used 2025-12-26 15:28:34                                                                                                                     |
| Status signal         | Active                                                                                                                                                                     |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                           |
| Report name           | `SummaryReport`                                                                                                                                                            |
| Created               | 2018-11-08 10:46:33                                                                                                                                                        |
| Modified              | 2018-11-08 10:46:33                                                                                                                                                        |
| Modified by           | SONIC\David.Ekren                                                                                                                                                          |

## Business Use

Use this to monitor scheduled job or batch-processing status so support can identify failed, delayed, or missing processing. The report is filtered by Select Report Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/JobStatusReports/SummaryReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                         | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------------------- | ---------------------------- | --------------- | ------- |
| `AFScrape`        | `/JobStatusReports/Data Sources/AFScrape` | `Not available from catalog` |                 |         |
| `D1SSIS01`        | `/JobStatusReports/Data Sources/D1SSIS01` | `Not available from catalog` |                 |         |
| `D1SSIS02`        | `/JobStatusReports/Data Sources/D1SSIS02` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt             | Type     | Notes                                                |
| --------- | ------------------ | -------- | ---------------------------------------------------- |
| `date`    | Select Report Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DS_AFScrape` (StoredProcedure): Calls stored procedure `AFScrape_JobStatus`.
2. Dataset `DS_D1SSIS02` (Text): DECLARE @RUN_DATE1 int = convert(varchar(8),@date,112) IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp SELECT DISTINCT JOB.name ,CASE [dbo].fnCheckJobStatus_SSIS02( job.name , @date) when 1 THEN 'Success' else ( CASE WHEN H.RUN_DATE =
3. Dataset `SSIS01ReportDataset` (Text): DECLARE @RUN_DATE1 int = convert(varchar(8),@date,112) IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp SELECT DISTINCT JOB.name , CASE [dbo].fnCheckJobStatus_SSIS01( job.name , @date) when 1 THEN 'Success' else ( CASE WHEN H.RUN_DATE

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `AFScrape_JobStatus`   | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DS_AFScrape

Type: `StoredProcedure`

```sql
AFScrape_JobStatus
```

#### DS_D1SSIS02

Type: `Text`

```sql
DECLARE @RUN_DATE1 int  =   convert(varchar(8),@date,112)   IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp  SELECT  DISTINCT JOB.name ,CASE [dbo].fnCheckJobStatus_SSIS02( job.name  , @date) when 1 THEN 'Success'  else (  CASE  WHEN H.RUN_DATE =
```

#### SSIS01ReportDataset

Type: `Text`

```sql
DECLARE @RUN_DATE1 int  =   convert(varchar(8),@date,112)   IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp  SELECT  DISTINCT JOB.name , CASE [dbo].fnCheckJobStatus_SSIS01( job.name  , @date) when 1 THEN 'Success'  else (  CASE  WHEN H.RUN_DATE
```
