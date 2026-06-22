# HelpCustomerSales-ServiceReport

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Echo Park/CSI/HelpCustomerSales-ServiceReport`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the Echo Park / CSI reporting area. It retrieves data through embedded report dataset queries and presents the result as the HelpCustomerSales-ServiceReport report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                       |
| Asset type            | Report                                                                                                                                                     |
| Native path           | `/Echo Park/CSI/HelpCustomerSales-ServiceReport`                                                                                                           |
| Support role          | Review candidate report                                                                                                                                    |
| Business process      | Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review. |
| Primary source        | NULL                                                                                                                                                       |
| Primary target/output | SSRS report output                                                                                                                                         |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                  |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                               |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                           |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                           |
| Report name           | `HelpCustomerSales-ServiceReport`                                                                                                                          |
| Created               | 2015-07-17 15:08:43                                                                                                                                        |
| Modified              | 2015-07-17 15:08:43                                                                                                                                        |
| Modified by           | bedanta.bordoloi                                                                                                                                           |

## Business Use

Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Echo Park/CSI/HelpCustomerSales-ServiceReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `NULL`            | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

No datasets were found in the RDL definition.

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

No dataset command text was available.
