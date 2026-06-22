# CustomerByName

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/SCORES/CustomerByName`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports retail strategy scorecard review by presenting operational performance measures for the selected store, market, or reporting period. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                                             |
| Asset type            | Report                                                                                                                                                                                                                                                                                                                                           |
| Native path           | `/BI - Retail Strategy/SCORES/CustomerByName`                                                                                                                                                                                                                                                                                                    |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                                                          |
| Business process      | Use this report for BI - Retail Strategy / SCORES business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by First Name, Last Name. It reads or calls ScoresMigration.dbo.MDMCustDetail, so support should validate those sources when results look wrong. |
| Primary source        | NULL                                                                                                                                                                                                                                                                                                                                             |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                                               |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                                                        |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                                                     |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                                                 |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                                                 |
| Report name           | `CustomerByName`                                                                                                                                                                                                                                                                                                                                 |
| Created               | 2014-10-27 09:05:45                                                                                                                                                                                                                                                                                                                              |
| Modified              | 2014-10-27 09:05:45                                                                                                                                                                                                                                                                                                                              |
| Modified by           | robab.fayazi                                                                                                                                                                                                                                                                                                                                     |

## Business Use

Use this report for BI - Retail Strategy / SCORES business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by First Name, Last Name. It reads or calls ScoresMigration.dbo.MDMCustDetail, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/SCORES/CustomerByName`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt     | Type   | Notes                                                |
| ----------- | ---------- | ------ | ---------------------------------------------------- |
| `firstname` | First Name | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `lastname`  | Last Name  | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT \* FROM ScoresMigration.dbo.MDMCustDetail WHERE (FirstName LIKE '%' + @firstname + '%') AND (LastName LIKE '%' + @lastname + '%') and dm_code not like '' and dm_code is not null order by GlobalMaster_Code,DM_Code,SortOrder

## Backend Dependencies

| Object or command hint              | Notes                                     |
| ----------------------------------- | ----------------------------------------- |
| `ScoresMigration.dbo.MDMCustDetail` | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT       * FROM            ScoresMigration.dbo.MDMCustDetail WHERE        (FirstName LIKE '%' + @firstname + '%') AND (LastName LIKE '%' + @lastname + '%') and dm_code not like '' and dm_code is not null order by GlobalMaster_Code,DM_Code,SortOrder
```
