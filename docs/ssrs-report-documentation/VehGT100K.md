# VehGT100K

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - Financial Reporting/VehGT100K`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Platform              | SSRS                                                                                                                                                                                 |
| Asset type            | Report                                                                                                                                                                               |
| Native path           | `/BI - Financial Reporting/VehGT100K`                                                                                                                                                |
| Support role          | Review candidate report                                                                                                                                                              |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Report Date. |
| Primary source        | /BI - Financial Reporting/DataSource/COR_SQL_02_DMS_DWA                                                                                                                              |
| Primary target/output | SSRS report output                                                                                                                                                                   |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                                                    |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                         |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                     |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                     |
| Report name           | `VehGT100K`                                                                                                                                                                          |
| Created               | 2014-08-04 16:46:23                                                                                                                                                                  |
| Modified              | 2017-12-13 08:36:11                                                                                                                                                                  |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                   |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Report Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - Financial Reporting/VehGT100K`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                                         | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------------------------- | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Financial Reporting/DataSource/COR_SQL_02_DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt      | Type   | Notes                                                |
| ------------ | ----------- | ------ | ---------------------------------------------------- |
| `ReportDate` | Report Date | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT stocktype, AccountingName, Region, control, currentmonth, companyid, accountnumberright, accountnumber, Prefix, Balance, StockDate, DaysInStock, Year, Make, Model, dasha, vehBal, Status, vehPrice1, mileage, trimlevel, colo

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT     stocktype, AccountingName, Region, control, currentmonth, companyid, accountnumberright, accountnumber, Prefix, Balance, StockDate, DaysInStock, Year, Make,                        Model, dasha, vehBal, Status, vehPrice1, mileage, trimlevel, colo
```
