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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_AccountingDetailCurrent]
AS
SELECT        fadc.FactAccountDetailKey, fadc.AccountKey, fadc.VehicleKey, fadc.DMSVendorKey, fadc.DMSCustomerKey, fadc.VendorKey, fadc.AssociateKey, fadc.OperatorKey, fadc.JournalKey, fadc.CustomerKey,
                                                    fadc.EntityKey, fadc.PostingDateKey, fadc.AccountingDateKey, fadc.EntryDateKey, fadc.DocTypeKey, fadc.InterfaceCodeKey, fadc.VehicleGeneralKey, fadc.FlagsKey, fadc.DetailKey, fadc.SourceEntityKey,
                                                    fadc.MgmtRollupKey, fadc.SECRollupKey, fadc.AccountMgmtKey, fadc.PostingAmount, fadc.StatCount, fadc.User_ID, fadc.Meta_ComputerName, fadc.Meta_LoadDate, fadc.Meta_AuditScore, fadc.Meta_Src_Sys_ID,
                                                    fadc.Meta_SourceSystemName, fadc.Meta_RowEffectiveDate, fadc.Meta_RowLastChanedDate, fadc.Meta_Checksum, fadc.ETLExecutionID, fadc.HFMBrandKey, dbo.Dim_GLDetail.DetControl,
                                                    dbo.Dim_GLDetail.DetControl2, dbo.Dim_GLDetail.DetReferenceNumber, dbo.Dim_GLDetail.DetCora_Acct_ID, dbo.Dim_GLDetail.DetHeaderDescription, dbo.Dim_GLDetail.DetDetailDescription
                          FROM            dbo.Fact_AccountingDetailCurrent AS fadc LEFT OUTER JOIN
                                                    dbo.Dim_GLDetail ON fadc.DetailKey = dbo.Dim_GLDetail.DetailKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
