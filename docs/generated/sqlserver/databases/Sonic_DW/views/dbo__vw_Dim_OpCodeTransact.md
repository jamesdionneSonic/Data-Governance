---
name: vw_Dim_OpCodeTransact
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
CREATE VIEW [dbo].[vw_Dim_OpCodeTransact]
AS
SELECT     b.OpCodeKey, a.OpcCoraAcctID, a.OpcOpCode, a.OpcOpCodeCategory, a.OpcMenu, a.OpcOther, a.OpcWeight, a.Meta_RowLastChangedDate, a.User_ID, 
                      CASE WHEN a.OpcMenu NOT IN ('TBD', 'NA') THEN 1 ELSE 0 END AS OpcMenuNotNA
FROM         dbo.Dim_OpCode_Transact AS a INNER JOIN
                      dbo.Dim_OpCode AS b ON a.OpcCoraAcctID = b.OpcCoraAcctId AND a.OpcOpCode = b.OpcOpCode

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
