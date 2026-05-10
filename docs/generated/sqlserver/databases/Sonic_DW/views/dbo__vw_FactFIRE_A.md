---
name: vw_FactFIRE_A
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_FactFIRE_A
AS
SELECT        dbo.factFIRE_A.EntityKey, dbo.factFIRE_A.DealNo, dbo.factFIRE_A.FIMgrKey, dbo.factFIRE_A.SalesMgrKey, dbo.factFIRE_A.SalesPersonKey, dbo.factFIRE_A.AccountingDateKey, dbo.factFIRE_A.ContractDateKey, 
                         dbo.factFIRE_A.Stockno, dbo.factFIRE_A.StockType, dbo.factFIRE_A.DealTypeKey, dbo.factFIRE_A.PurchaseType, CASE WHEN TransactionType = 'Product Only' THEN 'Product Only' WHEN ([PurchaseType] = 'Finance(Buy)') 
              
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
