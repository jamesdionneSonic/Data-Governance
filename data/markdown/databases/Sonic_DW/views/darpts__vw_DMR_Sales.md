---
name: vw_DMR_Sales
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

- **darpts.dim_business_model_type** (V )
- **darpts.DMR_Sales** (V )

## Definition

```sql
/* Name: darpts.vw_DMR_Sales
* Created by: Brittany Rogers
* Add ons:
* Date			Developer			Change Description
* 20250725		Hermann Brandi		Added EntityKey and SoldDateKey columns to properly connect to our current hierarchies (dimensions).
* 20200725		Hermann Brandi		Added VSCWithZeroCost, VSCWithZeroGross, and VINCount columns to facilitate calculations.
* 20250801		Hermann Brandi		Added StockNumberCount column to have the same counts if VIN is not added to DMR_Non_Deal_Date view.
* 20250807		Hermann Brandi		Added conditional columns for Count of Stock_No metrics to SUM the flags instead of counting.
* 20250808		Hermann Brandi		Added Age_Bucket_Id as sorting order column.
* 20250922		Hermann Brandi		Commented the "ELSE 0" condition for AgeBucketID due some rows are teturning null.
* 20250830		Brittany Rogers		Added d.business_model_type_id to get the Business Model Type.
* 20250930		Koboyo Atake		Added the PPC line.
* 20251007     koboyo Atake        Added conditional columns for Count of Stock_No metrics to SUM Cash and Finance deal.
* 20251014		Hermann Brandi		Fixed CASE condition for VSCWithZeroCost using VSA_Cost = 0 due the alias will work when the view is created.
* 20251209		Brittany Rogers		Added buy_rate_cats column for Bank tab.
* 20251211		Hermann Brandi		Added sorting column buy_rate_cats_id.
* 10151218		Hermann Brandi		Change CASE statement for buy_rate_cats from "0' to 'Cash".
*
*/
CREATE   VIEW darpts.vw_DMR_Sales
AS
SELECT
	Market
	, EntityKey
	, Store_ID
	, Curr_Store_ID
	, [Store_Name]
	, [Deal_Number]
	, [Sold_Date]
	, CAST(CONVERT(VARCHAR(8), [Sold_Date], 112) as INT) as SoldDateKey
	, Sales_Month
	, [Deal_Status]
	, Stock_Type
	, [Stock_No]
	, [VIN]
	, [year]
	, Make
	, Model
	, [Miles]
	, CASE Age_Bucket
	WHEN '60+ Days' THEN 1
	WHEN '45-59 Days' THEN 2
	WHEN '30-44 Days' THEN 3
	WHEN '20-29 Days' THEN 4
	WHEN '10-19 Days' THEN 5
	WHEN 'Under 10 Days' THEN 6
	ELSE 0
	END AS Age_Bucket_Id
	, Age_Bucket
	, [Age]
	, [Days_On_Lot]
	, Days_In_Recon
	, [Days_In_Transit]
	, [Booked_Date]
	, [Sales_Person]
	, salesperson_no
	, [FI_Manager]
	, [Closing_Mgr]
	, [Acq_Fee]
	, [Base_Cost]
	, [Purchase_Fees]
	, [ACV_No_Transport]
	, [Transport_Cost]
	, [ACV_With_Transport]
	, [GL_Balance]
	, [Sales_Price]
	, [Total_Gross]
	, Back_Gross
	, [Front_Gross] as [FrontGrosswFees]
	, Doc_Fee
	, [VSA_Revenue] as [WarrantyFee]
	, [VSA_Cost] as [WarrantyCost]
	, [VSA_Gross] as [ServiceGross]
	, Financereserve
	, [Dent_Revenue] as [DentFee]
	, Dent_Cost
	, [Dent_Revenue]-[Dent_Cost] as DentGross
	, [Perma_Revenue] + [KeySale] as PermaFee
	, [Perma_Cost] + [KeyCost] as PermaCost
	, Gap_Revenue as GapFee
	, Gap_Cost as GapCost
	, [Gap_Revenue]-[Gap_Cost] as GapGross
	, OtherProductCost as WindshieldCost
	, OtherProductSale as WindshieldSale
	, OtherProductCost-OtherProductSale as WindshieldGross
	, phantomcost as TheftCost
	, phantomsale as TheftSale
	, phantomcost-phantomsale as TheftGross
	, [Down_Payment] as VSCCashDown
	, [Acctg_CashDown]
	, [Pnote]
	, [Finance_Co]
	, Sale_Type
	, CashInBank_Date
	, [Funded_Date]
	, Funded
	, [Buy_Rate]
	, [APR]
	, Points_Held
	, [Cust_No]
	, [Cust_Name]
	, [Trade_StockNo]
	, [Trade_Gross]
	, [Trade_ACV]
	, Record_Month
	, Deposit_Deal
	, Funded_Flag
	, Bank_Sent_Flag
	, Financed_Flag
	, Warranty_Flag
	, Gap_Flag
	, Dent_Flag
	, Theft_flag
	, CASE
	WHEN (Perma_Revenue + KeySale) > 0 THEN 1
	ELSE 0
	END as PermaFlag
	, OtherProductCount as WindshieldFlag
	, Trade_Taken
	, Warranty_NoCost
	, Warranty_NoGross
	, Warranty_NoSale
	, Gap_NoCost
	, GapCost_NoSale
	, Dent_NoCost
	, Perma_NoCost
	, APR_LessThan_BuyRate
	, APR_NoBuyRate
	, DealDate_Issue
	, High_Front
	, High_Back
	, Low_Front
	, Negative_Back
	, Trade_OverAllow
	, Trade_NoACV
	, Bank
	, Report_Date
	, s.[Meta_Load_Date]
	, NULL AS CEO
	, NULL AS Emp_Status
	, s.business_model_type_nm
	-- Custom code starts here
	, d.business_model_type_id
	, CASE WHEN vin is null then 0 ELSE 1 END as Row_Count
	, CASE
	WHEN Warranty_Flag = 0
	OR miles>=80000
	OR year<=year(getdate())-8
	OR [VSA_Gross] in (1326,1316,1270,1335,1325,1279,1203,1293,1753,1277,1367,1364,1203,1293,1795)
	THEN 0
	ELSE 1
	END as Warranty_Discount
	, Warranty_flag + gap_flag+dent_flag + Theft_Flag + CASE WHEN (Perma_Revenue + KeySale) > 0 THEN 1 ELSE 0  END + OtherProductCount as PPC
	, CASE WHEN [VIN] IS NOT NULL THEN 1 ELSE 0 END AS VINCount
	, CASE WHEN [Stock_No] LIKE 'C%' THEN 1 ELSE 0 END  AS C_StockNums
	, CASE WHEN [Stock_No] IS NOT NULL THEN 1 ELSE 0 END AS StockNumberCount
	, CASE WHEN [warranty_flag] = 1 AND [VSA_Cost] = 0 THEN 1 ELSE 0 END AS VSCWithZeroCost
	, CASE WHEN [warranty_flag] = 1 AND [VSA_Gross] = 0 THEN 1 ELSE 0 END AS VSCWithZeroGross
	, CASE WHEN [Warranty_Flag] = 1 AND [VSA_Gross] IN (800, 1325, 1350, 1375) THEN 1 ELSE 0 END AS VSC_Discount
	, CASE WHEN [Gap_Flag] = 1 AND [Gap_Cost] = 0 THEN 1 ELSE 0 END as GapWithZeroCost
	, CASE WHEN Gap_Flag = 1 AND (Gap_Revenue - Gap_Cost) = 0 THEN 1 ELSE 0 END AS GapWithZeroGross
	, CASE WHEN ([Perma_Cost] + [KeyCost]) = 0 THEN 1 ELSE 0 END AS NoAPP
	, CASE WHEN ([Perma_Cost] + [KeyCost]) = 0 AND Perma_Flag = 1 THEN 1 ELSE 0 END AS APPWithZeroCost
	, CASE WHEN Dent_Flag = 1 AND Dent_Cost = 0 THEN 1 ELSE 0 END AS DentWithZeroCost
	, CASE WHEN Dent_Flag = 1 AND (Dent_Revenue - Dent_Cost) = 0 THEN 1 ELSE 0 END AS DentWithZeroGross
	, CASE WHEN Theft_Flag = 1 AND PhantomCost = 0 THEN 1 ELSE 0 END AS TheftWithZeroCost
	, CASE WHEN Theft_Flag = 1 AND (PhantomSale - PhantomCost) = 0 THEN 1 ELSE 0 END AS TheftWithZeroGross
	, CASE WHEN OtherProductCount = 1 AND OtherProductCost=0 THEN 1 ELSE 0 END AS WindshieldWithZeroCost
	, CASE WHEN OtherProductCount = 1 AND (OtherProductSale - OtherProductCost) = 0 THEN 1 ELSE 0 END AS WindshieldWithZerogGoss
	, CASE WHEN Back_Gross > 4500 THEN 1 ELSE 0 END AS HighBackGross
	, CASE WHEN Back_Gross < 0 THEN 1 ELSE 0 END AS NegativeBackGross
	, CASE WHEN Front_Gross > 2000 THEN 1 ELSE 0 END AS HighFrontGross
	, CASE WHEN Front_Gross < -2000 THEN 1 ELSE 0 END AS LowFrontGross
	, CASE WHEN Points_Held < 0 THEN 1 ELSE 0 END AS APRLessThanBuyRate
	, CASE WHEN APR>0 AND Buy_Rate = 0 THEN 1 ELSE 0 END AS APRGreaterThanZeroNoBuyRate
	, CASE WHEN Trade_Overallow > 0 THEN 1 ELSE 0 END AS TradeOverallowance
	, CASE WHEN Trade_NoACV > 0 THEN 1 ELSE 0 END AS TradeWithZeroACV
	, CASE WHEN [Acq_Fee] > (3 * Back_Gross) THEN 1 ELSE 0 END AS Acq
	, CASE WHEN (Acq_Fee > (3 * Back_Gross)) THEN 1 ELSE 0 END AS HighAcquisitionFee
	, CASE WHEN Deal_Number IS NOT NULL THEN 1 ELSE 0 END AS DealCount
	, CASE WHEN Sale_Type ='Finance' then 1 ELSE 0 END as Finance_sale_Type
	, CASE WHEN Sale_Type ='cash' then 1 ELSE 0 END as cash_sale_type
	, CASE
		WHEN buy_rate = 0 then 0
		WHEN buy_rate < 7 then 1
		WHEN buy_rate < 14 then 2
		WHEN buy_rate >= 14 then 3
		ELSE NULL
	  END as buy_rate_cats_id
	, CASE
		WHEN buy_rate = 0 then 'Cash'
		WHEN buy_rate < 7 then '.01 to 6.99'
		WHEN buy_rate < 14 then '7 to 13.99'
		WHEN buy_rate >= 14 then '14 to 100'
		ELSE NULL
	  END as buy_rate_cats
FROM darpts.DMR_Sales s
JOIN darpts.dim_business_model_type d
	ON s.business_model_type_nm = d.business_model_type_nm;
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
