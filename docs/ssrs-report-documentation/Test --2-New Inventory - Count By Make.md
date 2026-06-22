# Test --2-New Inventory - Count By Make

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/Test/Test --2-New Inventory - Count By Make`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                     |
| Asset type            | Report                                                                                                                                                                                   |
| Native path           | `/Test/Test --2-New Inventory - Count By Make`                                                                                                                                           |
| Support role          | Review candidate report                                                                                                                                                                  |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Regions, Stores. |
| Primary source        | /BI - New Vehicles/DataSource/L1-DWASQL-02_BIWDB                                                                                                                                         |
| Primary target/output | SSRS report output                                                                                                                                                                       |
| Schedule or trigger   | No subscriptions surfaced                                                                                                                                                                |
| Runtime/usage signal  | 0 executions by 0 users; last used Not used in last 6 months                                                                                                                             |
| Status signal         | Test or non-production review                                                                                                                                                            |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                         |
| Report name           | `Test --2-New Inventory - Count By Make`                                                                                                                                                 |
| Created               | 2024-06-27 08:42:02                                                                                                                                                                      |
| Modified              | 2024-06-27 08:49:06                                                                                                                                                                      |
| Modified by           | SONIC\Vijayalakshmi.Krishn                                                                                                                                                               |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Regions, Stores.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/Test/Test --2-New Inventory - Count By Make`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                                  | Connection                   | Credential mode | Enabled |
| ----------------- | -------------------------------------------------- | ---------------------------- | --------------- | ------- |
| `BI_WorkDB`       | `/BI - New Vehicles/DataSource/L1-DWASQL-02_BIWDB` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter | Prompt  | Type   | Notes                                                |
| --------- | ------- | ------ | ---------------------------------------------------- |
| `Regions` | Regions | String | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `Stores`  | Stores  | String | Nullable: NULL; Allow blank: NULL; Multi-value: true |

## Data Logic

1. Dataset `DistList` (Text): SELECT r.EMailAddress, r.Role, r.RVPEmailAddress, r.RCtrlEmailAddress, nid.WebVID, nid.Region, nid.Store, nid.ADPID, 'New Inventory - ' + ' ' + nid.store as Subject FROM tblRecipients r INNER JOIN v
2. Dataset `NewInventory` (Text): with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control ) , companyid
3. Dataset `Regions` (Text): SELECT DISTINCT Region FROM vw_ADP_CoID_WebV_Link
4. Dataset `StoresAvailable` (Text): SELECT DISTINCT AccountingName, WebV_ID FROM vw_ADP_CoID_WebV_Link_wv WHERE (Region IN (@Regions)) ORDER BY AccountingName

## Backend Dependencies

| Object or command hint     | Notes                                     |
| -------------------------- | ----------------------------------------- |
| `tblRecipients`            | Referenced by one or more report datasets |
| `v`                        | Referenced by one or more report datasets |
| `dms.dbo.glschedule`       | Referenced by one or more report datasets |
| `vw_ADP_CoID_WebV_Link`    | Referenced by one or more report datasets |
| `vw_ADP_CoID_WebV_Link_wv` | Referenced by one or more report datasets |

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

- This report appears to be test or non-production based on its path or name.

## Technical Appendix

### Dataset Commands

#### DistList

Type: `Text`

```sql
SELECT     r.EMailAddress, r.Role, r.RVPEmailAddress,                        r.RCtrlEmailAddress, nid.WebVID, nid.Region,                        nid.Store, nid.ADPID, 'New Inventory - ' + ' ' + nid.store as Subject FROM         tblRecipients r INNER JOIN v
```

#### NewInventory

Type: `Text`

```sql
with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control )  , companyid
```

#### Regions

Type: `Text`

```sql
SELECT DISTINCT Region FROM         vw_ADP_CoID_WebV_Link
```

#### StoresAvailable

Type: `Text`

```sql
SELECT DISTINCT AccountingName, WebV_ID FROM            vw_ADP_CoID_WebV_Link_wv WHERE        (Region IN (@Regions)) ORDER BY AccountingName
```
