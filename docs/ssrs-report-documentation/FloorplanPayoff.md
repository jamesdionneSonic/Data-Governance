# FloorplanPayoff

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Shared Services/FloorplanPayoff`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports floorplan payoff or floorplan reconciliation work by showing vehicle, lender, or payoff information needed by Shared Services and accounting users. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                   |
| Asset type            | Report                                                                                                                                                 |
| Native path           | `/BI - Shared Services/FloorplanPayoff`                                                                                                                |
| Support role          | Review candidate report                                                                                                                                |
| Business process      | Use this when Shared Services or Accounting needs to review floorplan payoff activity, validate payoff records, or investigate synchronization issues. |
| Primary source        | /BI - Shared Services/DataSource/DMS_DWA                                                                                                               |
| Primary target/output | SSRS report output                                                                                                                                     |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                      |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                           |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                       |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                       |
| Report name           | `FloorplanPayoff`                                                                                                                                      |
| Created               | 2016-04-22 16:25:18                                                                                                                                    |
| Modified              | 2019-01-02 10:27:52                                                                                                                                    |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                     |

## Business Use

Use this when Shared Services or Accounting needs to review floorplan payoff activity, validate payoff records, or investigate synchronization issues.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Shared Services/FloorplanPayoff`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                          | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - Shared Services/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `FloorplanPayoff` (Text): -------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------Shared Services Floorplan Payoff Report (based on CFPA report in C

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### FloorplanPayoff

Type: `Text`

```sql
-------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------Shared Services Floorplan Payoff Report (based on CFPA report in C
```
