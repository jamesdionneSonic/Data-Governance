# Logged Vs OverDue

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Retail Strategy/Logged Vs OverDue`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - Retail Strategy reporting area. It primarily retrieves data through stored procedure `pSonicLoggedvsOverDue_v3`. Review the procedure name and parameters when troubleshooting what business question the report answers. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                                                                                                                                |
| Asset type            | Report                                                                                                                                                                                                                                                                                                              |
| Native path           | `/BI - Retail Strategy/Logged Vs OverDue`                                                                                                                                                                                                                                                                           |
| Support role          | Review candidate report                                                                                                                                                                                                                                                                                             |
| Business process      | Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by End, Start. It reads or calls pSonicLoggedvsOverDue_v3, so support should validate those sources when results look wrong. |
| Primary source        | /BI - Retail Strategy/DataSource/eLeadDW_DWA                                                                                                                                                                                                                                                                        |
| Primary target/output | SSRS report output                                                                                                                                                                                                                                                                                                  |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                                                                                                                                                                                   |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                                                                                                                                        |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                                                                                                                                    |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                                                                                                                                    |
| Report name           | `Logged Vs OverDue`                                                                                                                                                                                                                                                                                                 |
| Created               | 2014-08-08 09:05:26                                                                                                                                                                                                                                                                                                 |
| Modified              | 2014-08-08 09:05:26                                                                                                                                                                                                                                                                                                 |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                                                                                                                                  |

## Business Use

Use this report for BI - Retail Strategy business review when users need report output for operational follow-up, reconciliation, audit, or performance review. The report is filtered by End, Start. It reads or calls pSonicLoggedvsOverDue_v3, so support should validate those sources when results look wrong.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Retail Strategy/Logged Vs OverDue`.
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
| `End`     | End    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `Start`   | Start  | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (StoredProcedure): Calls stored procedure `pSonicLoggedvsOverDue_v3`.

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `pSonicLoggedvsOverDue_v3` | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `StoredProcedure`

```sql
pSonicLoggedvsOverDue_v3
```
