---
name: Transport_Purchases
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





CREATE   VIEW [darpts].[Transport_Purchases]
AS
SELECT DISTINCT [Remove]
      ,a.[VIN]
      ,a.[Entry]
      ,a.[Receiving_Market]
      ,a.[Trans_Loc]
      ,a.[CBS_Location]
      ,a.[Store]
      ,a.[Trans_Status]
      ,a.[CBS_Status]
      ,a.[Status_Rollup]
      ,a.[Stock_No]
      ,a.[Year]
      ,a.[Make]
      ,a.[Model]
      ,a.[Trim]
      ,a.[DT]
      ,a.[Age]
      ,a.[Days_In_Recon]
      ,a.[Rec_Mkt_2]
      ,a.[Purch_Dealer]
      ,a.[Buyer]
      ,a.[Source]
      ,a.[Auction]
      ,a.[Seller]
      ,a.[Purchase_Date]
      ,a.[Run_Date]
      ,a.[origintype]
      ,t.origin_name
      ,t.status
      ,p.Auction_Vehicle_Location
      ,case when (t.origin_name <> p.Auction_Vehicle_Location ) then 1 else 0 end Call_Ahead_Flag
      ----,case when (sims.vin = p.vin ) then 1 else 0 end On_Purchase_Log
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[Transport_Purchases] a
  JOIN [D1-DASQL-01,11010].[DA_Group].[dbo].[vw_Transport_Log_Combined] t
  ON a.VIN = t.VIN
  JOIN [D1-DASQL-01,11010].[DA_Group].[src].[Purchase_Log_EP] P
  ON t.VIN = P.VIN


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
