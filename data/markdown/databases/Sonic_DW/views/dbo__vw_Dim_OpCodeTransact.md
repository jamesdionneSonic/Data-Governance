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
depends_on:
  - Dim_OpCode
  - Dim_OpCode_Transact
dependency_count: 2
column_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_OpCode** (U )
- **dbo.Dim_OpCode_Transact** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `OpCodeKey`               | int      |          |             |
| `OpcCoraAcctID`           | int      |          |             |
| `OpcOpCode`               | varchar  |          |             |
| `OpcOpCodeCategory`       | varchar  | ✓        |             |
| `OpcMenu`                 | varchar  | ✓        |             |
| `OpcOther`                | varchar  | ✓        |             |
| `OpcWeight`               | int      | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `User_ID`                 | varchar  | ✓        |             |
| `OpcMenuNotNA`            | int      |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
