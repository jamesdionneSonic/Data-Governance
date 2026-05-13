---
name: sp_creatediagram
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
parameter_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: Stored Procedure

- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.sysdiagrams** (U )

## Parameters

| Name           | Type      | Output | Default |
| -------------- | --------- | ------ | ------- |
| `@diagramname` | sysname   | No     | No      |
| `@owner_id`    | int       | No     | No      |
| `@version`     | int       | No     | No      |
| `@definition`  | varbinary | No     | No      |

## Definition

```sql

	CREATE PROCEDURE dbo.sp_creatediagram
	(
		@diagramname 	sysname,
		@owner_id		int	= null,
		@version 		int,
		@definition 	varbinary(max)
	)
	WITH EXECUTE AS 'dbo'
	AS
	BEGIN
		set nocount on

		declare @theId int
		declare @retval int
		declare @IsDbo	int
		declare @userName sysname
		if(@version is null or @diagramname is null)
		begin
			RAISERROR (N'E_INVALIDARG', 16, 1);
			return -1
		end

		execute as caller;
		select @theId = DATABASE_PRINCIPAL_ID();
		select @IsDbo = IS_MEMBER(N'db_owner');
		revert;

		if @owner_id is null
		begin
			select @owner_id = @theId;
		end
		else
		begin
			if @theId <> @owner_id
			begin
				if @IsDbo = 0
				begin
					RAISERROR (N'E_INVALIDARG', 16, 1);
					return -1
				end
				select @theId = @owner_id
			end
		end
		-- next 2 line only for test, will be removed after define name unique
		if EXISTS(select diagram_id from dbo.sysdiagrams where principal_id = @theId and name = @diagramname)
		begin
			RAISERROR ('The name is already used.', 16, 1);
			return -2
		end

		insert into dbo.sysdiagrams(name, principal_id , version, definition)
				VALUES(@diagramname, @theId, @version, @definition) ;

		select @retval = @@IDENTITY
		return @retval
	END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
