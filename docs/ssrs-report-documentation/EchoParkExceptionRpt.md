# EchoParkExceptionRpt

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Echo Park/CSI/EchoParkExceptionRpt`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the Echo Park / CSI reporting area. It retrieves data through embedded report dataset queries and presents the result as the EchoParkExceptionRpt report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                                                                                  |
| Asset type            | Report                                                                                                                                                                                                                                                                                                                                                                                |
| Native path           | `/Echo Park/CSI/EchoParkExceptionRpt`                                                                                                                                                                                                                                                                                                                                                 |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                                                                                               |
| Business process      | Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Exception, IsAssociate, Select Month, Select Report Type, Select Service Advisor. It reads or calls EchoParkCSIService, so support should validate those sources when results look wrong. |
| Primary source        | /Echo Park/Data Sources/COR-SQL-02.DMS                                                                                                                                                                                                                                                                                                                                                |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                                                                                    |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                                                                                                                                                                                                             |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                                                                                          |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                                                                                      |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                                                                                      |
| Report name           | `EchoParkExceptionRpt`                                                                                                                                                                                                                                                                                                                                                                |
| Created               | 2015-05-12 16:38:55                                                                                                                                                                                                                                                                                                                                                                   |
| Modified              | 2015-05-13 10:33:04                                                                                                                                                                                                                                                                                                                                                                   |
| Modified by           | bedanta.bordoloi                                                                                                                                                                                                                                                                                                                                                                      |

## Business Use

Use this report for Echo Park / CSI business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by Select Exception, IsAssociate, Select Month, Select Report Type, Select Service Advisor. It reads or calls EchoParkCSIService, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Echo Park/CSI/EchoParkExceptionRpt`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                        | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS_DataSource`  | `/Echo Park/Data Sources/COR-SQL-02.DMS` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter           | Prompt                 | Type    | Notes                                                |
| ------------------- | ---------------------- | ------- | ---------------------------------------------------- |
| `Exceptions_RP`     | Select Exception       | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `IsAssociate`       | IsAssociate            | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Month_RP`          | Select Month           | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `ReportType`        | Select Report Type     | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `ServiceAdvisor_RP` | Select Service Advisor | String  | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Year_RP`           | Select Year            | Integer | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `Exceptions_DataSet` (Text): NULL
2. Dataset `IsAssociate_DataSet` (Text): NULL
3. Dataset `MonthFilter_DataSet` (Text): NULL
4. Dataset `Report_DataSet` (Text): NULL
5. Dataset `ServiceAdvisorFilter_DataSet` (Text): NULL
6. Dataset `Year_DataSet` (Text): SELECT DISTINCT YEAR(closedate) CloseDateYYYY FROM EchoParkCSIService WHERE identified IN (@ReportType) ORDER BY CloseDateYYYY DESC

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `EchoParkCSIService`   | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### Exceptions_DataSet

Type: `Text`

```sql
NULL
```

#### IsAssociate_DataSet

Type: `Text`

```sql
NULL
```

#### MonthFilter_DataSet

Type: `Text`

```sql
NULL
```

#### Report_DataSet

Type: `Text`

```sql
NULL
```

#### ServiceAdvisorFilter_DataSet

Type: `Text`

```sql
NULL
```

#### Year_DataSet

Type: `Text`

```sql
SELECT DISTINCT YEAR(closedate) CloseDateYYYY FROM EchoParkCSIService WHERE identified IN (@ReportType) ORDER BY CloseDateYYYY DESC
```
