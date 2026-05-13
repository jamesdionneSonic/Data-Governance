---
name: vw_Pricing_Report_Main_Full
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 2
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.Pricing_InventoryStatus** (U )
- **dbo.vw_Dim_DealershipEP** (V )

## Definition

```sql
CREATE VIEW darpts.vw_Pricing_Report_Main_Full
AS
SELECT DISTINCT
                         pr.Meta_Load_Date, pr.Market, pr.Status, pr.Status_Name, pis.StatusGroup, pr.business_model_type_id, pr.business_model_type_nm, dep.DealershipLvl1EntityKey, pr.store_name, pr.Stock_No, pr.VIN, pr.Year, pr.Make,
                         pr.Model, pr.Trim, pr.Age, pr.Days_On_Lot, pr.Miles, pr.Drivetrain, pr.Color, pr.Engine, pr.Trans, pr.Buyer, pr.WherePurchd, CAST(pr.Rental_Flag AS INT) AS Rental_Flag, pr.Manager_Notes, pr.Last_Price_Change, pr.Leads,
                         pr.[In CDK], pr.Purchase_Date, pr.Base_Cost, pr.Buyer_Cost, pr.Other, pr.ACV_No_Transport, pr.Transport, pr.Recon, pr.OpenRO_Amt, pr.open_ro_details, pr.GL_Balance, pr.Price, pr.Price_Pct_to_Mkt, pr.CarMax_PCM,
                         pr.Total_count, pr.Guardrail, pr.current_markdown_reason, pr.NADA_Trade, pr.[Back of Book], pr.KBB_Retail, pr.KBB_Diff, pr.MMR, pr.days_in_stat, pr.status_last_changed_date, pr.status_last_changed_by, pr.VDP_Views,
                         pr.Avg_Views_Per_Day, pr.CarGurus_Rating, pr.CarGurus_Rating_Bucket, pr.CarGurus_Rank, pr.Cargurus_Mkt_Total, pr.Carguru_Rank_PTM, pr.Current_Margin, pr.title_status, pr.photo_count, pr.Price_Pct_to_Mkt_Bucket,
                         pis.InventoryStatusID, CASE WHEN pr.Age < 10 THEN '<10' WHEN pr.Age BETWEEN 10 AND 16 THEN '10-16' WHEN pr.Age BETWEEN 17 AND 23 THEN '17-23' WHEN pr.Age BETWEEN 24 AND
                         30 THEN '24-30' WHEN pr.Age BETWEEN 31 AND 37 THEN '31-37' WHEN pr.Age BETWEEN 38 AND 44 THEN '38-44' WHEN pr.Age BETWEEN 45 AND 51 THEN '45-51' WHEN pr.Age BETWEEN 52 AND
                         58 THEN '52-58' ELSE '59+' END AS Age_Bucket, CASE WHEN pr.[Days_On_Lot] < 10 THEN '<10' WHEN pr.[Days_On_Lot] BETWEEN 10 AND 16 THEN '10-16' WHEN pr.[Days_On_Lot] BETWEEN 17 AND
                         23 THEN '17-23' WHEN pr.[Days_On_Lot] BETWEEN 24 AND 30 THEN '24-30' WHEN pr.[Days_On_Lot] BETWEEN 31 AND 37 THEN '31-37' WHEN pr.[Days_On_Lot] BETWEEN 38 AND
                         44 THEN '38-44' WHEN pr.[Days_On_Lot] BETWEEN 45 AND 51 THEN '45-51' WHEN pr.[Days_On_Lot] BETWEEN 52 AND 58 THEN '52-58' ELSE '59+' END AS DaysOnLot_Bucket, CASE WHEN pr.Price IS NULL THEN NULL
                         WHEN pr.Status <> 'In-Stock' THEN NULL WHEN pr.OpenRO_Amt >= 1 OR
                         pr.GL_Balance <= (0.95 * pr.ACV_No_Transport) OR
                         pr.GL_Balance <= 1000 THEN NULL WHEN pr.Price > 1 THEN pr.Current_Margin ELSE NULL END AS Price_Profit, 1 AS RowCounter, CASE WHEN pr.ACV_No_Transport > 0 AND
                         pr.Price > 0 THEN pr.price - pr.acv_no_transport ELSE NULL END AS PriceOverPurchase,
                         CAST(CASE WHEN pr.Price_Pct_to_Mkt_Bucket = '>110%' THEN 1 WHEN pr.Price_Pct_to_Mkt_Bucket = '>105%' THEN 2 WHEN pr.Price_Pct_to_Mkt_Bucket = '>100%' THEN 3 WHEN pr.Price_Pct_to_Mkt_Bucket = '>95%' THEN 4
                          WHEN pr.Price_Pct_to_Mkt_Bucket = '>90%' THEN 5 ELSE 6 END AS int) AS PCM_Sort,
                         CAST(CASE WHEN pr.CarGurus_Rating_Bucket = 'Great Deal' THEN 1 WHEN pr.CarGurus_Rating_Bucket = 'Good Deal' THEN 2 WHEN pr.CarGurus_Rating_Bucket = 'Fair Deal' THEN 3 ELSE 4 END AS int)
                         AS CarGurus_Rating_Bucket_Sort, 'EP' AS TopLevel
FROM            [D1-DASQL-01,11010].DA_Group.rpt.Pricing_Report_Main_Full AS pr LEFT OUTER JOIN
                         darpts.Pricing_InventoryStatus AS pis ON pr.Status_Name = pis.SIMSStatus LEFT OUTER JOIN
                         dbo.vw_Dim_DealershipEP AS dep ON pr.store_name = dep.EntDealerLvl1

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
