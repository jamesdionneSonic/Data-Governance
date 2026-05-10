---
name: usp_FactVehicleInventory
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


/* ************************************************************************************ */
/* Author: Jo Carter	Date: 2018-01-17	Change: Creation							*/
/* ************************************************************************************ */
																						
CREATE PROCEDURE [dbo].[usp_FactVehicleInventory]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;

/* variables */
CREATE TABLE #MergeDVIRowCounts (
	MergeAction VARCHAR(20)
	, [V
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
