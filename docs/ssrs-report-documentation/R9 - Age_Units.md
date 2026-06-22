# R9 - Age_Units

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RTC/R9 - Age_Units`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                          |
| Asset type            | Report                                                                                                                                        |
| Native path           | `/RTC/R9 - Age_Units`                                                                                                                         |
| Support role          | Review candidate report                                                                                                                       |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. |
| Primary source        | /RTC/Data Sources/SIMS6200                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                            |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                     |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                  |
| Status signal         | Review candidate: no executions in last 6 months                                                                                              |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                              |
| Report name           | `R9 - Age_Units`                                                                                                                              |
| Created               | 2014-10-17 11:35:47                                                                                                                           |
| Modified              | 2017-12-13 10:15:30                                                                                                                           |
| Modified by           | SONIC\Mark.Starnes                                                                                                                            |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RTC/R9 - Age_Units`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): /**\*\*** Script for Aged Inventory Mark Downs**\***/ DECLARE @day VARCHAR(15) = DATENAME(dw,GETDATE()) IF @day = 'Friday' WITH bList AS ( SELECT vi.Store_ID, oa.Parent_Org_ID, o.Name 'Dealership', s.Status_Abbv 'Status', vi.stock_no,

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
/****** Script for Aged Inventory Mark Downs*****/  DECLARE @day VARCHAR(15) = DATENAME(dw,GETDATE())  IF @day = 'Friday'    WITH bList AS ( SELECT vi.Store_ID,     oa.Parent_Org_ID,     o.Name 'Dealership',     s.Status_Abbv 'Status',     vi.stock_no,
```
