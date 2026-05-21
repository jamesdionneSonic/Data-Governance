---
name: vw_Dim_OpCode
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


/***********************************************************************
* - Updated by Jonathan Henin
* - Updated 02/18/2014
* - Used by MicroStrategy
*
*
***********************************************************************
*/

CREATE VIEW [dbo].[vw_Dim_OpCode]
AS
SELECT        a.OpCodeKey, a.OpcCoraAcctId, a.OpcOpCode, a.OpcOpCodeDescription_Original, a.OpcOpCodeDescription, OPC.OpcOpCodeCategory,
                         CASE WHEN OPC.OpcOpCodeCategory LIKE 'LOF%' THEN 'LOF' ELSE ISNULL(OPC.OpcOpCodeCategory, ISNULL(a.opcopcodeCategory, 'NA')) END AS OpcOpCodeGroup, a.OpcComebackFlag, a.OpcAltgFlag, a.OpcDispatchCode,
                         a.OpcDiscount, a.OpcFlatCostRate, a.OpcFlatHours, a.OpcFlatSellRate, a.OpcShopCustomerFlag, a.OpcShopInternalFlag, a.OpcShopWarrantyFlag, a.OpcMenuCategory, OPC.OpcMenu, OPC.OpcOther, a.ETLExecution_ID,
                         c.EntityKey, c.EntHFMDealershipName, CONVERT(Numeric(10, 1), a.OpcIsHistoryFlag) AS opcishistoryflag, a.Meta_RowIsCurrent, c.EntDefaultDlrshpLvl1, OPC.OpcWeight, ISNULL(OPC.OpcMenuNotNA, 0)
                         AS OpcMenuNotNA
FROM         dbo.Dim_Entity AS c RIGHT OUTER JOIN
                      [xrfCoraCompanyPrefix] AS CCP ON c.EntCora_Account_ID = CCP.related_acctg_cora_acct_id AND c.EntADPCompanyID = CONVERT(varchar(3),
                      CCP.Companyid) AND c.EntAccountingPrefix = CCP.Prefix RIGHT OUTER JOIN
                      dbo.Dim_OpCode AS a ON CCP.cora_acct_id = a.OpcCoraAcctId LEFT OUTER JOIN
                      dbo.vw_Dim_OpCodeTransact AS OPC ON a.OpcCoraAcctId = OPC.OpcCoraAcctID AND a.OpcOpCode = OPC.OpcOpCode


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
