---
name: usp_DOC_RVP_Projection
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



CREATE PROCEDURE [dbo].[usp_DOC_RVP_Projection] 
@RVPKey INT,
@UserLogin varchar(50),
@LoadDate INT
AS

DECLARE @DocDateOld INT = (SELECT MAX(DocDateKey) FROM [dbo].[Doc_RVPRecord] WHERE RVPKey = @RVPKey and DocDateKey <= @LoadDate)
DECLARE @RVPDocIDNew INT

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
SET NOCOUNT ON;

BEGIN TRY

	-- Do not create a new entry if there is already an entry today / Or older date
	IF @DocDat
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
