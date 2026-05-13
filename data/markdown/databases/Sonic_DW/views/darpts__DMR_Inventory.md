---
name: DMR_Inventory
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

CREATE VIEW [darpts].[DMR_Inventory]
AS
SELECT  [Market]
      ,[Status]
      ,[Status_Rollup]
      ,[Rollup_Code]
      ,[Status_Name]
      ,[Orig_Pod_ID]
      ,[Store_ID]
      ,[Curr_Store_ID]
      ,[Store_Name]
      ,[Stock_Type]
      ,[Stock_No]
      ,[VIN]
      ,[Year]
      ,[Make]
      ,[Model]
      ,[Trim]
      ,[Extr_Color]
      ,[Miles]
      ,[Price]
      ,[GL_Balance]
      ,[Current_Margin]
      ,[NADA_Trade]
      ,[Back_of_Book]
      ,[Pct_of_Book]
      ,[Buyer]
      ,[Auction_Location]
      ,[Age]
      ,[Age_Bucket]
      ,[Days_Since_Received]
      ,[Recon_Age_Bucket]
      ,[Days_In_Transit]
      ,[Days_In_Recon]
      ,[Days_on_Lot]
      ,[Received]
      ,[Purchase_Date]
      ,[InvAndSold]
      ,[Src_Date]
      ,[business_model_type_nm]
	   ,case when stock_type='c' then 1
	  else 0 end as street_purch_flag
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_Inventory]

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
