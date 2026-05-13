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
depends_on:
  - Dim_Entity
  - Dim_OpCode
  - vw_Dim_EPOpCodeBucket_Transact
  - vw_Dim_OpCodeTransact
  - xrfCoraCompanyPrefix
dependency_count: 5
column_count: 32
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_OpCode** (U )
- **dbo.vw_Dim_EPOpCodeBucket_Transact** (V )
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
| `OpCodeBucket`                  | varchar | ✓        |             |
| `IsActive`                      | int     | ✓        |             |
| `OpCodeDesc`                    | varchar | ✓        |             |
| `OpCodeName`                    | varchar | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
