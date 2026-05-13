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
depends_on:
  - Dim_Entity
  - Dim_OpCode
  - vw_Dim_OpCodeTransact
  - xrfCoraCompanyPrefix
dependency_count: 4
column_count: 28
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_OpCode** (U )
- **dbo.vw_Dim_OpCodeTransact** (V )
- **dbo.xrfCoraCompanyPrefix** (U )

## Columns

| Name                            | Type    | Nullable | Description |
| ------------------------------- | ------- | -------- | ----------- |
| `OpCodeKey`                     | int     |          |             |
| `OpcCoraAcctId`                 | int     |          |             |
| `OpcOpCode`                     | varchar |          |             |
| `OpcOpCodeDescription_Original` | varchar | ✓        |             |
| `OpcOpCodeDescription`          | varchar | ✓        |             |
| `OpcOpCodeCategory`             | varchar | ✓        |             |
| `OpcOpCodeGroup`                | varchar |          |             |
| `OpcComebackFlag`               | bit     | ✓        |             |
| `OpcAltgFlag`                   | bit     | ✓        |             |
| `OpcDispatchCode`               | varchar | ✓        |             |
| `OpcDiscount`                   | varchar | ✓        |             |
| `OpcFlatCostRate`               | numeric | ✓        |             |
| `OpcFlatHours`                  | numeric | ✓        |             |
| `OpcFlatSellRate`               | numeric | ✓        |             |
| `OpcShopCustomerFlag`           | bit     | ✓        |             |
| `OpcShopInternalFlag`           | bit     | ✓        |             |
| `OpcShopWarrantyFlag`           | bit     | ✓        |             |
| `OpcMenuCategory`               | varchar | ✓        |             |
| `OpcMenu`                       | varchar | ✓        |             |
| `OpcOther`                      | varchar | ✓        |             |
| `ETLExecution_ID`               | int     | ✓        |             |
| `EntityKey`                     | int     | ✓        |             |
| `EntHFMDealershipName`          | varchar | ✓        |             |
| `opcishistoryflag`              | numeric | ✓        |             |
| `Meta_RowIsCurrent`             | char    | ✓        |             |
| `EntDefaultDlrshpLvl1`          | varchar | ✓        |             |
| `OpcWeight`                     | int     | ✓        |             |
| `OpcMenuNotNA`                  | int     |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
