---
name: usp_FIRE_BuildSummaryFact
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

CREATE PROCEDURE [dbo].[usp_FIRE_BuildSummaryFact] (@StartDateKey int, @EndDateKey int)
AS
BEGIN
    SET NOCOUNT ON;

    --
    -- Delete from dbo.factFIRE_A for the date range specified in the parms. Note
    -- that the delete is batched...
    -- odmcpeak 9/26/2011
    --
    DECLARE @cnt int = 1
    WHILE @cnt <> 0
    BEGIN
        BEGIN TRANSACTION
            DELETE TOP (10000)
            FROM dbo.factFIRE_A 
            WHERE AccountingDateKey BETWEEN @StartDateKey AN
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
