---
name: vw_FIREBkdDealsAsFUEL
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

CREATE VIEW [dbo].[vw_FIREBkdDealsAsFUEL]
AS
SELECT        NULL AS FactAccountDetailKey, a.AccountKey, f.VehicleKey, - 1 AS DMSVendorKey, f.CustomerKey AS DMSCustomerKey, - 1 AS VendorKey, - 1 AS AssociateKey, 
                         - 1 AS OperatorKey, - 1 AS JournalKey, f.CustomerKey, f.EntityKey, f.AccountingDateKey AS PostingDateKey, f.AccountingDateKey, 
                         f.AccountingDateKey AS EntryDateKey, - 1 AS DocTypeKey, - 1 AS InterfaceCodeKey, f.VehicleGeneralKey, - 1
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
