---
name: usp_EPOpCodeBucket
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






CREATE PROCEDURE [dbo].[usp_EPOpCodeBucket]
	@OpCode varchar(50)
	,@OpCodeBucket varchar(100) NULL
	,@Meta_UserID varchar(100)
	,@OpCodeDesc varchar(255) NULL
	,@IsActive bit

AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Lexie McGillis
    Create date:	5/17/2021
	Update date:    7/28/2021
    Description:	Insert/Update records from dbo.Dim_EPOpCodeBucket_Transact to add OpCode 
					Buck
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
