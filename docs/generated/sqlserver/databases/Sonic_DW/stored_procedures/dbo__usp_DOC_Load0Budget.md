---
name: usp_DOC_Load0Budget
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
-- Author:		Henin, Jonathan
-- Create date: 12/07/2020
-- Description:	Load a 0 Budget for a new store, from Start Date Key through the end of the year.
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Load0Budget]
@EntityKey INT,
@MonthStartDateKey INT = NULL

AS
-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;

BEGIN TRY
	BEGIN

	IF 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
