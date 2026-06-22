# Sonic Quartile Report

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/Sonic Quartile Report`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - Retail Strategy reporting area. It retrieves data through embedded report dataset queries and presents the result as the Sonic Quartile Report report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                            |
| Asset type            | Report                                                                                                                                                                                                                                                                                                          |
| Native path           | `/BI - Retail Strategy/Sonic Quartile Report`                                                                                                                                                                                                                                                                   |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                         |
| Business process      | Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by end, start. It reads or calls pSonicQuartileReport, so support should validate those sources when results look wrong. |
| Primary source        | /BI - Retail Strategy/DataSource/eLeadDW_DWA                                                                                                                                                                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                              |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                       |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                    |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                |
| Report name           | `Sonic Quartile Report`                                                                                                                                                                                                                                                                                         |
| Created               | 2014-08-04 17:07:59                                                                                                                                                                                                                                                                                             |
| Modified              | 2015-01-05 11:43:58                                                                                                                                                                                                                                                                                             |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                                                                              |

## Business Use

Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by end, start. It reads or calls pSonicQuartileReport, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/Sonic Quartile Report`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                              | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------------- | ---------------------------- | --------------- | ------- |
| `eLeadDW`         | `/BI - Retail Strategy/DataSource/eLeadDW_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt | Type     | Notes                                                |
| --------- | ------ | -------- | ---------------------------------------------------- |
| `end`     | end    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `start`   | start  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): exec pSonicQuartileReport @start,@end

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `pSonicQuartileReport` | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
exec pSonicQuartileReport @start,@end
```
