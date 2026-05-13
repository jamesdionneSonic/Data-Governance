---
name: sp_dropdiagram
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - sysdiagrams
dependency_count: 1
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: Stored Procedure

- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.sysdiagrams** (U )

## Parameters

| Name           | Type    | Output | Default |
| -------------- | ------- | ------ | ------- |
| `@diagramname` | sysname | No     | No      |
| `@owner_id`    | int     | No     | No      |

## Definition

```sql

	CREATE PROCEDURE dbo.sp_dropdiagram
	(
		@diagramname 	sysname,
		@owner_id	int	= null
	)
	WITH EXECUTE AS 'dbo'
	AS
	BEGIN
		set nocount on
		declare @theId 			int
		declare @IsDbo 			int

		declare @UIDFound 		int
		declare @DiagId			int

		if(@diagramname is null)
		begin
			RAISERROR ('Invalid value', 16, 1);
			return -1
		end

		EXECUTE AS CALLER;
		select @theId = DATABASE_PRINCIPAL_ID();
		select @IsDbo = IS_MEMBER(N'db_owner');
		if(@owner_id is null)
			select @owner_id = @theId;
		REVERT;

		select @DiagId = diagram_id, @UIDFound = principal_id from dbo.sysdiagrams where principal_id = @owner_id and name = @diagramname
		if(@DiagId IS NULL or (@IsDbo = 0 and @UIDFound <> @theId))
		begin
			RAISERROR ('Diagram does not exist or you do not have permission.', 16, 1)
			return -3
		end

		delete from dbo.sysdiagrams where diagram_id = @DiagId;

		return 0;
	END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
