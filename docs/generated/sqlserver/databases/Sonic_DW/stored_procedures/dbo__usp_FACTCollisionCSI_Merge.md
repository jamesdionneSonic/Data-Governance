---
name: usp_FACTCollisionCSI_Merge
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
 

create Procedure [dbo].[usp_FACTCollisionCSI_Merge]
(
	@InsertedRowCnt INT OUTPUT,
	@UpdatedRowCnt INT OUTPUT
)
AS

declare @rowCounts table (MergeAction VARCHAR(20));


MERGE	[Sonic_DW].[dbo].[FactCollisionCSI] AS [tgt]
USING	[ETL_Staging].[wrk].[CollisionCSI] AS [src]
			ON [tgt].[Meta_NaturalKey] = [src].[Meta_NaturalKey]
 
WHEN MATCHED 
THEN UPDATE SET
    [tgt].[FiscalMonthDateKey] = [src].[FiscalMonthDateKey],
    [tgt].[EntityKey] = [src].[EntityKey],
	[tgt].[Number
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
