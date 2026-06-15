# VehGT100K_old

Generated: 2026-06-15  
SSRS path: `/BI - Financial Reporting/VehGT100K_old`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `VehGT100K_old`                                  |
| SSRS path           | `/BI - Financial Reporting/VehGT100K_old`        |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2017-12-13 08:36:14                              |
| Modified            | 2017-12-13 08:36:14                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                                      | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------------------------ | ---------------------------- | --------------- | ------- |
| `DataSource1`     | `/BI - Financial Reporting/DataSource/COR_SQL_02_WebV` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `DataSet1` (Text): USE WebV SELECT distinct locations.location_name, veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2, veh_inventory.acctg_cost_amt, NewUsed = case veh_inventory.new_veh_flg when 1 then 'New' when 0 then 'Used' else null end, veh_in...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `veh_inventory`        | Referenced by one or more report datasets |
| `locations`            | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - Financial Reporting/VehGT100K_old`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
USE WebV SELECT     distinct locations.location_name, veh_inventory.vin2, veh_inventory.stock_dt, veh_inventory.stk_nbr, veh_inventory.mod_yr2, veh_inventory.make_desc2, veh_inventory.mod_desc2,                        veh_inventory.acctg_cost_amt,                                               NewUsed = case veh_inventory.new_veh_flg                        when  1 then 'New'                       when  0 then 'Used'                       else null                       end,                                              veh_inventory.ctgy_cd2, veh_inventory.elt_inv_co, veh_inventory.loc_id, veh_inventory.elt_inv_acct                        FROM         veh_inventory LEFT OUTER JOIN                       locations ON veh_inventory.loc_id = locations.location_id  WHERE (veh_inventory.inv_stat_cd = 'INS') -- in stock AND veh_inventory.acctg_cost_amt > 100000  and locations.del_flag <> 1 and elt_inv_co not in ('455','111','170','421','151','157') --lou ehlers, gwinnett volvo, northpoint, poway toyota, tom williams cadillac  order by elt_inv_co
```
