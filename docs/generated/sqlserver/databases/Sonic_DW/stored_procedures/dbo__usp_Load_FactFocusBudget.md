---
name: usp_Load_FactFocusBudget
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
-- Create date:  06/6/2016    
-- Description:   Inserts records in FactFocusBudget table
-- =============================================   

CREATE PROCEDURE [dbo].[usp_Load_FactFocusBudget] (
	@ETLExecution_ID int
)
	
AS
SET NOCOUNT ON;

MERGE INTO dbo.FactFocusBudget AS tgt
USING (select YearMonth, 
			EntityKey, 
			'NVBudgetCount' as BudgetMetricName, 
			'Units' as BudgetMetr
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
