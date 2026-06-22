# New Playbook - Pre Visit

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - New Vehicles/Archive/New Playbook - Pre Visit`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports the BI - New Vehicles / Archive reporting area. It retrieves data through embedded report dataset queries and presents the result as the New Playbook - Pre Visit report. Use the dataset commands and parameters below to confirm the exact business question before changing it. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                |
| Asset type            | Report                                                                                                                                                                                              |
| Native path           | `/BI - New Vehicles/Archive/New Playbook - Pre Visit`                                                                                                                                               |
| Support role          | Review candidate report                                                                                                                                                                             |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Please select a dealership. |
| Primary source        | /BI - New Vehicles/DataSource/L1-DWASQL-02_BIWDB                                                                                                                                                    |
| Primary target/output | SSRS report output                                                                                                                                                                                  |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                           |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                                        |
| Status signal         | Review candidate: no executions in last 6 months                                                                                                                                                    |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                    |
| Report name           | `New Playbook - Pre Visit`                                                                                                                                                                          |
| Created               | 2014-08-01 14:49:26                                                                                                                                                                                 |
| Modified              | 2025-12-20 11:01:24                                                                                                                                                                                 |
| Modified by           | Jonathan.Henin                                                                                                                                                                                      |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Please select a dealership.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - New Vehicles/Archive/New Playbook - Pre Visit`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                                  | Connection                   | Credential mode | Enabled |
| ----------------- | -------------------------------------------------- | ---------------------------- | --------------- | ------- |
| `BI_Workdb`       | `/BI - New Vehicles/DataSource/L1-DWASQL-02_BIWDB` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt                     | Type   | Notes                                                |
| ------------ | -------------------------- | ------ | ---------------------------------------------------- |
| `Dealership` | Please select a dealership | String | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `Dealerships` (Text): select \* from vw_ADP_CoID_WebV_Link_wv order by accountingname
2. Dataset `New_Inventory` (Text): with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control ) , companyid

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `vw_ADP_CoID_WebV_Link_wv` | Referenced by one or more report datasets |
| `dms.dbo.glschedule`       | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

- This report is under an archive path and may be historical.

## Technical Appendix

### Dataset Commands

#### Dealerships

Type: `Text`

```sql
select * from vw_ADP_CoID_WebV_Link_wv order by accountingname
```

#### New_Inventory

Type: `Text`

```sql
with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control )  , companyid
```
