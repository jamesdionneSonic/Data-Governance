# R2 - Wholesale Details_Parameters

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/RTC/R2 - Wholesale Details_Parameters`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                |
| Asset type            | Report                                                                                                                                                                              |
| Native path           | `/RTC/R2 - Wholesale Details_Parameters`                                                                                                                                            |
| Support role          | Review candidate report                                                                                                                                                             |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Dealership. |
| Primary source        | /RTC/Data Sources/SIMS6200                                                                                                                                                          |
| Primary target/output | SSRS report output                                                                                                                                                                  |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                           |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                        |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                    |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                    |
| Report name           | `R2 - Wholesale Details_Parameters`                                                                                                                                                 |
| Created               | 2014-10-21 10:50:42                                                                                                                                                                 |
| Modified              | 2017-12-13 10:15:17                                                                                                                                                                 |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                  |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Dealership.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/RTC/R2 - Wholesale Details_Parameters`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource            | Connection                   | Credential mode | Enabled |
| ----------------- | ---------------------------- | ---------------------------- | --------------- | ------- |
| `SIMS6200`        | `/RTC/Data Sources/SIMS6200` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt     | Type   | Notes                                                |
| ------------ | ---------- | ------ | ---------------------------------------------------- |
| `Dealership` | Dealership | String | Nullable: NULL; Allow blank: true; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age FROM SIMS6200.dbo.Vehicle_Inventory AS vi --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200.dbo.VEHICLE AS v ON v.Vehicle_ID = vi.Vehicle_ID --JOIN FOR DEALERSHIP
2. Dataset `DataSet2` (Text): SELECT distinct o.Name AS 'Dealership' FROM SIMS6200.dbo.Organization as o --UPDATED 8.12.13
3. Dataset `DataSet3` (Text): SELECT o.Name as 'Dealership', COUNT(CASE WHEN vi.curr_status_id = 204 THEN vi.Curr_Status_ID END) AS 'OGT', COUNT(CASE WHEN vi.curr_status_id = 201 THEN vi.Curr_Status_ID END) AS 'PA', COUNT(CASE

## Backend Dependencies

| Object or command hint           | Notes                                     |
| -------------------------------- | ----------------------------------------- |
| `SIMS6200.dbo.Vehicle_Inventory` | Referenced by one or more report datasets |
| `FOR`                            | Referenced by one or more report datasets |
| `SIMS6200.dbo.VEHICLE`           | Referenced by one or more report datasets |
| `SIMS6200.dbo.Organization`      | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT o.Name AS 'Dealership', vi.Stock_No, v.VIN, v.Year, v.Make, v.Model, vi.Mileage, vi.Age  FROM SIMS6200.dbo.Vehicle_Inventory AS vi  --JOIN FOR VIN,YEAR,MAKE,MODEL JOIN SIMS6200.dbo.VEHICLE AS v  ON v.Vehicle_ID = vi.Vehicle_ID  --JOIN FOR DEALERSHIP
```

#### DataSet2

Type: `Text`

```sql
SELECT distinct o.Name AS 'Dealership'  FROM SIMS6200.dbo.Organization as o --UPDATED 8.12.13
```

#### DataSet3

Type: `Text`

```sql
SELECT       o.Name as 'Dealership',       COUNT(CASE       WHEN vi.curr_status_id = 204       THEN vi.Curr_Status_ID END) AS 'OGT',       COUNT(CASE       WHEN vi.curr_status_id = 201       THEN vi.Curr_Status_ID END) AS 'PA',       COUNT(CASE
```
