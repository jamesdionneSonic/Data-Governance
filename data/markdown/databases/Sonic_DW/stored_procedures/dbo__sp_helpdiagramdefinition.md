---
name: sp_helpdiagramdefinition
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

	CREATE PROCEDURE dbo.sp_helpdiagramdefinition
	(
		@diagramname 	sysname,
		@owner_id	int	= null
	)
	WITH EXECUTE AS N'dbo'
	AS
	BEGIN
		set nocount on

		declare @theId 		int
		declare @IsDbo 		int
		declare @DiagId		int
		declare @UIDFound	int

		if(@diagramname is null)
		begin
			RAISERROR (N'E_INVALIDARG', 16, 1);
			return -1
		end

		execute as caller;
		select @theId = DATABASE_PRINCIPAL_ID();
		select @IsDbo = IS_MEMBER(N'db_owner');
		if(@owner_id is null)
			select @owner_id = @theId;
		revert;

		select @DiagId = diagram_id, @UIDFound = principal_id from dbo.sysdiagrams where principal_id = @owner_id and name = @diagramname;
		if(@DiagId IS NULL or (@IsDbo = 0 and @UIDFound <> @theId ))
		begin
			RAISERROR ('Diagram does not exist or you do not have permission.', 16, 1);
			return -3
		end

		select version, definition FROM dbo.sysdiagrams where diagram_id = @DiagId ;
		return 0
	END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
