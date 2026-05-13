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
CREATE VIEW [dbo].[vw_Dim_EPOpCodeBucket_Transact]
AS
SELECT        COALESCE (NULLIF (OpCodeBucket, ''), 'Uncategorized') AS OpCodeBucket, OpCode, Meta_UserID, Meta_RowLastChangedDate, OpCodeDesc, IsActive, OpCode + ' - ' + COALESCE (OpCodeDesc, 'No Desc')
                         AS OpCodeName
FROM            dbo.Dim_EPOpCodeBucket_Transact

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
