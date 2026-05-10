---
name: usp_Load_DimAssociate_BK
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


-- =============================================    
-- Author:        Umberto Sartori 
-- Create date:  04/27/2016    
-- Description:   Inserts/Update Associate Dimension records (type 1 and 2)

-- 4/25/2017 - ubs - add code to handle employees with multiple source records.
-- =============================================    
CREATE PROCEDURE [dbo].[usp_Load_DimAssociate] (
	@ETLExecutionID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	,@srcRwCnt INT OUTPUT
	)
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
