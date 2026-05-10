---
name: usp_BTChecklist
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
-- Author:		Jonathan Henin
-- Create date: 8/31/2016
-- Description:	Insert Record for BTRequests
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTChecklist]
	--@ChecklistKey INT,
	@EntityKey INT,
	@ChecklistFactKey INT,
	@ChecklistAnswer varchar(50),
	@ChecklistComment varchar(250),
	@ModifierName varchar(100)
	


AS

SET NOCOUNT ON

BEGIN TRY

DECLARE @ChecklistKey INT
DECLARE @DateChec
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
