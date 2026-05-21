---
name: vw_Dim_OpCodeEP
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_OpCodeEP]
AS
SELECT        a.OpCodeKey, a.OpcCoraAcctId, a.OpcOpCode, a.OpcOpCodeDescription_Original, a.OpcOpCodeDescription, OPC.OpcOpCodeCategory,
                         CASE WHEN OPC.OpcOpCodeCategory LIKE 'LOF%' THEN 'LOF' ELSE ISNULL(OPC.OpcOpCodeCategory, ISNULL(a.opcopcodeCategory, 'NA')) END AS OpcOpCodeGroup, a.OpcComebackFlag, a.OpcAltgFlag, a.OpcDispatchCode,
                         a.OpcDiscount, a.OpcFlatCostRate, a.OpcFlatHours, a.OpcFlatSellRate, a.OpcShopCustomerFlag, a.OpcShopInternalFlag, a.OpcShopWarrantyFlag, a.OpcMenuCategory, OPC.OpcMenu, OPC.OpcOther, a.ETLExecution_ID,
                         c.EntityKey, c.EntHFMDealershipName, CONVERT(Numeric(10, 1), a.OpcIsHistoryFlag) AS opcishistoryflag, a.Meta_RowIsCurrent, c.EntDefaultDlrshpLvl1, OPC.OpcWeight, ISNULL(OPC.OpcMenuNotNA, 0) AS OpcMenuNotNA,
                         CASE WHEN COALESCE (OCB.IsActive, 0) = 0 THEN 'Uncategorized' ELSE COALESCE (NULLIF (OpCodeBucket, ''), 'Uncategorized') END AS OpCodeBucket, COALESCE (OCB.IsActive, 0) AS IsActive, OCB.OpCodeDesc,
                         OCB.OpCodeName
FROM            dbo.Dim_OpCode AS a LEFT OUTER JOIN
                         dbo.Dim_Entity AS c RIGHT OUTER JOIN
                         dbo.xrfCoraCompanyPrefix AS CCP ON c.EntCora_Account_ID = CCP.related_acctg_cora_acct_id AND c.EntADPCompanyID = CONVERT(varchar(3), CCP.Companyid) AND c.EntAccountingPrefix = CCP.Prefix ON
                         a.OpcCoraAcctId = CCP.cora_acct_id LEFT OUTER JOIN
                         dbo.vw_Dim_OpCodeTransact AS OPC ON a.OpcCoraAcctId = OPC.OpcCoraAcctID AND a.OpcOpCode = OPC.OpcOpCode LEFT OUTER JOIN
                         dbo.vw_Dim_EPOpCodeBucket_Transact AS OCB ON a.OpcOpCode = OCB.OpCode
WHERE        (c.EntLineOfBusiness = 'EchoPark')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
