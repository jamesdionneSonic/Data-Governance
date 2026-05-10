---
name: update_dim_lender_category
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
-- stored proc for MSTR -- 
CREATE PROC dbo.update_dim_lender_category
				 @sonic_grouping VARCHAR(100) = '' ,
				 @grouping_category VARCHAR(100) = '' ,
				 @FicoTier VARCHAR(100) = '' ,
				 @LenderType VARCHAR(100) = '' ,
				 @PreferenceStatus VARCHAR(100) = '' ,
				 @userid VARCHAR(100) = ''
AS

	IF @sonic_grouping = ''
		AND
		@sonic_grouping NOT IN (SELECT DISTINCT Lender_Category FROM dbo.Dim_Lender_Categories)
		INSERT INTO Sonic_DW.dbo.Dim_Lender_Categories (Lender_Cat
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
