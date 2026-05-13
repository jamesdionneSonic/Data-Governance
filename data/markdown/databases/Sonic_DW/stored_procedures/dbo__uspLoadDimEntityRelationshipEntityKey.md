---
name: uspLoadDimEntityRelationshipEntityKey
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@worktable`            | varchar | No     | No      |
| `@RelationshipTypeGuid` | varchar | No     | No      |
| `@ColumnName`           | varchar | No     | No      |

## Definition

```sql

/* *******************************************************************************************************************/
/* Script name    |   [dbo].[uspLoadDimEntityRelationshipEntityKey]                                                     */
/* Purpose        |   This sp inserts data into DimEntityRelationship table  */
/* Date           |   2021-08-13	Change: Creation					                                          */
/* Author         |   Chaitra	                                                                                       */
/* Tables loaded  |   dbo.DimEntityRelationship                                                                      */
/* Date Modified  |   2021-09-23                                                                                              */
/* *******************************************************************************************************************/
CREATE


 PROCEDURE [dbo].[uspLoadDimEntityRelationshipEntityKey] (
	@worktable VARCHAR(50)
	,@RelationshipTypeGuid VARCHAR(2000)
	,@ColumnName VARCHAR(50)
	)
AS
BEGIN TRY
	BEGIN TRANSACTION

	BEGIN
		DECLARE @wrktbl VARCHAR(50) = @WorkTable;
		DECLARE @ColName VARCHAR(50) = @ColumnName;
		DECLARE @RelshipGuid VARCHAR(2000) = @RelationshipTypeGuid;
		DECLARE @ExecSQL NVARCHAR(4000);
		DECLARE @ParmDefinition NVARCHAR(500);

		SET @ParmDefinition = N'@RelationshipTypeGuid varchar(2000)';
		SET @ExecSQL = 'with MissingStoreID as(
			Select distinct StoreID AS Store_ID from ' + @wrktbl + ' with (nolock)
			)
		,
		exception as(
			Select distinct Store_ID from MissingStoreID with (nolock)
			except
			select distinct ' + @ColName + '
			from Sonic_DW.dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
			and IsActive=1
		)

		Insert into Sonic_DW.dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,' + @ColName +
			',[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid, e.EntityKey, src.Store_ID
			,NEWID(),GETDATE(), ''2099-12-31'', ''1'', GETDATE(), GETDATE(), USER_NAME() , USER_NAME()
		from exception  src
			join Sonic_DW.dbo.Dim_Entity e with (nolock)
				on src.Store_ID=EntSIMSStoreID
		where  e.EntActive=''Active''
			and e.EntDefaultDlrshpLvl1=1';

		EXECUTE sys.sp_executesql @ExecSQL
			,@ParmDefinition
			,@RelationshipTypeGuid = @RelshipGuid;
	END

	COMMIT TRANSACTION
END TRY

BEGIN CATCH
	DECLARE @Message VARCHAR(MAX) = ERROR_MESSAGE()
		,@Severity INT = ERROR_SEVERITY()
		,@State SMALLINT = ERROR_STATE();

	RAISERROR (
			@Message
			,@Severity
			,@State
			)

	ROLLBACK TRANSACTION
END CATCH;



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
