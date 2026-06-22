# New Inventory Pricing Issues

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                          |
| Asset type            | Report                                                                                                                                        |
| Native path           | `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues`                                                                                 |
| Support role          | User-facing report                                                                                                                            |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. |
| Primary source        | /ProfitAnalysis/Data Sources/WebVLive                                                                                                         |
| Primary target/output | SSRS report output                                                                                                                            |
| Schedule or trigger   | 1 subscription(s)                                                                                                                             |
| Runtime/usage signal  | 428 executions by 2 users; last used 2026-06-18 07:46:33                                                                                      |
| Status signal         | Active                                                                                                                                        |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                              |
| Report name           | `New Inventory Pricing Issues`                                                                                                                |
| Created               | 2014-11-05 10:15:35                                                                                                                           |
| Modified              | 2019-11-13 09:23:39                                                                                                                           |
| Modified by           | SONIC\Mark.Starnes                                                                                                                            |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                       | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------- | ---------------------------- | --------------- | ------- |
| `WebV`            | `/ProfitAnalysis/Data Sources/WebVLive` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): SELECT DISTINCT veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2, veh_inventory.acctg_cost_amt, veh_inventory.new

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT DISTINCT                           veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2,                           veh_inventory.acctg_cost_amt, veh_inventory.new
```
