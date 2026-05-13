---
name: usp_DOC_Permissions
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Doc_TXN_Login
dependency_count: 1
parameter_count: 7
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Doc_TXN_Login** (U )

## Parameters

| Name                  | Type     | Output | Default |
| --------------------- | -------- | ------ | ------- |
| `@LoginKey`           | int      | No     | No      |
| `@MicroStrategyLogin` | nvarchar | No     | No      |
| `@EntityKey`          | int      | No     | No      |
| `@ReviewerFlag`       | int      | No     | No      |
| `@ControllerFlag`     | int      | No     | No      |
| `@UserLogin`          | nvarchar | No     | No      |
| `@RemoveFlag`         | int      | No     | No      |

## Definition

```sql

-- =============================================
-- Author:		Jonathan Henin
-- Create date: 8/10/2016
-- Description:	Insert Record for DOX_TXN_LOGIN
-- =============================================
CREATE PROCEDURE [dbo].[usp_DOC_Permissions]
	@LoginKey INT,
	@MicroStrategyLogin NVARCHAR(250),
	@EntityKey INT,
	@ReviewerFlag INT,
	@ControllerFlag INT,
	@UserLogin nvarchar(250),
	@RemoveFlag INT = 0

AS

DECLARE @AvailableSlot INT = (SELECT Min(LOGINKEY) FROM [dbo].[Doc_TXN_Login] WHERE MicroStrategyLogin = 'AVAILABLE')
DECLARE @LoginKeyCheck INT = (SELECT LoginKey FROM [dbo].[Doc_TXN_Login] WHERE MicroStrategyLogin = @MicroStrategyLogin AND EntityKey = @EntityKey)

SET NOCOUNT ON

BEGIN TRY

	IF @RemoveFlag = 1 AND @LoginKey <> -1

		BEGIN

		UPDATE [DBO].[Doc_TXN_Login]
			SET  MicroStrategyLogin = 'AVAILABLE'
				,ReviewerFlag = 0
				,ControllerFlag = 0
			WHERE LoginKey = @LoginKey

		END

	ELSE

		IF @LoginKey <> -1 OR @LoginKeyCheck IS NOT NULL

			BEGIN

				UPDATE [DBO].[Doc_TXN_Login]
				SET  MicroStrategyLogin = @MicroStrategyLogin
					,EntityKey = @EntityKey
					,ReviewerFlag = @ReviewerFlag
					,ControllerFlag = @ControllerFlag
				WHERE LoginKey = @LoginKey

			END

		ELSE

			BEGIN

			IF @AvailableSlot IS NULL

				INSERT INTO [dbo].[Doc_TXN_Login]
			   ([MicroStrategyLogin]
			   ,[EntityKey]
			   ,[ReviewerFlag]
			   ,[ControllerFlag])
				VALUES
			   (@MicroStrategyLogin,
				@EntityKey,
				IsNull(@ReviewerFlag,0),
				IsNull(@ControllerFlag,0))

			ELSE

				UPDATE [DBO].[Doc_TXN_Login]
				SET  MicroStrategyLogin = @MicroStrategyLogin
					,EntityKey = @EntityKey
					,ReviewerFlag = IsNull(@ReviewerFlag,0)
					,ControllerFlag = IsNull(@ControllerFlag,0)
				WHERE LoginKey = @AvailableSlot

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
