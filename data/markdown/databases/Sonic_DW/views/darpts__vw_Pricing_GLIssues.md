---
name: vw_Pricing_GLIssues
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 1
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.Pricing_InventoryStatus** (U )

## Definition

```sql
CREATE VIEW darpts.vw_Pricing_GLIssues
AS
SELECT DISTINCT
                         Pricing_Report_Main_Full_1.Market, Pricing_Report_Main_Full_1.Status_Name, Pricing_Report_Main_Full_1.store_name, Pricing_Report_Main_Full_1.Stock_No, Pricing_Report_Main_Full_1.VIN,
                         Pricing_Report_Main_Full_1.Year, Pricing_Report_Main_Full_1.Make, Pricing_Report_Main_Full_1.Model, Pricing_Report_Main_Full_1.Trim, Pricing_Report_Main_Full_1.Age, Pricing_Report_Main_Full_1.Days_On_Lot,
                         Pricing_Report_Main_Full_1.Purchase_Price, Pricing_Report_Main_Full_1.Other, Pricing_Report_Main_Full_1.ACV_No_Transport, Pricing_Report_Main_Full_1.Transport, Pricing_Report_Main_Full_1.Recon,
                         Pricing_Report_Main_Full_1.OpenRO_Amt, Pricing_Report_Main_Full_1.open_ro_details, Pricing_Report_Main_Full_1.GL_Balance, Pricing_Report_Main_Full_1.Buyer, Pricing_Report_Main_Full_1.Purchase_Date,
                         darpts.Pricing_InventoryStatus.InventoryStatusID
FROM            [D1-DASQL-01,11010].DA_Group.rpt.Pricing_Report_Main_Full AS Pricing_Report_Main_Full_1 LEFT OUTER JOIN
                         darpts.Pricing_InventoryStatus ON Pricing_Report_Main_Full_1.Status_Name = darpts.Pricing_InventoryStatus.SIMSStatus
WHERE        (Pricing_Report_Main_Full_1.Status = 'in-stock') AND (Pricing_Report_Main_Full_1.OpenRO_Amt >= 1) AND (Pricing_Report_Main_Full_1.Market <> 'Tactical') AND (Pricing_Report_Main_Full_1.Market <> 'Alfa Romeo') OR
                         (Pricing_Report_Main_Full_1.Status = 'in-stock') AND (Pricing_Report_Main_Full_1.Market <> 'Tactical') AND (Pricing_Report_Main_Full_1.Market <> 'Alfa Romeo') AND (Pricing_Report_Main_Full_1.GL_Balance <= 1000) OR
                         (Pricing_Report_Main_Full_1.Status = 'in-stock') AND (Pricing_Report_Main_Full_1.Market <> 'Tactical') AND (Pricing_Report_Main_Full_1.Market <> 'Alfa Romeo') AND
                         (Pricing_Report_Main_Full_1.GL_Balance < .95 * Pricing_Report_Main_Full_1.ACV_No_Transport)

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
