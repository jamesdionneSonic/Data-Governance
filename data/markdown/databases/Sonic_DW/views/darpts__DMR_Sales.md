---
name: DMR_Sales
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
CREATE VIEW [darpts].[DMR_Sales]
AS
SELECT  [Market]
      ,[Orig_Pod_ID]
      ,[Store_ID]
      ,[Curr_Store_ID]
      ,[Store_Name]
      ,[Deal_Number]
      ,[Sold_Date]
      ,[Sales_Month]
      ,[Deal_Status]
      ,[Stock_Type]
      ,[Stock_No]
      ,[VIN]
      ,[Year]
      ,[Make]
      ,[Model]
      ,[Miles]
      ,[Age_Bucket]
      ,[Age]
      ,[Days_on_Lot]
      ,[Days_In_Recon]
      ,[Days_In_Transit]
      ,[Booked_Date]
      ,[Sales_Person]
      ,[FI_Manager]
      ,[Closing_Mgr]
      ,[Acq_Fee]
      ,[Base_Cost]
      ,[Transport_Cost]
      ,[Purchase_Fees]
      ,[ACV_No_Transport]
      ,[ACV_With_Transport]
      ,[GL_Balance]
      ,[Sales_Price]
      ,[Total_Gross]
      ,[Back_Gross]
      ,[Front_Gross]
      ,[Doc_Fee]
      ,[FI_Income]
      ,[VSA_Revenue]
      ,[VSA_Cost]
      ,[VSA_Gross]
      ,[Dent_Revenue]
      ,[Dent_Cost]
      ,[Gap_Revenue]
      ,[Gap_Cost]
      ,[Perma_Revenue]
      ,[Perma_Cost]
      ,[Down_Payment]
      ,[Acctg_CashDown]
      ,[Pnote]
      ,[Finance_Co]
      ,[Sale_Type]
      ,[CashInBank_Date]
      ,[Funded_Date]
      ,[Funded]
      ,[Buy_Rate]
      ,[APR]
      ,[Points_Held]
      ,[Cust_No]
      ,[Cust_Name]
      ,[Trade_StockNo]
      ,[Trade_Gross]
      ,[Trade_ACV]
      ,[Record_Month]
      ,[Deposit_Deal]
      ,[Funded_Flag]
      ,[Bank_Sent_Flag]
      ,[Financed_Flag]
      ,[Warranty_Flag]
      ,[Gap_Flag]
      ,[Dent_Flag]
      ,[Perma_Flag]
      ,[Trade_Taken]
      ,[Warranty_NoCost]
      ,[Warranty_NoGross]
      ,[Warranty_NoSale]
      ,[Gap_NoCost]
      ,[GapCost_NoSale]
      ,[Dent_NoCost]
      ,[Perma_NoCost]
      ,[APR_LessThan_BuyRate]
      ,[APR_NoBuyRate]
      ,[DealDate_Issue]
      ,[High_Front]
      ,[High_Back]
      ,[Low_Front]
      ,[Negative_Back]
      ,[Trade_OverAllow]
      ,[Trade_NoACV]
      ,[Bank]
      ,[Report_Date]
      ,[Meta_Load_Date]
      ,[business_model_type_nm]
      ,[tirewheelsale]
      ,[tirewheelcost]
      ,[tirewheelcount]
      ,[fire_fi_manager]
      ,[OtherProductCost]
      ,[OtherProductSale]
      ,[KeyCost]
      ,[KeySale]
      ,[PhantomCost]
      ,[PhantomSale]
      ,[SecurityCost]
      ,[SecuritySale]
      ,[OtherProductCount]
      ,[KeyCount]
      ,[PhantomCount]
      ,[SecurityCount]
      ,[Theft_Flag]
      ,[Theft_NoCost]
      ,[EntityKey]
      ,[fire_fi_manager_no]
      ,[FinanceReserve]
      ,[fi_manager_no]
      ,[salesperson_no]
  FROM [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_Sales]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
