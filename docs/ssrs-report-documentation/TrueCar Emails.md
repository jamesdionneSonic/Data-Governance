# TrueCar Emails

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Legal/TrueCar Emails`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports legal or compliance follow-up by listing relevant TrueCar email activity or records for review. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                             |
| Asset type            | Report                                                                                                                                           |
| Native path           | `/Legal/TrueCar Emails`                                                                                                                          |
| Support role          | Review candidate report                                                                                                                          |
| Business process      | Use this report for Legal business review when users need report output for operational follow-up, reconciliation, audit, or performance review. |
| Primary source        | /Legal/DataSource/BI_Workdb                                                                                                                      |
| Primary target/output | SSRS report output                                                                                                                               |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                        |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                     |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                 |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                 |
| Report name           | `TrueCar Emails`                                                                                                                                 |
| Created               | 2015-03-25 08:47:27                                                                                                                              |
| Modified              | 2015-03-25 08:47:27                                                                                                                              |
| Modified by           | SONIC\Mark.Starnes                                                                                                                               |

## Business Use

Use this report for Legal business review when users need report output for operational follow-up, reconciliation, audit, or performance review.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Legal/TrueCar Emails`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource             | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------------------- | ---------------------------- | --------------- | ------- |
| `BI_Workdb`       | `/Legal/DataSource/BI_Workdb` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `Emails` (Text): SELECT [lPersonID] ,[lcompanyid] ,[ADPCustNO] ,[OpportunityID] ,[lCurrentOwnerID] ,[TaskID] ,[szTo] ,[szFrom] ,[szSubject] ,[DueDate] ,[dtcompleted] ,[dtClosed] ,[dtLastEdit] ,[N

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Emails

Type: `Text`

```sql
SELECT [lPersonID]       ,[lcompanyid]       ,[ADPCustNO]       ,[OpportunityID]       ,[lCurrentOwnerID]       ,[TaskID]       ,[szTo]       ,[szFrom]       ,[szSubject]       ,[DueDate]       ,[dtcompleted]       ,[dtClosed]       ,[dtLastEdit]       ,[N
```
