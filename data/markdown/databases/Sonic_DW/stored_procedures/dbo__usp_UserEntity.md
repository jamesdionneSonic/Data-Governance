---
name: usp_UserEntity
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_UserEntity
dependency_count: 1
parameter_count: 10
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_UserEntity** (U )

## Parameters

| Name                | Type    | Output | Default |
| ------------------- | ------- | ------ | ------- |
| `@UEID`             | int     | No     | No      |
| `@EmployeeID`       | int     | No     | No      |
| `@EntityKey`        | int     | No     | No      |
| `@isActive`         | bit     | No     | No      |
| `@isDefault`        | bit     | No     | No      |
| `@isGM`             | bit     | No     | No      |
| `@isController`     | bit     | No     | No      |
| `@DOCPermissions`   | int     | No     | No      |
| `@TitlePermissions` | int     | No     | No      |
| `@Name`             | varchar | No     | No      |

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
	0 - Insert Record
	1 - Add or Update Default Store Record for User

	*/
	DECLARE @OriginalDefaultEntity int

	--INSERT new record
	IF @UEID = 0
		BEGIN
			INSERT INTO [dbo].[Dim_UserEntity]
				SELECT	@EmployeeID,
						@EntityKey,
						@isActive,
						@isDefault,
						@isGM,
						@isController,
						@DOCPermissions,
						GetDate(),
						GetDate(),
						@Name,
						@TitlePermissions
		END
	ELSE IF @UEID = 1
		BEGIN
			--Check to see if a User already has a default store record
			IF (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND UE_isDefault = 1) IS NULL
				BEGIN
					--If no default store record, add the default store row
					INSERT INTO [dbo].[Dim_UserEntity]
						SELECT	@EmployeeID,
								@EntityKey,
								@isActive,
								1, --@isDefault
								@isGM,
								@isController,
								@DOCPermissions,
								GetDate(),
								GetDate(),
								@Name,
								@TitlePermissions
				END
			--If the User already has a default store record:
			ELSE
				BEGIN
					SET @OriginalDefaultEntity = (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND UE_isDefault = 1)  --Get original default store

					--Update Original Default store record to no longer be a default
					UPDATE [dbo].[Dim_UserEntity]
					   SET [UE_isDefault] = 0
						  ,[Meta_RowLastChangedDate] = GetDate()
						  ,[Meta_LastChangeUserName] = @Name
					 WHERE UserEntityKey = @OriginalDefaultEntity

					 --Check to see if there exists a store record for that user already:
					 IF (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND EntityKey = @EntityKey) IS NULL  --If no store currently exists, insert new record
						BEGIN
							INSERT INTO [dbo].[Dim_UserEntity]
							SELECT	@EmployeeID,
									@EntityKey,
									@isActive,
									1, --@isDefault
									@isGM,
									@isController,
									@DOCPermissions,
									GetDate(),
									GetDate(),
									@Name,
									@TitlePermissions

						END
					ELSE --If a record does exist, update existing record.
						BEGIN
							UPDATE [dbo].[Dim_UserEntity]
							   SET [UE_isDefault] = 1
								  ,[Meta_RowLastChangedDate] = GetDate()
								  ,[Meta_LastChangeUserName] = @Name
							 WHERE EmployeeID = @EmployeeID AND EntityKey = @EntityKey
						END

				END
		END

	END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
