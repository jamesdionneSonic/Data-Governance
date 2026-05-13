---
name: In_Transit_Recon_TransportTab
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 7
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.dim_business_model_type** (V )
- **darpts.Transport_Purchases** (V )
- **darpts.vin_business_model** (V )
- **darpts.vw_EP_Inventory** (V )
- **darpts.vw_EP_Sales** (V )
- **darpts.vw_Transport_Log_Combined** (V )
- **dbo.Dim_Entity** (U )

## Definition

```sql

create view darpts.In_Transit_Recon_TransportTab as
with vbm as (SELECT v1.vin,v1.business_model_type_id,v1.purchase_date
                FROM darpts.vin_business_model v1 WITH (NOLOCK) JOIN (SELECT vin, max(purchase_date)purchase_date FROM darpts.vin_business_model WITH (NOLOCK)
                where purchase_date> DATEADD(m,-6,GETDATE()) GROUP BY vin)v2 on  v1.vin=v2.vin and v1.purchase_date=v2.purchase_date)
                Select [Vendor],t.[VIN],t.[Status],load_log_at,[origin_name],[origin_line_1],[origin_line_2],[origin_city]
                    ,[origin_state],[origin_zip],[destination_name],[destination_line_1],'' as dest_line2,[destination_city],[destination_state]
                   ,'' as dest_zip,t.[year],t.[make],t.[model],t.Vehicle_Class,CAST(t.[pickup_date] as datetime) as [pickup_date]
                   ,CASE When Vendor='Metro' and t.Status in ('on hold','active') then null else CAST(t.[eta_date] as datetime) end as [eta_date],
                    Metro_Age , SIMS_Age, [Check], [Price_Paid], bm.business_model_type_nm,i.status_name
                FROM darpts.vw_Transport_Log_Combined t
                LEFT JOIN (Select Distinct VIN FROM darpts.Transport_Purchases) d on t.vin=d.vin
                LEFT JOIN (Select Distinct entsimsstoreid FROM dim_entity where entclass='Pickup Center') pc on t.destination_store_id = pc.entsimsstoreid
                LEFT JOIN (select vin, status_name, group_acquired_date from (
                 SELECT vin, status_name, group_acquired_date, ROW_NUMBER() OVER(PARTITION BY vin order by priority) as rn FROM (
                                SELECT DISTINCT vin, status_name, Group_Acquired_Date, 1 AS priority FROM darpts.vw_ep_inventory WITH (NOLOCK)
                                UNION ALL
                                SELECT DISTINCT vin, 'SOLD' AS status, Group_Purchase_Date as group_acquired_date, 2 AS priority FROM darpts.vw_ep_sales WITH (NOLOCK) WHERE sold_days_ago <= 60
                            ) a ) b where b.rn = 1 ) i ON i.vin = t.vin
               LEFT JOIN vbm  ON t.vin=vbm.vin AND ABS(DATEDIFF(dd,vbm.purchase_date, COALESCE(i.group_acquired_date,t.load_log_at)))<=15
               LEFT JOIN darpts.dim_business_model_type bm WITH (NOLOCK) ON vbm.business_model_type_id=bm.business_model_type_id
                where pc.entsimsstoreid Is Null AND destination_name NOT LIKE '%NORTHWEST MOTORSPORT%'
                 AND((d.vin Is Not Null and t.status<>'cancelled')
                 OR (t.eta_date IS NULL and t.status not in ('delivered','cancelled') AND load_log_at>=dateadd(mm,-6,getdate()))
                 OR (t.eta_date>getdate()-7 and t.status not in ('delivered','cancelled')))


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
