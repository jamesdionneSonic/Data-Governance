# New Inventory - Playbook - SingleStore

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - New Vehicles/New Inventory - Playbook - SingleStore`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                     |
| Asset type            | Report                                                                                                                                                                                   |
| Native path           | `/BI - New Vehicles/New Inventory - Playbook - SingleStore`                                                                                                                              |
| Support role          | User-facing report                                                                                                                                                                       |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Regions, Stores. |
| Primary source        | /BI - New Vehicles/DataSource/L1-DWASQL-02_BIWDB                                                                                                                                         |
| Primary target/output | SSRS report output                                                                                                                                                                       |
| Schedule or trigger   | 12 subscription(s)                                                                                                                                                                       |
| Runtime/usage signal  | 1330 executions by 1 users; last used 2026-06-18 10:05:29                                                                                                                                |
| Status signal         | Active, high usage                                                                                                                                                                       |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                         |
| Report name           | `New Inventory - Playbook - SingleStore`                                                                                                                                                 |
| Created               | 2016-03-28 11:28:52                                                                                                                                                                      |
| Modified              | 2025-02-04 20:22:32                                                                                                                                                                      |
| Modified by           | Jonathan.Henin                                                                                                                                                                           |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Regions, Stores.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - New Vehicles/New Inventory - Playbook - SingleStore`.
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

- No immediate review flag based on recent execution history.

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
