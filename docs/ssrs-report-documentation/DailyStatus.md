# DailyStatus

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Daily Status/DailyStatus`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - Daily Status reporting area. It retrieves data through embedded report dataset queries and presents the result as the DailyStatus report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                                                                                                   |
| Asset type            | Report                                                                                                                                                                                                                                                 |
| Native path           | `/BI - Daily Status/DailyStatus`                                                                                                                                                                                                                       |
| Support role          | User-facing report                                                                                                                                                                                                                                     |
| Business process      | Use this report for BI - Daily Status business review when users need report output for operational follow-up, reconciliation, audit, or performance review. It reads or calls SSMS, so support should validate those sources when results look wrong. |
| Primary source        | /BI - Daily Status/DataSource/DMS                                                                                                                                                                                                                      |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                     |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                                                                                                                      |
| Runtime/usage signal  | 9 executions by 6 users; last used 2026-04-10 10:41:36                                                                                                                                                                                                 |
| Status signal         | Active                                                                                                                                                                                                                                                 |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                       |
| Report name           | `DailyStatus`                                                                                                                                                                                                                                          |
| Created               | 2014-08-04 17:53:14                                                                                                                                                                                                                                    |
| Modified              | 2014-08-04 17:53:14                                                                                                                                                                                                                                    |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                     |

## Business Use

Use this report for BI - Daily Status business review when users need report output for operational follow-up, reconciliation, audit, or performance review. It reads or calls SSMS, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Daily Status/DailyStatus`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                       | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Daily Status/DataSource/DMS`     | `Not available from catalog` |                 |         |
| `RA_SIMS`         | `/BI - Daily Status/DataSource/RA_SIMS` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): /**\*\*** Script for SelectTopNRows command from SSMS **\*\***/ SELECT [ExecutionDate] ,[InsertedCount] ,[DeletedCount] ,'WebV' as [DWDatabase] ,[TableName] ,[StartDateTime] ,[EndDateTime] ,convert(float,datediff(SECO
2. Dataset `RA_SIMS` (Text): SELECT [ExecutionDate] ,[InsertedCount] ,DeletedCount ,'RA_SIMS' as [DWDataBase] ,[TableName] ,[StartDateTime] ,[EndDateTime] ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `SSMS`                 | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
/****** Script for SelectTopNRows command from SSMS  ******/ SELECT [ExecutionDate]       ,[InsertedCount]       ,[DeletedCount]       ,'WebV' as [DWDatabase]       ,[TableName]       ,[StartDateTime]       ,[EndDateTime]       ,convert(float,datediff(SECO
```

#### RA_SIMS

Type: `Text`

```sql
SELECT [ExecutionDate]       ,[InsertedCount]       ,DeletedCount             ,'RA_SIMS' as [DWDataBase]       ,[TableName]       ,[StartDateTime]       ,[EndDateTime]       ,convert(float,datediff(SECOND,StartDateTime,EndDateTime))/60 as durationMin
```
