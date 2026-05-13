---
name: usp_TEST_SSIS_CALL
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE usp_TEST_SSIS_CALL (@StartDateKey int, @EndDateKey int)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	update sonic_dw.dbo.dim_FIGLAccounts_bak_20110920 set FIGLProductCategoryKey = 1
    -- Insert statements for procedure here
	return
END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
