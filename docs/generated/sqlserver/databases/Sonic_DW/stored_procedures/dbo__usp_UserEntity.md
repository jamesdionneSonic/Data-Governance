---
name: usp_UserEntity
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



CREATE PROCEDURE [dbo].[usp_UserEntity]
	@UEID int,  --ID Number to decide path of Stored Procedure 
	@EmployeeID int,
	@EntityKey int,
	@isActive bit,
	@isDefault bit,
	@isGM bit,
	@isController bit,
	@DOCPermissions int,
	@TitlePermissions int,
	@Name varchar(100) --Name of person changing record

AS
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY

	/*
	UEID Reference Guide:
	0 - Insert R
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
