# NegativeBalanceReportv3

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CMA/NegativeBalanceReportv3`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report identifies negative cash balances or accounts that may need review, follow-up, or correction by Cash Management or accounting support teams. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                 |
| Asset type            | Report                                                                                                                                                                                               |
| Native path           | `/CMA/NegativeBalanceReportv3`                                                                                                                                                                       |
| Support role          | Review candidate report                                                                                                                                                                              |
| Business process      | Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Enter Year and Month as: YYYY-MM. |
| Primary source        | /CMA/DataSource/CMA                                                                                                                                                                                  |
| Primary target/output | SSRS report output                                                                                                                                                                                   |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                            |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                         |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                     |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                     |
| Report name           | `NegativeBalanceReportv3`                                                                                                                                                                            |
| Created               | 2014-08-15 10:38:00                                                                                                                                                                                  |
| Modified              | 2014-08-15 10:38:00                                                                                                                                                                                  |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                   |

## Business Use

Use this for Cash Management review when accounting users need transaction detail, daily activity, cash summary, or exception follow-up. The report is filtered by Enter Year and Month as: YYYY-MM.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CMA/NegativeBalanceReportv3`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource     | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/CMA/DataSource/CMA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt                           | Type   | Notes                                                |
| ----------- | -------------------------------- | ------ | ---------------------------------------------------- |
| `YearMonth` | Enter Year and Month as: YYYY-MM | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `cmag.pNegativeBalanceRpt_Dev_BJ`.

## Backend Dependencies

| Object or command hint            | Notes                                     |
| --------------------------------- | ----------------------------------------- |
| `cmag.pNegativeBalanceRpt_Dev_BJ` | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
cmag.pNegativeBalanceRpt_Dev_BJ
```
