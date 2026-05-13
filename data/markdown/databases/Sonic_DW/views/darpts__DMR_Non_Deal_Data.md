---
name: DMR_Non_Deal_Data
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
/* Name: darpts.DMR_Non_Deal_Data
* Created by: Brittany Rogers
* Change Control
* Date			Developer			Change Description
* 20250731		Hermann Brandi		Created field AccountingDateId due AccountingDateKey refers to a month and not a day.
* 20250801		Hermann Brandi		Created StockNumberCount column in case we cannot add VIN to this view.
*
*/
CREATE   VIEW [darpts].[DMR_Non_Deal_Data]
AS
SELECT  [EntityKey]
      ,[EntRegion]
      ,[EntADPCompanyID]
      ,[Market]
      ,[SIMS_Dealer_ID]
      ,[Store_Name]
      ,[EntDealerLvl0]
      ,[StockNo]
      ,[AccountingDateKey]
      ,[AccountingDate]
      ,CAST(CONVERT(VARCHAR(8), [AccountingDate], 112) as INT) as AccountingDateId
      ,[Record_Month]
      ,[DealStatus]
      ,[DealNumber]
      ,[StatCount]
      ,[FrontGross]
      ,[PackDoc]
      ,[FrontPUR]
      ,[OtherCostAdj]
      ,[FrontGross_PackDocFactory]
      ,[BackGross]
      ,[FI_Net]
      ,[Chargebacks]
      ,[FI_Pack]
      ,[Load_Date]
      ,CASE WHEN [StockNo] IS NOT NULL THEN 1 ELSE 0 END AS StockNumberCount
  FROM  [D1-DASQL-01,11010].[DA_Group].[rpt].[DMR_Non_Deal_Data]
```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
