---
name: usp_BTChecklistRecord
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
-- Create date: 12/13/2018
-- Description:	Insert/Update Record for BTChecklistRecord
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTChecklistRecord]
	@EntityKey INT,
	@Reviewer VARCHAR(50),
	@StartFinishFlag INT -- 0 = Insert a New Record, 1 = Update Existing Record

AS

SET NOCOUNT ON

BEGIN TRY

--Check to see if a Record exists for selected store and date
DECLARE
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
