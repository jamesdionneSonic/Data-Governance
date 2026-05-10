---
name: usp_Load_DimAssociate
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



CREATE PROCEDURE [dbo].[usp_Load_DimAssociate] (
       @ETLExecutionID INT
       ,@insertedRowCnts INT OUTPUT
       ,@updatedRowCnts INT OUTPUT
       ,@srcRwCnt INT OUTPUT
       )
AS
SET NOCOUNT ON;


DECLARE @insertedCount INT;
DECLARE @updatedCount INT;
DECLARE @today datetime = getdate();
DECLARE @yesterday datetime = getdate() -1;

CREATE TABLE #MergeAction ( 
	MergeAction varchar(20), 
	--[AssociateKey] [int] IDENTITY(1,1) NOT NULL,
	[AsoLocation] [int] NOT NULL
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
