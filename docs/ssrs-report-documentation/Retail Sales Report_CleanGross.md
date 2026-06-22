# Retail Sales Report_CleanGross

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - FPnA reporting area. It retrieves data through embedded report dataset queries and presents the result as the Retail Sales Report_CleanGross report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                            |
| Asset type            | Report                                                                                                                                                                                                          |
| Native path           | `/BI - FPnA/Retail Sales Report_CleanGross`                                                                                                                                                                     |
| Support role          | Review candidate report                                                                                                                                                                                         |
| Business process      | Use this report for BI - FPnA business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, Deal Status, End Date. |
| Primary source        | /BI - FPnA/DataSource/COR-BISQL-01                                                                                                                                                                              |
| Primary target/output | SSRS report output                                                                                                                                                                                              |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                       |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                    |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                |
| Report name           | `Retail Sales Report_CleanGross`                                                                                                                                                                                |
| Created               | 2014-08-15 13:39:34                                                                                                                                                                                             |
| Modified              | 2017-12-13 17:59:05                                                                                                                                                                                             |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                              |

## Business Use

Use this report for BI - FPnA business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Beg Date, Deal Status, End Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                    | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------ | ---------------------------- | --------------- | ------- |
| `COR_BISQL_01`    | `/BI - FPnA/DataSource/COR-BISQL-01` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt      | Type     | Notes                                                |
| ------------ | ----------- | -------- | ---------------------------------------------------- |
| `BegDate`    | Beg Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `DealStatus` | Deal Status | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `EndDate`    | End Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DealTypes` (Text): select 'F' as DealType union select 'B'
2. Dataset `Retail_Sales_MTD_lastyear` (Text): -------------------------------------------------------------------------------------------------------------------- --view to pull vehicle information --GOOD ------------------------------------------------------------------------------------------------

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DealTypes

Type: `Text`

```sql
select 'F' as DealType union  select 'B'
```

#### Retail_Sales_MTD_lastyear

Type: `Text`

```sql
-------------------------------------------------------------------------------------------------------------------- --view to pull vehicle information  --GOOD ------------------------------------------------------------------------------------------------
```
