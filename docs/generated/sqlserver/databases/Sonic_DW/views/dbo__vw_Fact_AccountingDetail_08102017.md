---
name: vw_Fact_AccountingDetail_08102017
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Fact_AccountingDetail
AS
SELECT        a1.FactAccountDetailKey, a1.AccountingDateKey, a2.DetReferenceNumberPrefix, a2.DetReferenceNumber, a1.EntityKey, a3.EntDealerLvl1, a1.AccountKey, a1.VehicleKey, a1.VendorKey, a1.OperatorKey, 
                         a1.JournalKey, a1.CustomerKey, a1.PostingDateKey, a1.DocTypeKey, a1.InterfaceCodeKey, a1.FlagsKey, a1.DetailKey, a1.EntryDateKey, a1.AccountMgmtKey, a1.PostingAmount, a1.StatCount, 
                         a1.MgmtRollupK
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
