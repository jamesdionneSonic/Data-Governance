# NVPDashboardLandingPage

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/NVIM/NVPDashboardLandingPage`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the NVIM reporting area. It retrieves data through embedded report dataset queries and presents the result as the NVPDashboardLandingPage report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                                                   |
| Asset type            | Report                                                                                                                                                                                                 |
| Native path           | `/NVIM/NVPDashboardLandingPage`                                                                                                                                                                        |
| Support role          | Review candidate report                                                                                                                                                                                |
| Business process      | Use this report for NVIM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Period, Select Store. |
| Primary source        | NULL                                                                                                                                                                                                   |
| Primary target/output | SSRS report output                                                                                                                                                                                     |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                              |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                           |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                       |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                       |
| Report name           | `NVPDashboardLandingPage`                                                                                                                                                                              |
| Created               | 2015-10-16 13:09:35                                                                                                                                                                                    |
| Modified              | 2015-10-16 13:09:35                                                                                                                                                                                    |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                       |

## Business Use

Use this report for NVIM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Period, Select Store.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/NVIM/NVPDashboardLandingPage`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource | Connection                   | Credential mode | Enabled |
| ----------------- | ----------------- | ---------------------------- | --------------- | ------- |
| `NULL`            | `NULL`            | `Not available from catalog` |                 |         |

## User Parameters

| Parameter     | Prompt        | Type     | Notes                                                |
| ------------- | ------------- | -------- | ---------------------------------------------------- |
| `PostDate_RP` | Select Period | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Store_ID_RP` | Select Store  | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DefaultValues_DS` (Text): NULL
2. Dataset `NVP_Override_DS` (Text): NULL
3. Dataset `Store_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DefaultValues_DS

Type: `Text`

```sql
NULL
```

#### NVP_Override_DS

Type: `Text`

```sql
NULL
```

#### Store_DS

Type: `Text`

```sql
NULL
```
