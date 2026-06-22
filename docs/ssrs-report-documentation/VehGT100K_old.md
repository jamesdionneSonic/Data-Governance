# VehGT100K_old

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Financial Reporting/VehGT100K_old`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                          |
| Asset type            | Report                                                                                                                                        |
| Native path           | `/BI - Financial Reporting/VehGT100K_old`                                                                                                     |
| Support role          | Review candidate report                                                                                                                       |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. |
| Primary source        | /BI - Financial Reporting/DataSource/COR_SQL_02_WebV                                                                                          |
| Primary target/output | SSRS report output                                                                                                                            |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                     |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                  |
| Status signal         | Review candidate: no executions in last 6 months                                                                                              |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                              |
| Report name           | `VehGT100K_old`                                                                                                                               |
| Created               | 2017-12-13 08:36:14                                                                                                                           |
| Modified              | 2017-12-13 08:36:14                                                                                                                           |
| Modified by           | SONIC\Mark.Starnes                                                                                                                            |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Financial Reporting/VehGT100K_old`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                                      | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Financial Reporting/DataSource/COR_SQL_02_WebV` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): USE WebV SELECT distinct locations.location_name, veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2, veh_inventory.acctg_cost_amt,

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
USE WebV SELECT     distinct locations.location_name, veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2,                        veh_inventory.acctg_cost_amt,
```
