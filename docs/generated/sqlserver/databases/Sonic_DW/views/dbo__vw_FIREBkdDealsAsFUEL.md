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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         f.AccountingDateKey AS EntryDateKey, - 1 AS DocTypeKey, - 1 AS InterfaceCodeKey, f.VehicleGeneralKey, - 1 AS FlagsKey, - 1 AS DetailKey, - 1 AS SourceEntityKey,
                         - 1 AS MgmtRollupKey, - 1 AS SECRollupKey,

				--Fleet Logic change starts here  -- MFS 5/22/19 update to classify fleet booked deals as fleet
						 case when DealTypeKey = 5 and am.AccountMgmtKey = 294 then 329  --new retail sale to new fleet sale
						 when DealTypeKey = 5 and am.AccountMgmtKey = 298 then 331 --new retail COS to new fleet COS
						 else am.AccountMgmtKey end as AccountMgmtKey,
				--Fleet Logic change ends here


						 (CASE WHEN fa.FIAccountType IN ('s') THEN - 1 ELSE 1 END) * f.Amount AS PostingAmount,
                         f.statcount, f.User_ID, f.Meta_ComputerName, f.Meta_LoadDate, NULL AS Meta_AuditScore, f.Meta_Src_Sys_ID, NULL AS Meta_SourceSystemName,
                         f.Meta_RowEffectiveDate, NULL AS Meta_RowLastChanedDate, NULL AS Meta_Checksum, NULL AS ETLExecutionID, f.StockNo
FROM            dbo.factFIRE AS f INNER JOIN
                         dbo.dim_FIGLAccounts AS fa ON f.FIGLProductKey = fa.FIGLProductKey INNER JOIN
                         dbo.Dim_Entity AS e ON f.EntityKey = e.EntityKey INNER JOIN
                         dbo.Dim_Account AS a ON CAST(CASE EntAccountingPrefix WHEN 0 THEN '' ELSE rtrim(EntAccountingPrefix) END AS varchar) + CAST(LTRIM(fa.FIAccount) AS varchar)
                          = a.AccAccountNumber AND e.EntCora_Account_ID = a.AccCoraAcctId AND e.EntADPCompanyID = CAST(a.AccCompanyId AS varchar) LEFT OUTER JOIN
                         dbo.Dim_AccountMgmt AS am ON a.AccHFMAccount = am.Level8
WHERE        (f.fiwipstatuscode IN ('B', 'i'))

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
