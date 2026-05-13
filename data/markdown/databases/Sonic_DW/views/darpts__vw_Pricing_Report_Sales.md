---
name: vw_Pricing_Report_Sales
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Definition

```sql
CREATE VIEW darpts.vw_Pricing_Report_Sales
AS
SELECT        prs.Market, prs.Store_Name, prs.Status, prs.VIN, prs.Stock_No, prs.Sold_Date, prs.Year, prs.Make, prs.Model, prs.Trim, prs.Miles, prs.Color, prs.Sold_Days_Ago, prs.Age, prs.Days_on_Lot, prs.Days_In_Recon,
                         prs.Days_In_Transit, prs.Vehicle_Cost, prs.Sales_Price, prs.Total_Gross, prs.Back_Gross, prs.Front_Gross, prs.TotalTradesOver, prs.Acq_Fee, prs.Acq_Cost, prs.AcqFeeGross, prs.HardWeOweSale, prs.HardWeOweCost,
                         prs.HardWeOweGross, prs.FrontEndAdj, prs.FrontGrossLessAdj, prs.MMR, prs.WherePurchd, prs.Buyer, prs.VDP_Views, prs.Meta_Load_Date, prs.age_bucket, prs.title_status, prs.photo_count, prs.status_last_changed_date,
                         prs.status_last_changed_by, prs.Weeks_Back, prs.business_model_type_nm, simsstat.Status_Name, CASE WHEN prs.[Days_On_Lot] < 10 THEN '<10' WHEN prs.[Days_On_Lot] BETWEEN 10 AND
                         16 THEN '10-16' WHEN prs.[Days_On_Lot] BETWEEN 17 AND 23 THEN '17-23' WHEN prs.[Days_On_Lot] BETWEEN 24 AND 30 THEN '24-30' WHEN prs.[Days_On_Lot] BETWEEN 31 AND
                         37 THEN '31-37' WHEN prs.[Days_On_Lot] BETWEEN 38 AND 44 THEN '38-44' WHEN prs.[Days_On_Lot] BETWEEN 45 AND 51 THEN '45-51' WHEN prs.[Days_On_Lot] BETWEEN 52 AND
                         58 THEN '52-58' WHEN prs.[Days_On_Lot] > 58 THEN '59+' ELSE NULL END AS DaysOnLot_Bucket, 'All' AS TopLevel
FROM            [D1-DASQL-01,11010].DA_Group.rpt.Pricing_Report_Sales AS prs LEFT OUTER JOIN
                         [D1-DASQL-01,11010].DA_Group.dbo.EPSIMS_Status_Today AS simsstat ON prs.Status = simsstat.Status_ID
WHERE        (prs.Market NOT IN ('Tactical', 'Alfa Romeo')) AND (prs.VIN IS NOT NULL)

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
