# New Playbook - Pre Visit

Generated: 2026-06-15  
SSRS path: `/BI - New Vehicles/Archive/New Playbook - Pre Visit`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                                 |
| ------------------- | ----------------------------------------------------- |
| Report name         | `New Playbook - Pre Visit`                            |
| SSRS path           | `/BI - New Vehicles/Archive/New Playbook - Pre Visit` |
| Status signal       | Review candidate: no executions in last 6 months      |
| Created             | 2014-08-01 14:49:26                                   |
| Modified            | 2025-12-20 11:01:24                                   |
| Modified by         | Jonathan.Henin                                        |
| Last 6 months usage | 0 executions by 0 users                               |
| Last execution      | NULL                                                  |
| Subscriptions       | 0                                                     |

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
2. Dataset `New_Inventory` (Text): with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control ) , companyidLkp as (SELECT distinct [CompanyID] ,[WebV_ID] FROM [BI_WorkDB].[...

## Backend Dependencies

| Object or command hint                           | Notes                                     |
| ------------------------------------------------ | ----------------------------------------- |
| `vw_ADP_CoID_WebV_Link_wv`                       | Referenced by one or more report datasets |
| `dms.dbo.glschedule`                             | Referenced by one or more report datasets |
| `BI_WorkDB.dbo.vw_ADP_CoID_WebV_Link`            | Referenced by one or more report datasets |
| `206.22.183.247.SonicWebV_veh.dbo.veh_inventory` | Referenced by one or more report datasets |
| `companyidLkp`                                   | Referenced by one or more report datasets |
| `EntryDate`                                      | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - New Vehicles/Archive/New Playbook - Pre Visit`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

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
with EntryDate as (select companyid,control,min(dateofoldestscheditem) DOOSI from dms.dbo.glschedule where currentmonth > DATEADD(dd,-75,getdate()) and right(accountnumber,4) in ('2320','2300','2340','2341','2342') group by companyid,control )  , companyidLkp as  (SELECT distinct   [CompanyID]   ,[WebV_ID]   FROM [BI_WorkDB].[dbo].[vw_ADP_CoID_WebV_Link])    SELECT     d.AccountingName, d.Region, vi.stk_nbr, vi.mod_yr2, vi.make_desc2, vi.mod_desc2, vi.extr_color_desc2, vi.intr_color_desc2, vi.cur_odo_rd_nbr,                        vi.srs_desc2, DATEDIFF(d, e.DOOSI, GETDATE()) AS DaysInStock, vi.dflt_slng_price_amt, vi.tot_list_amt,                        vi.dflt_slng_price_amt - vi.acctg_cost_amt AS Margin, vi.tot_cost_amt AS [Invoice Price]  , CASE WHEN datediff(d, e.DOOSI, getdate()) > 365 THEN '366+ Days'  WHEN datediff(d, e.DOOSI, getdate()) > 250 THEN '251-365 Days'  WHEN datediff(d, e.DOOSI, getdate()) > 180 THEN '181-250 Days'  WHEN datediff(d, e.DOOSI, getdate()) > 120 THEN '121-180 Days'  WHEN datediff(d, e.DOOSI, getdate()) > 60 THEN '61-120 Days'  ELSE '0-60 Days' END AS AgingBucket,  CASE  WHEN datediff(d, e.DOOSI, getdate()) > 365 THEN 1  WHEN datediff(d, e.DOOSI, getdate()) > 250 THEN 2  WHEN datediff(d, e.DOOSI, getdate()) > 180 THEN 3  WHEN datediff(d, e.DOOSI, getdate()) > 120 THEN 4  WHEN datediff(d, e.DOOSI, getdate()) >  60 THEN 5 ELSE 6 END AS AgingBucketSrt,   vi.elt_inv_acct FROM         [206.22.183.247].SonicWebV_veh.dbo.veh_inventory AS vi (nolock) INNER JOIN                       vw_ADP_CoID_WebV_Link_wv AS d ON d.WebV_ID = vi.loc_id  inner join companyidLkp c on c.webv_id =d.webv_id                        inner join EntryDate e on vi.stk_nbr = e.control and e.companyid = c.companyid  WHERE     (vi.inv_stat_cd = 'INS') AND (vi.del_flg = 0) AND (vi.new_veh_flg = 1) AND (acctg_cost_amt > 1000) AND (RIGHT(vi.elt_inv_acct, 4) NOT IN ('2600',                        '2605'))                                               AND (d.AccountingName IN (@Dealership))  and ((d.AccountingName='Tom Williams Porsche/Audi' and left(vi.elt_inv_acct,1) in ('2','3')) or   (d.AccountingName='Tom Williams BMW/MINI' and left(vi.elt_inv_acct,1) in ('1','5')) or d.AccountingName not in ('Tom Williams Porsche/Audi','Tom Williams BMW/MINI','Porsche Audi West Houston'))   and not   (d.AccountingName='Global Imports' and make_desc2 ='MINI')  and not   (d.AccountingName='Global MINI' and make_desc2 = 'BMW')   ORDER BY vi.make_desc2, stk_nbr, vin2, d.AccountingName, last_chng_dttm DESC
```
