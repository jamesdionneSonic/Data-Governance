---
name: vw_Dim_EPOpCodeBucket_Transact
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_EPOpCodeBucket_Transact
dependency_count: 1
column_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_EPOpCodeBucket_Transact** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `OpCodeBucket`            | varchar  | ✓        |             |
| `OpCode`                  | varchar  |          |             |
| `Meta_UserID`             | varchar  |          |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `OpCodeDesc`              | varchar  | ✓        |             |
| `IsActive`                | bit      | ✓        |             |
| `OpCodeName`              | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW [dbo].[vw_Dim_EPOpCodeBucket_Transact]
AS
SELECT        COALESCE (NULLIF (OpCodeBucket, ''), 'Uncategorized') AS OpCodeBucket, OpCode, Meta_UserID, Meta_RowLastChangedDate, OpCodeDesc, IsActive, OpCode + ' - ' + COALESCE (OpCodeDesc, 'No Desc')
                         AS OpCodeName
FROM            dbo.Dim_EPOpCodeBucket_Transact

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
