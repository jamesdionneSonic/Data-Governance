# R9 - Inventory_Level

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RTC/R9 - Inventory_Level`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                          |
| Asset type            | Report                                                                                                                                        |
| Native path           | `/RTC/R9 - Inventory_Level`                                                                                                                   |
| Support role          | Review candidate report                                                                                                                       |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. |
| Primary source        | /RTC/Data Sources/SIMS6200                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                            |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                     |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                  |
| Status signal         | Review candidate: no executions in last 6 months                                                                                              |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                              |
| Report name           | `R9 - Inventory_Level`                                                                                                                        |
| Created               | 2014-10-17 11:35:47                                                                                                                           |
| Modified              | 2017-12-13 10:15:30                                                                                                                           |
| Modified by           | SONIC\Mark.Starnes                                                                                                                            |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RTC/R9 - Inventory_Level`.
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

1. Dataset `DataSet1` (Text): SELECT DISTINCT o.Name 'Dealership', COUNT(CASE WHEN vi.curr_status_id IN (201,202,203,205) --PA,IGT,IS,PW THEN vi.Vehicle_ID END) 'Level' FROM [SIMS6200].[dbo].[Vehicle_Inventory] vi --JOIN FOR DEALERSHIPS inner join SIMS6200.dbo.Organization

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT DISTINCT o.Name 'Dealership',  COUNT(CASE    WHEN vi.curr_status_id IN (201,202,203,205) --PA,IGT,IS,PW    THEN vi.Vehicle_ID END) 'Level'    FROM  [SIMS6200].[dbo].[Vehicle_Inventory] vi  --JOIN FOR DEALERSHIPS inner join SIMS6200.dbo.Organization
```
