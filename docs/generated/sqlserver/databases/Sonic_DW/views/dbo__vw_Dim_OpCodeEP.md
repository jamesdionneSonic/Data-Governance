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
extracted_at: 2026-05-09T12:34:14.349Z
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
                         a.OpcDiscount, a.OpcFlatCostRate, a.OpcFlatHours, a.OpcFlatSellRa
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
