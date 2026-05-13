---
name: vw_EP_Inventory
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




CREATE VIEW [darpts].[vw_EP_Inventory]
AS
SELECT  [Market]
      ,[Orig_Pod_ID]
      ,[CDK_Store]
      ,[Store_ID]
      ,[Vehicle_ID]
      ,[Invtr_ID]
      ,[Curr_Store_ID]
      ,[Store_Name]
      ,[Stock_Type]
      ,[VIN]
      ,[Stock_No]
      ,[UVC]
      ,[chrome_style_id]
      ,[Vehicle_Class]
      ,[Vehicle_Class_1]
      ,[Year]
      ,[Make]
      ,[Model_Orig]
      ,[Model]
      ,[Trim]
      ,[Clean_Trim]
      ,[Buyer_Trim]
      ,[Miles]
      ,[Extr_Color]
      ,[Intr_Color]
      ,[Engine]
      ,[Drivetrain]
      ,[Transmission]
      ,[Leather]
      ,[Nav]
      ,[Pano]
      ,[Group_Age]
      ,[Age]
      ,[Days_on_Lot]
      ,[Days_In_Recon]
      ,[Days_In_Transit]
      ,[Purchase_Date]
      ,[Group_Acquired_Date]
      ,[Buyer]
      ,[Auction_Location]
      ,[Source]
      ,[Seller]
      ,[Auction_Type]
      ,[Live_Fixed]
      ,[Buyer_Cost]
      ,[Buyer_Notes]
      ,[Transport_Co]
      ,[Base_Cost]
      ,[Transport_Cost]
      ,[Purchase_Fees]
      ,[ACV_No_Transport]
      ,[ACV_With_Transport]
      ,[Recon]
      ,[OpenRO_Amt]
      ,[orig_gl_balance]
      ,[GL_Balance]
      ,[Retail_Price]
      ,[orig_margin]
      ,[Current_Margin]
      ,[Previous_Price]
      ,[Priced_By]
      ,[Price_Age]
      ,[Last_Price_Change]
      ,[Override]
      ,[Guardrail]
      ,[current_markdown_reason]
      ,[price_type]
      ,[Market_Price]
      ,[Pur_Market_Price]
      ,[BP_Market_Price]
      ,[default_pcm]
      ,[optimizer_pcm]
      ,[KBB_Wholesale]
      ,[KBB_Retail]
      ,[NADA_Trade]
      ,[NADA_Retail]
      ,[NADA_Valuation_Date]
      ,[CarGurus_Rating]
      ,[CarGurus_NextPrice]
      ,[cargurus_dist_to_good]
      ,[cargurus_dist_to_great]
      ,[CarGurus_Rating_Orig]
      ,[SearchRankInSearchURL]
      ,[TotalSearchesInSearchURL]
      ,[Bad_Carfax]
      ,[VDP_Views]
      ,[Leads]
      ,[Manager_Notes]
      ,[Status]
      ,[Status_Name]
      ,[Rollup_Code]
      ,[Status_Rollup]
      ,[Rental_Flag]
      ,[CR_Grade]
      ,[fits_model]
      ,[Not_In_SIMS_Flag]
      ,[Not_In_CDK_Flag]
      ,[title_status]
      ,[Postgres_Override]
      ,[business_model_type_id]
      ,[business_model_type_nm]
      ,[photo_count]
      ,[status_last_changed_by]
      ,[status_last_changed_date]
      ,[open_ro_details]
      ,[MMR]
      ,[doc_fee]
      ,[msrp]
      ,[wizard_page]
      ,[Meta_Load_Date]
      ,[inv_source]
      ,[Merch_Flag]
      ,[model_price_change_cnt]
      ,[nonmodel_override_cnt]
      ,[fuel]
      ,[changes_over_14_days]
      ,[sum_of_total_price_changes]
      ,[sum_of_changes_over_14_days]
      ,[last_price_diff]
      ,[sum_of_model_changes]
      ,[sum_of_nonmodel_changes]
      ,[Hail_Vin]
  FROM [D1-DASQL-01,11010].[DA_Group].[dbo].[vw_EP_Inventory]

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
