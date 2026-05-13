---
name: Purchase_Log_EP
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql




CREATE VIEW [darpts].[Purchase_Log_EP]
AS
SELECT  [Entry]
      ,[VIN]
      ,[Stk_Nbr]
      ,[YR]
      ,[Make]
      ,[Model]
      ,[Trim]
      ,[DT]
      ,[Receiving_Market]
      ,[Receiving_Dealer]
      ,[Purchasing_Dealer]
      ,[Method]
      ,[Cost]
      ,[Auc_Fee]
      ,[MH_Fee]
      ,[Buy_Fee]
      ,[AddSonicShield]
      ,[SonicShieldCost]
      ,[Trans_Cost]
      ,[TotalCost]
      ,[MI]
      ,[Buyer]
      ,[Source]
      ,[Auction_Vehicle_Location]
      ,[Seller]
      ,[Closed_Open]
      ,[Live_Fixed]
      ,[Avg_MMR]
      ,[NADA]
      ,[BOB]
      ,[CR_Grade]
      ,[Ext_Color]
      ,[Int_Color]
      ,[BOS_Sent]
      ,[CR_Link]
      ,[Notes]
      ,[Fleet_Indicator]
      ,[Brass]
      ,[ThirdRowSeat]
      ,[Leather]
      ,[PanoramicRoof]
      ,[NavigationSystem]
      ,[Sunroof]
      ,[PowerSeats]
      ,[PremiumAudio]
      ,[QuadSeats]
      ,[TowPackage]
      ,[CBA_Record]
      ,[Meta_File_Date]
      ,[Meta_Load_Date]
      ,[store_id]
      ,[ReceivingDealerEntityKey]
      ,[PurchasingDealerEntityKey]
      ,[origintype]
      ,[purchase_detail_id]
      ,[title_attached]
      ,[transmission]
      ,[confirmed]
      ,[uvc]
      ,[decodeable]
      ,[purchaseguid]
      ,[lifted]
      ,[previous_canadian]
      ,[canadian_hold]
  FROM [D1-DASQL-01,11010].[DA_Group].[src].[Purchase_Log_EP]





```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
