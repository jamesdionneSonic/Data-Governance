# QuartileOpportunityReport

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/CRM/QuartileOpportunityReport`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the CRM reporting area. It retrieves data through embedded report dataset queries and presents the result as the QuartileOpportunityReport report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                     |
| Asset type            | Report                                                                                                                                                                                                                                   |
| Native path           | `/CRM/QuartileOpportunityReport`                                                                                                                                                                                                         |
| Support role          | User-facing report                                                                                                                                                                                                                       |
| Business process      | Use this report for CRM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Dealership, Select View Type, Select Year, Select Month. |
| Primary source        | /CRM/Data Sources/Sonic_DW                                                                                                                                                                                                               |
| Primary target/output | SSRS report output                                                                                                                                                                                                                       |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                |
| Runtime/usage signal  | 29 executions by 3 users; last used 2026-06-05 14:15:39                                                                                                                                                                                  |
| Status signal         | Active                                                                                                                                                                                                                                   |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                         |
| Report name           | `QuartileOpportunityReport`                                                                                                                                                                                                              |
| Created               | 2020-11-02 16:08:14                                                                                                                                                                                                                      |
| Modified              | 2020-11-02 16:23:51                                                                                                                                                                                                                      |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                                                         |

## Business Use

Use this report for CRM business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Dealership, Select View Type, Select Year, Select Month.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/CRM/QuartileOpportunityReport`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `Sonic_DW`        | `/CRM/Data Sources/Sonic_DW` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter       | Prompt            | Type    | Notes                                                |
| --------------- | ----------------- | ------- | ---------------------------------------------------- |
| `Dealership_RP` | Select Dealership | String  | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `ViewType_RP`   | Select View Type  | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Year_RP`       | Select Year       | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `YYYYMM_RP`     | Select Month      | String  | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DafaultDates_DS` (Text): NULL
2. Dataset `Dealership_DS` (Text): NULL
3. Dataset `Month_DS` (Text): NULL
4. Dataset `QuartileReport_DS` (Text): NULL
5. Dataset `Year_DS` (Text): NULL

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DafaultDates_DS

Type: `Text`

```sql
NULL
```

#### Dealership_DS

Type: `Text`

```sql
NULL
```

#### Month_DS

Type: `Text`

```sql
NULL
```

#### QuartileReport_DS

Type: `Text`

```sql
NULL
```

#### Year_DS

Type: `Text`

```sql
NULL
```
