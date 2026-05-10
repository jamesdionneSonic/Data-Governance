---
name: vw_Fact_AccountingDetail_old
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
CREATE VIEW dbo.vw_Fact_AccountingDetail
AS
SELECT     FactAccountDetailKey, AccountKey, VehicleKey, VendorKey, AssociateKey, OperatorKey, JournalKey, CustomerKey, EntityKey, PostingDateKey, 
                      AccountingDateKey, EntryDateKey, DocTypeKey, InterfaceCodeKey, VehicleGeneralKey, FlagsKey, DetailKey, SourceEntityKey, MgmtRollupKey, 
                      SECRollupKey, PostingAmount, StatCount, Meta_AuditScore, Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, 
  
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
