# PayrollEntrySummary

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Payroll/PayrollEntrySummary`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports payroll review by summarizing payroll entry or payroll activity information for the selected company, user, or reporting scope. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                   |
| Asset type            | Report                                                                                                                                                                                 |
| Native path           | `/BI - Payroll/PayrollEntrySummary`                                                                                                                                                    |
| Support role          | Review candidate report                                                                                                                                                                |
| Business process      | Use this when Payroll or support teams need to review payroll entry activity by company, user, or summary level. The report is filtered by Choose center of 30-day date range., Refer. |
| Primary source        | /BI - Payroll/DataSource/DMS_DWA                                                                                                                                                       |
| Primary target/output | SSRS report output                                                                                                                                                                     |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                              |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                           |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                       |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                       |
| Report name           | `PayrollEntrySummary`                                                                                                                                                                  |
| Created               | 2014-09-23 17:07:59                                                                                                                                                                    |
| Modified              | 2014-09-25 15:41:31                                                                                                                                                                    |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                     |

## Business Use

Use this when Payroll or support teams need to review payroll entry activity by company, user, or summary level. The report is filtered by Choose center of 30-day date range., Refer.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Payroll/PayrollEntrySummary`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                  | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Payroll/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt                              | Type     | Notes                                                |
| --------- | ----------------------------------- | -------- | ---------------------------------------------------- |
| `Date`    | Choose center of 30-day date range. | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Refer`   | Refer                               | String   | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `PayrollLevelTop` (Text): select d.refer as JE_Reference ,da.AccCoaType ,da.AccAccount as Base_Account ,SUM(d.postingamount) as PostingAmount from dms.dbo.gljedetail_cur d left join [COR-BISQL-02\bisql02].Sonic_Dw.dbo.dim_account da on d.cora_acct_id = da.AccCoraAcctId and d.compan
2. Dataset `TodayDataSet` (Text): SELECT CAST(GETDATE() AS date) AS Today

## Backend Dependencies

| Object or command hint   | Notes                                     |
| ------------------------ | ----------------------------------------- |
| `dms.dbo.gljedetail_cur` | Referenced by one or more report datasets |
| `COR-BISQL-02`           | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### PayrollLevelTop

Type: `Text`

```sql
select d.refer as JE_Reference ,da.AccCoaType ,da.AccAccount as Base_Account ,SUM(d.postingamount) as PostingAmount from dms.dbo.gljedetail_cur d left join [COR-BISQL-02\bisql02].Sonic_Dw.dbo.dim_account da on d.cora_acct_id = da.AccCoraAcctId and d.compan
```

#### TodayDataSet

Type: `Text`

```sql
SELECT        CAST(GETDATE() AS date) AS Today
```
