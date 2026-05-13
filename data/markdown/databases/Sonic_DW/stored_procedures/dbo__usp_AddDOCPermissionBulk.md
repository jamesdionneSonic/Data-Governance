---
name: usp_AddDOCPermissionBulk
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Doc_TXN_BulkPermissionAdd
dependency_count: 1
parameter_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Doc_TXN_BulkPermissionAdd** (U )

## Parameters

| Name         | Type    | Output | Default |
| ------------ | ------- | ------ | ------- |
| `@ID`        | char    | No     | No      |
| `@Associate` | varchar | No     | No      |
| `@Role`      | int     | No     | No      |
| `@User`      | varchar | No     | No      |

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
           ,[PermissionRole]
           ,[Meta_UserID])
     VALUES
           (@ID
           ,@Associate
           ,@Role
		   ,@User)

END


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
