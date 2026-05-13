---
name: vw_FactFIRE_A_old_20120912
database: Sonic_DW
type: view
schema: MS
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
- **Schema**: MS

## Definition

```sql


Create view [MS].[vw_FactFIRE_A_old_20120912]
as
SELECT [EntityKey]
      ,[DealNo]
      ,[FIMgrKey]
      ,[SalesMgrKey]
      ,[SalesPersonKey]
      ,[AccountingDateKey]
      ,[ContractDateKey]
      --,[CashPrice]
      ,[Stockno]
      ,[StockType]
      ,[DealTypeKey]
      ,[PurchaseType]
      ,[TransactionType]
      --,[IsRetail]
      ,[VehicleKey]
      ,[VehicleMileage]
      ,[VehicleYear]
      ,[CertifiedFlag]
      ,[FIGLProductCategoryKey]
      ,[FIAccountType]
      ,[Amount]
      ,[DealCount]
      ,[ProductCount]
      ,[PenetrationCount]
      ,[CustomerKey]
      ,[fiwipstatuscode]
      ,[LenderKey]
  FROM [Sonic_DW].[dbo].[factFIRE_A]



```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
