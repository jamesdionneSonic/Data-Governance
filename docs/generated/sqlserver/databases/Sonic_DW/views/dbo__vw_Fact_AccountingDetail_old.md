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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                      Meta_RowIsCurrent, Meta_RowLastChanedDate, Meta_Checksum, ETLExecutionID, cora_acct_ID, hostitemID, Meta_Naturalkey
FROM         dbo.Fact_AccountingDetail

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
