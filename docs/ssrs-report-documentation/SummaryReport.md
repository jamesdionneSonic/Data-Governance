# SummaryReport

Generated: 2026-06-15  
SSRS path: `/JobStatusReports/SummaryReport`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report summarizes job status information so support teams can monitor batch or scheduled processing and identify failed or delayed work.

## Executive Summary

| Field               | Value                             |
| ------------------- | --------------------------------- |
| Report name         | `SummaryReport`                   |
| SSRS path           | `/JobStatusReports/SummaryReport` |
| Status signal       | Active                            |
| Created             | 2018-11-08 10:46:33               |
| Modified            | 2018-11-08 10:46:33               |
| Modified by         | SONIC\David.Ekren                 |
| Last 6 months usage | 1 executions by 1 users           |
| Last execution      | 2025-12-26 15:28:34               |
| Subscriptions       | 0                                 |

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
2. Dataset `DS_D1SSIS02` (Text): DECLARE @RUN_DATE1 int = convert(varchar(8),@date,112) IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp SELECT DISTINCT JOB.name ,CASE [dbo].fnCheckJobStatus_SSIS02( job.name , @date) when 1 THEN 'Success' else ( CASE WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 1 THEN 'Success' WHEN H.RUN_DATE = @RUN_DATE...
3. Dataset `SSIS01ReportDataset` (Text): DECLARE @RUN_DATE1 int = convert(varchar(8),@date,112) IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp SELECT DISTINCT JOB.name , CASE [dbo].fnCheckJobStatus_SSIS01( job.name , @date) when 1 THEN 'Success' else ( CASE WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 1 THEN 'Success' WHEN H.RUN_DATE = @RUN_DAT...

## Backend Dependencies

| Object or command hint    | Notes                                     |
| ------------------------- | ----------------------------------------- |
| `AFScrape_JobStatus`      | Referenced by one or more report datasets |
| `msdb.DBO.SYSJOBS_VIEW`   | Referenced by one or more report datasets |
| `msdb.DBO.SYSJOBHISTORY`  | Referenced by one or more report datasets |
| `msdb.DBO.SYSJOBACTIVITY` | Referenced by one or more report datasets |
| `msdb.dbo.sysschedules`   | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/JobStatusReports/SummaryReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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
DECLARE @RUN_DATE1 int  =   convert(varchar(8),@date,112)   IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp  SELECT  DISTINCT JOB.name ,CASE [dbo].fnCheckJobStatus_SSIS02( job.name  , @date) when 1 THEN 'Success'  else (  CASE  WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 1 THEN 'Success'      WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 0 THEN 'Failure'              --WHEN H.RUN_DATE = @RUN_DATE1 AND H.RUN_STATUS = 2 THEN 'Retry'             --WHEN H.RUN_DATE = @RUN_DATE1 AND H.RUN_STATUS = 3 THEN 'Cancelled'       WHEN GETDATE() <= next_scheduled_run_date THEN 'Yet to run'       WHEN H.RUN_DATE = @RUN_DATE1 and ACTIVITY.start_execution_date IS NOT NULL AND ACTIVITY.stop_execution_date IS NULL then 'Running'               ELSE 'Unknown'       END)      END  AS STATUS,                                         CASE WHEN run_date  < @RUN_DATE1  THEN CONVERT(VARCHAR(8),next_scheduled_run_date,112) ELSE RUN_DATE END AS RUN_DATE     INTO #TEMP      FROM  msdb.DBO.SYSJOBS_VIEW JOB(NOLOCK)--1             JOIN msdb.DBO.SYSJOBHISTORY H(NOLOCK) ON JOB.JOB_ID = H.JOB_ID --AND H.run_date = @RUN_DATE--2             JOIN msdb.DBO.SYSJOBACTIVITY ACTIVITY(NOLOCK) ON JOB.JOB_ID = ACTIVITY.JOB_ID--3             JOIN msdb.dbo.sysschedules ac ON ac.schedule_id = ac.schedule_id --4       AND INSTANCE_ID IN (        SELECT MAX(INSTANCE_ID) FROM  msdb.DBO.SYSJOBS_VIEW JOB(NOLOCK)--1                     JOIN msdb.DBO.SYSJOBHISTORY H(NOLOCK) ON JOB.JOB_ID = H.JOB_ID--2         WHERE (H.RUN_DATE  = @RUN_DATE1  OR  CONVERT(VARCHAR(8),next_scheduled_run_date,112) =@RUN_DATE1)        GROUP BY JOB.NAME, RUN_DATE     )         WHERE (H.RUN_DATE  = @RUN_DATE1 OR  CONVERT(VARCHAR(8),next_scheduled_run_date,112) = @RUN_DATE1)        AND JOB.ENABLED = 1   IF OBJECT_ID('tempdb..#FINAL') IS NOT NULL drop table #FINAL     SELECT * INTO #FINAL FROM (     SELECT DISTINCT NAME,'No Run' AS STATUS,NULL AS RUN_DATE FROM msdb.DBO.SYSJOBS_VIEW (NOLOCK)--1                 WHERE NAME NOT IN (SELECT DISTINCT NAME FROM #TEMP)  AND ENABLED = 1 -- FOR NOT RUNNING JOBS         UNION         SELECT * FROM #TEMP     )A  select name, case when row  = 2 then 'Yet to run(Multiple Run)' else status end as status from ( SELECT  name,status,row_number()over(partition by name order by status) as row FROM #FINAL where status != 'No Run' )a order by Status
```

#### SSIS01ReportDataset

Type: `Text`

```sql
DECLARE @RUN_DATE1 int  =   convert(varchar(8),@date,112)   IF OBJECT_ID('tempdb..#temp') IS NOT NULL drop table #temp  SELECT  DISTINCT JOB.name , CASE [dbo].fnCheckJobStatus_SSIS01( job.name  , @date) when 1 THEN 'Success'  else (  CASE  WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 1 THEN 'Success'      WHEN H.RUN_DATE = @RUN_DATE1 AND H.run_status = 0 THEN 'Failure'              --WHEN H.RUN_DATE = @RUN_DATE1 AND H.RUN_STATUS = 2 THEN 'Retry'             --WHEN H.RUN_DATE = @RUN_DATE1 AND H.RUN_STATUS = 3 THEN 'Cancelled'       WHEN GETDATE() <= next_scheduled_run_date THEN 'Yet to run'       WHEN H.RUN_DATE = @RUN_DATE1 and ACTIVITY.start_execution_date IS NOT NULL AND ACTIVITY.stop_execution_date IS NULL then 'Running'               ELSE 'Unknown'      END)      END  AS STATUS,                                         CASE WHEN run_date  < @RUN_DATE1  THEN CONVERT(VARCHAR(8),next_scheduled_run_date,112) ELSE RUN_DATE END AS RUN_DATE     INTO #TEMP      FROM  msdb.DBO.SYSJOBS_VIEW JOB(NOLOCK)--1             JOIN msdb.DBO.SYSJOBHISTORY H(NOLOCK) ON JOB.JOB_ID = H.JOB_ID --AND H.run_date = @RUN_DATE--2             JOIN msdb.DBO.SYSJOBACTIVITY ACTIVITY(NOLOCK) ON JOB.JOB_ID = ACTIVITY.JOB_ID--3             JOIN msdb.dbo.sysschedules ac ON ac.schedule_id = ac.schedule_id --4       AND INSTANCE_ID IN (        SELECT MAX(INSTANCE_ID) FROM  msdb.DBO.SYSJOBS_VIEW JOB(NOLOCK)--1                     JOIN msdb.DBO.SYSJOBHISTORY H(NOLOCK) ON JOB.JOB_ID = H.JOB_ID--2         WHERE (H.RUN_DATE  = @RUN_DATE1  OR  CONVERT(VARCHAR(8),next_scheduled_run_date,112) =@RUN_DATE1)        GROUP BY JOB.NAME, RUN_DATE     )         WHERE (H.RUN_DATE  = @RUN_DATE1 OR  CONVERT(VARCHAR(8),next_scheduled_run_date,112) = @RUN_DATE1)        AND JOB.ENABLED = 1   IF OBJECT_ID('tempdb..#FINAL') IS NOT NULL drop table #FINAL     SELECT * INTO #FINAL FROM (     SELECT DISTINCT NAME,'No Run' AS STATUS,NULL AS RUN_DATE FROM msdb.DBO.SYSJOBS_VIEW (NOLOCK)--1                 WHERE NAME NOT IN (SELECT DISTINCT NAME FROM #TEMP)  AND ENABLED = 1 -- FOR NOT RUNNING JOBS         UNION         SELECT * FROM #TEMP     )A  select name, case when row  = 2 then 'Yet to run(Multiple Run)' else status end as status from ( SELECT  name,status,row_number()over(partition by name order by status) as row FROM #FINAL where status != 'No Run' )a order by Status
```
