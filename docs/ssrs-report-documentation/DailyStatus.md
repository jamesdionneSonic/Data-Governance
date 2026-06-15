# DailyStatus

Generated: 2026-06-15  
SSRS path: `/BI - Daily Status/DailyStatus`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - Daily Status reporting area. It retrieves data through embedded report dataset queries and presents the result as the DailyStatus report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                            |
| ------------------- | -------------------------------- |
| Report name         | `DailyStatus`                    |
| SSRS path           | `/BI - Daily Status/DailyStatus` |
| Status signal       | Active                           |
| Created             | 2014-08-04 17:53:14              |
| Modified            | 2014-08-04 17:53:14              |
| Modified by         | SONIC\Mark.Starnes               |
| Last 6 months usage | 9 executions by 6 users          |
| Last execution      | 2026-04-10 10:41:36              |
| Subscriptions       | 1                                |

## Shared Data Sources

| Report datasource | Shared datasource                       | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Daily Status/DataSource/DMS`     | `Not available from catalog` |                 |         |
| `RA_SIMS`         | `/BI - Daily Status/DataSource/RA_SIMS` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): /**\*\*** Script for SelectTopNRows command from SSMS **\*\***/ SELECT [ExecutionDate] ,[InsertedCount] ,[DeletedCount] ,'WebV' as [DWDatabase] ,[TableName] ,[StartDateTime] ,[EndDateTime] ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin ,[RowID] ,[CompletionStatus] FROM [WebV].[dbo].[pg_Load_UD...
2. Dataset `RA_SIMS` (Text): SELECT [ExecutionDate] ,[InsertedCount] ,DeletedCount ,'RA_SIMS' as [DWDataBase] ,[TableName] ,[StartDateTime] ,[EndDateTime] ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin ,[RowID] ,[CompletionStatus] FROM RA_SIMS.[dbo].[pg_Load_UDI_status] (nolock) where ExecutionDate = CAST(Floor(Cast(G...

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SSMS`                           | Referenced by one or more report datasets |
| `WebV.dbo.pg_Load_UDI_status`    | Referenced by one or more report datasets |
| `DMS.dbo.pg_Load_UDI_status`     | Referenced by one or more report datasets |
| `RA_SIMS.dbo.pg_Load_UDI_status` | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Daily Status/DailyStatus`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
/****** Script for SelectTopNRows command from SSMS  ******/ SELECT [ExecutionDate]       ,[InsertedCount]       ,[DeletedCount]       ,'WebV' as [DWDatabase]       ,[TableName]       ,[StartDateTime]       ,[EndDateTime]       ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin       ,[RowID]       ,[CompletionStatus]   FROM [WebV].[dbo].[pg_Load_UDI_status] (nolock)   where ExecutionDate = CAST(Floor(Cast(Getdate() as FLOAT)) As Datetime) and completionstatus = 'Y' --and InsertedCount+DeletedCount > 0  -- order by --tablename,    Union All  SELECT [ExecutionDate]       ,[InsertedCount]       ,UpdatedCount as DeletedCount       ,'DMS' as [DWDataBase]       ,[TableName]       ,[StartDateTime]       ,[EndDateTime]       ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin       ,[RowID]       ,[CompletionStatus]   FROM [DMS].[dbo].[pg_Load_UDI_status] (nolock)   where ExecutionDate = CAST(Floor(Cast(Getdate() as FLOAT)) As Datetime) and completionstatus = 'Y'   order by --tablename,      [DWDatabase], EndDateTime desc--datediff(minute,StartDateTime,EndDateTime) desc
```

#### RA_SIMS

Type: `Text`

```sql
SELECT [ExecutionDate]       ,[InsertedCount]       ,DeletedCount             ,'RA_SIMS' as [DWDataBase]       ,[TableName]       ,[StartDateTime]       ,[EndDateTime]       ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin       ,[RowID]       ,[CompletionStatus]   FROM RA_SIMS.[dbo].[pg_Load_UDI_status] (nolock)   where ExecutionDate = CAST(Floor(Cast(Getdate() as FLOAT)) As Datetime) and completionstatus = 'Y'
```
