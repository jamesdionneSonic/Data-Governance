# New Inventory Pricing Issues

Generated: 2026-06-15  
SSRS path: `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Report name         | `New Inventory Pricing Issues`                                |
| SSRS path           | `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues` |
| Status signal       | Active                                                        |
| Created             | 2014-11-05 10:15:35                                           |
| Modified            | 2019-11-13 09:23:39                                           |
| Modified by         | SONIC\Mark.Starnes                                            |
| Last 6 months usage | 427 executions by 3 users                                     |
| Last execution      | 2026-06-15 07:46:33                                           |
| Subscriptions       | 1                                                             |

## Shared Data Sources

| Report datasource | Shared datasource                       | Connection                   | Credential mode | Enabled |
| ----------------- | --------------------------------------- | ---------------------------- | --------------- | ------- |
| `WebV`            | `/ProfitAnalysis/Data Sources/WebVLive` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): SELECT DISTINCT veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2, veh_inventory.acctg_cost_amt, veh_inventory.new_veh_flg, veh_inventory.ctgy_cd2, veh_inventory.elt_inv_co, veh_inventory.loc_id, veh_inventory.elt_inv_acct, LOCATI...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `veh_inventory`        | Referenced by one or more report datasets |
| `LOCATIONS`            | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/ProfitAnalysis/ReportsLibrary/New Inventory Pricing Issues`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
SELECT DISTINCT                           veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2,                           veh_inventory.acctg_cost_amt, veh_inventory.new_veh_flg, veh_inventory.ctgy_cd2, veh_inventory.elt_inv_co, veh_inventory.loc_id, veh_inventory.elt_inv_acct,                           LOCATIONS.LOCATION_NAME, veh_inventory.days_in_stock, veh_inventory.dflt_slng_price_amt, veh_inventory.tot_list_amt FROM            veh_inventory LEFT OUTER JOIN                          LOCATIONS ON veh_inventory.loc_id = LOCATIONS.LOCATION_ID WHERE        (veh_inventory.inv_stat_cd = 'INS') AND (veh_inventory.del_flg = 0) AND (veh_inventory.acctg_cost_amt > 1000) AND (LOCATIONS.DEL_FLAG <> 1) AND                           (veh_inventory.elt_inv_co NOT IN ('455', '111', '170', '421', '151', '157', '308')) AND (veh_inventory.stock_dt IS NOT NULL) AND (veh_inventory.mod_yr2 >= '2007') AND                           (RIGHT(veh_inventory.elt_inv_acct, 4) NOT IN ('2600', '2605', '2750', '2610')) AND (LEFT(veh_inventory.stk_nbr, 1) NOT IN ('T', 'P', 'S')) AND                           (veh_inventory.new_veh_flg = 1) AND (veh_inventory.dflt_slng_price_amt > veh_inventory.acctg_cost_amt * 1.8) UNION SELECT DISTINCT                           veh_inventory_2.vin2, veh_inventory_2.stock_dt, veh_inventory_2.stk_nbr, veh_inventory_2.mod_yr2, veh_inventory_2.make_desc2, veh_inventory_2.mod_desc2,                           veh_inventory_2.acctg_cost_amt, veh_inventory_2.new_veh_flg, veh_inventory_2.ctgy_cd2, veh_inventory_2.elt_inv_co, veh_inventory_2.loc_id,                           veh_inventory_2.elt_inv_acct, LOCATIONS_2.LOCATION_NAME, veh_inventory_2.days_in_stock, veh_inventory_2.dflt_slng_price_amt,                           veh_inventory_2.tot_list_amt FROM            veh_inventory AS veh_inventory_2 LEFT OUTER JOIN                          LOCATIONS AS LOCATIONS_2 ON veh_inventory_2.loc_id = LOCATIONS_2.LOCATION_ID WHERE        (veh_inventory_2.inv_stat_cd = 'INS') AND (veh_inventory_2.del_flg = 0) AND (veh_inventory_2.acctg_cost_amt > 1000) AND (LOCATIONS_2.DEL_FLAG <> 1) AND                           (veh_inventory_2.elt_inv_co NOT IN ('455', '111', '170', '421', '151', '157', '308')) AND (veh_inventory_2.stock_dt IS NOT NULL) AND (veh_inventory_2.mod_yr2 >= '2007')                           AND (RIGHT(veh_inventory_2.elt_inv_acct, 4) NOT IN ('2600', '2605', '2750', '2610')) AND (LEFT(veh_inventory_2.stk_nbr, 1) NOT IN ('T', 'P', 'S')) AND                           (veh_inventory_2.new_veh_flg = 1) AND (veh_inventory_2.dflt_slng_price_amt < 5000) AND (veh_inventory_2.dflt_slng_price_amt > 0) UNION SELECT DISTINCT                           veh_inventory_1.vin2, veh_inventory_1.stock_dt, veh_inventory_1.stk_nbr, veh_inventory_1.mod_yr2, veh_inventory_1.make_desc2, veh_inventory_1.mod_desc2,                           veh_inventory_1.acctg_cost_amt, veh_inventory_1.new_veh_flg, veh_inventory_1.ctgy_cd2, veh_inventory_1.elt_inv_co, veh_inventory_1.loc_id,                           veh_inventory_1.elt_inv_acct, LOCATIONS_1.LOCATION_NAME, veh_inventory_1.days_in_stock, veh_inventory_1.dflt_slng_price_amt,                           veh_inventory_1.tot_list_amt FROM            veh_inventory AS veh_inventory_1 LEFT OUTER JOIN                          LOCATIONS AS LOCATIONS_1 ON veh_inventory_1.loc_id = LOCATIONS_1.LOCATION_ID WHERE        (veh_inventory_1.inv_stat_cd = 'INS') AND (veh_inventory_1.del_flg = 0) AND (veh_inventory_1.acctg_cost_amt > 1000) AND (LOCATIONS_1.DEL_FLAG <> 1) AND                           (veh_inventory_1.elt_inv_co NOT IN ('455', '111', '170', '421', '151', '157', '308', '469', '418')) AND (veh_inventory_1.stock_dt IS NOT NULL) AND                           (veh_inventory_1.mod_yr2 >= '2007') AND (RIGHT(veh_inventory_1.elt_inv_acct, 4) NOT IN ('2600', '2605', '2750', '2610')) AND (LEFT(veh_inventory_1.stk_nbr, 1)                           NOT IN ('T', 'P', 'S')) AND (veh_inventory_1.new_veh_flg = 1) AND (veh_inventory_1.tot_list_amt < 7000) AND (veh_inventory_1.dflt_slng_price_amt > 0) ORDER BY veh_inventory.stock_dt
```
