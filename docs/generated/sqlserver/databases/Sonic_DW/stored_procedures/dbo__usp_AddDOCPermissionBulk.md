---
name: usp_AddDOCPermissionBulk
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
-- Create date: 2019 Dec, 03
-- Description:	Insert a Record into table Doc_TXN_BulkPermissionAdd
-- =============================================

CREATE PROCEDURE [dbo].[usp_AddDOCPermissionBulk] 
	@ID char(20),
	@Associate varchar(50),
	@Role int,
	@User varchar(50)
AS
BEGIN

INSERT INTO [dbo].[Doc_TXN_BulkPermissionAdd]
           ([BulkUniqueTimeStampID]
           ,[AssociateName]
           
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
