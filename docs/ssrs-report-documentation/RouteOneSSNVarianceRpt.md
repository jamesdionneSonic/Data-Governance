# RouteOneSSNVarianceRpt

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RouteOne/RouteOneSSNVarianceRpt`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the RouteOne reporting area. It retrieves data through embedded report dataset queries and presents the result as the RouteOneSSNVarianceRpt report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                           |
| Asset type            | Report                                                                                                                                                                                                         |
| Native path           | `/RouteOne/RouteOneSSNVarianceRpt`                                                                                                                                                                             |
| Support role          | Review candidate report                                                                                                                                                                                        |
| Business process      | Use this for RouteOne finance or compliance review where deal detail, red-flag, SSN variance, or summary activity may require follow-up. The report is filtered by From SubmissionDate :, To SubmissionDate :. |
| Primary source        | /RouteOne/Data Sources/COR-BISQL-02_Sonic_DW                                                                                                                                                                   |
| Primary target/output | SSRS report output                                                                                                                                                                                             |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                      |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                   |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                               |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                               |
| Report name           | `RouteOneSSNVarianceRpt`                                                                                                                                                                                       |
| Created               | 2017-03-14 11:04:47                                                                                                                                                                                            |
| Modified              | 2017-05-15 14:53:00                                                                                                                                                                                            |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                               |

## Business Use

Use this for RouteOne finance or compliance review where deal detail, red-flag, SSN variance, or summary activity may require follow-up. The report is filtered by From SubmissionDate :, To SubmissionDate :.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RouteOne/RouteOneSSNVarianceRpt`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource     | Shared datasource                              | Connection                   | Credential mode | Enabled |
| --------------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `Sonic_DW_DataSource` | `/RouteOne/Data Sources/COR-BISQL-02_Sonic_DW` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter                 | Prompt                | Type     | Notes                                                |
| ------------------------- | --------------------- | -------- | ---------------------------------------------------- |
| `paramFromSubmissionDate` | From SubmissionDate : | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `paramToSubmissionDate`   | To SubmissionDate :   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `SSNVarianceSummary_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### SSNVarianceSummary_DS

Type: `Text`

```sql
NULL
```
