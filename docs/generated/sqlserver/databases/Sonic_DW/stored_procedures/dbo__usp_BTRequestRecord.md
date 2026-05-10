---
name: usp_BTRequestRecord
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
-- Description:	Insert Record for DBTRequestsRecord
-- =============================================
CREATE PROCEDURE [dbo].[usp_BTRequestRecord]
	@EntityKey INT,
	@MicroStrategyLogin NVARCHAR(250),
	@GMName NVARCHAR(250)

AS

SET NOCOUNT ON

BEGIN TRY

DECLARE @BTKey INT = (SELECT BTKey FROM dbo.BT_RequestsRecord WHERE EntityKey = @EntityKey AND DateKey = (CONVERT([varchar](10
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
