---
name: usp_EPOpCodeBucket
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_EPOpCodeBucket_Transact
dependency_count: 1
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_EPOpCodeBucket_Transact** (U )

## Parameters

| Name            | Type    | Output | Default |
| --------------- | ------- | ------ | ------- |
| `@OpCode`       | varchar | No     | No      |
| `@OpCodeBucket` | varchar | No     | No      |
| `@Meta_UserID`  | varchar | No     | No      |
| `@OpCodeDesc`   | varchar | No     | No      |
| `@IsActive`     | bit     | No     | No      |

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
					Bucket/Description for each OpCode. Since the opcodes are standardized across all of
					EchoPark, the OpCode bucket and description is at the OpCode, not OpCodeKey level.
					This transaction pulls in the first non-null definition of an OpCode unless edited
					by the end user.
========================================================================================= */


BEGIN TRY


	---------------------------------------------------------------------------------------------------------------------------------
	-- INSERT NEW OPCODE BUCKET
	---------------------------------------------------------------------------------------------------------------------------------

	IF (SELECT OpCode from dbo.Dim_EPOpCodeBucket_Transact where OpCode = @OpCode) IS NULL

		BEGIN

			INSERT INTO dbo.Dim_EPOpCodeBucket_Transact
			SELECT  @OpCode
					,coalesce(@OpCodeBucket,'')
					,@Meta_UserID
					,getdate()  --Meta_RowLastChangedDate
					,coalesce(@OpCodeDesc,'')
					,coalesce(@IsActive,0)

		END

	ELSE
	---------------------------------------------------------------------------------------------------------------------------------
	-- UPDATE EXISTING OPCODE BUCKET
	---------------------------------------------------------------------------------------------------------------------------------

		BEGIN
			--Update existing OpCode Bucket records
			UPDATE dbo.Dim_EPOpCodeBucket_Transact
			SET  OpCodeBucket = coalesce(@OpCodeBucket,'')
				,Meta_UserID = @Meta_UserID
				,Meta_RowLastChangedDate = getdate()
				,OpCodeDesc = coalesce(@OpCodeDesc,'')
				,IsActive = coalesce(@IsActive,0)
			WHERE OpCode = @OpCode
			and		(coalesce(OpCodeBucket,'') <> coalesce(@OpCodeBucket,'')
					or coalesce(OpCodeDesc,'') <> coalesce(@OpCodeDesc,'')
					or coalesce(IsActive,0) <> coalesce(@IsActive,0))
		END



END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
