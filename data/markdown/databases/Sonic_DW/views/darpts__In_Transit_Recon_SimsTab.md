---
name: In_Transit_Recon_SimsTab
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.Transport_Purchases** (V )
- **darpts.vw_EP_Inventory** (V )

## Definition

```sql

create view darpts.In_Transit_Recon_SimsTab as
SELECT [VIN],CBS_Status,CBS_Location,Store,[Stock_No],[Year],[Make],[Model],[Trim],[Age],Buyer
                    ,[SOURCE]+' - '+[AUCTION] as [WherePurchd],CAST([Purchase_Date] as datetime) as Purchase_Date
                    ,'Yes' as OnPurchaseLog
                FROM darpts.Transport_Purchases
                WHERE CBS_Status Is Not Null
            Union ALL
                SELECT i.[VIN],i.[Status_Name],i.[Market],i.Store_Name,i.[Stock_No],i.[Year],i.[Make],i.[Model],i.[Trim],i.[Age],i.Buyer
                    ,i.Auction_Location,i.[Purchase_Date],'No' as OnPurchaseLog
                FROM darpts.vw_EP_Inventory i
                WHERE i.Status_Rollup='IN-TRANSIT' and i.Stock_Type IN ('b','p')
                    and i.vin NOT IN (Select Distinct VIN FROM darpts.Transport_Purchases)
                    and Purchase_Date>=DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE())-1, 0)
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
