---
name: vw_Fact_AccountingDetailCurrent
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

CREATE VIEW [dbo].[vw_Fact_AccountingDetailCurrent]
AS
SELECT        fadc.FactAccountDetailKey, fadc.AccountKey, fadc.VehicleKey, fadc.DMSVendorKey, fadc.DMSCustomerKey, fadc.VendorKey, fadc.AssociateKey, fadc.OperatorKey, fadc.JournalKey, fadc.CustomerKey, 
                                                    fadc.EntityKey, fadc.PostingDateKey, fadc.AccountingDateKey, fadc.EntryDateKey, fadc.DocTypeKey, fadc.InterfaceCodeKey, fadc.VehicleGeneralKey, fadc.FlagsKey, fadc.DetailKey, fadc.Sour
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
