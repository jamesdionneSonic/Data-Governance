---
name: usp_DOC_Permissions
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
-- Create date: 8/10/2016
-- Description:	Insert Record for DOX_TXN_LOGIN
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Permissions]
	@LoginKey INT,
	@MicroStrategyLogin NVARCHAR(250),
	@EntityKey INT,
	@ReviewerFlag INT,
	@ControllerFlag INT,
	@UserLogin nvarchar(250),
	@RemoveFlag INT = 0

AS

DECLARE @AvailableSlot INT = (SELECT Min(LOGINKEY) FROM [dbo].[Doc_TXN_Log
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
