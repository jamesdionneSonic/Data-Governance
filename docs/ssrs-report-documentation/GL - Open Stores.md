# GL - Open Stores

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Controllers/GL - Open Stores`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports controller and accounting review by showing general ledger or store accounting information needed for period-end, reconciliation, or operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                    |
| Asset type            | Report                                                                                                                                                                                  |
| Native path           | `/Controllers/GL - Open Stores`                                                                                                                                                         |
| Support role          | Review candidate report                                                                                                                                                                 |
| Business process      | Use this report for Controllers business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Month. |
| Primary source        | /Controllers/DataSource/DMS                                                                                                                                                             |
| Primary target/output | SSRS report output                                                                                                                                                                      |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                               |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                            |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                        |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                        |
| Report name           | `GL - Open Stores`                                                                                                                                                                      |
| Created               | 2014-08-04 17:00:39                                                                                                                                                                     |
| Modified              | 2014-08-04 17:00:39                                                                                                                                                                     |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                      |

## Business Use

Use this report for Controllers business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Month.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Controllers/GL - Open Stores`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource             | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/Controllers/DataSource/DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `Month`   | Month  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT DISTINCT glcalendar.cora_acct_id, glcalendar.hostitemid, glcalendar.companyid, glcalendar.companyidright, glcalendar.glcutoffdate, glcalendar.glcutofftime, glcalendar.glfirstdayofmonth, glcalendar.glmont
2. Dataset `DefaultDate` (Text): SELECT cast(CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(getdate())),getdate()),101) as date) as Date , 'Last Day of Previous Month'AS Date_Type

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT DISTINCT                        glcalendar.cora_acct_id, glcalendar.hostitemid, glcalendar.companyid, glcalendar.companyidright, glcalendar.glcutoffdate, glcalendar.glcutofftime,                        glcalendar.glfirstdayofmonth, glcalendar.glmont
```

#### DefaultDate

Type: `Text`

```sql
SELECT cast(CONVERT(VARCHAR(25),DATEADD(dd,-(DAY(getdate())),getdate()),101) as date) as Date , 'Last Day of Previous Month'AS Date_Type
```
