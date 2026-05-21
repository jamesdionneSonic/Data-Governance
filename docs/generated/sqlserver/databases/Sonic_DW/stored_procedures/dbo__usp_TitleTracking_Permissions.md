---
name: usp_TitleTracking_Permissions
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql






/* =========================================================================================
    Author:			Lexie McGilis
    Create date:	2/17/2020
    Description:	Insert/Update/Delete records for dim_UserEntity for TitleTracking
========================================================================================= */


CREATE PROCEDURE [dbo].[usp_TitleTracking_Permissions]
	@UserEntityKey INT,
	@EmployeeID INT,
	@EntityKey INT,
	@UE_isActive BIT,
	@UE_IsDefault BIT,
	@UE_IsGM BIT,
	@UE_IsController BIT,
	@UE_DOCPermission INT,
	@Meta_LastChangeUserName VARCHAR(50),
	@UE_TitleTrackingPermission INT

AS

SET NOCOUNT ON

BEGIN TRY

	DECLARE @OriginalDefaultEntity int
	DECLARE @UserEntityKeyValue int

	---------------------------------------------------------------------------------------------------------------------------------
	-- IF MULTIPLE DEFAULT RECORDS, UPDATE ALL BUT THE MOST RECENT TO NOT BE THE DEFAULT
	---------------------------------------------------------------------------------------------------------------------------------

	UPDATE Dim_UserEntity
	SET UE_IsDefault = 0
	WHERE UserEntityKey IN (SELECT UserEntityKey
							FROM (SELECT UserEntityKey,  ROW_NUMBER() OVER (ORDER BY Meta_RowLastChangedDate DESC, UserEntityKey DESC) AS RowNumber FROM Dim_UserEntity WHERE UE_isDefault=1 and UE_isActive =1 and EmployeeID = @EmployeeID) a1
							WHERE RowNumber <>1 )

	---------------------------------------------------------------------------------------------------------------------------------
	-- DELETE DUPLICATE EMPLOYEE / ENTITY RECORDS
	---------------------------------------------------------------------------------------------------------------------------------

	DELETE FROM Dim_UserEntity
	WHERE USERENTITYKEY IN (SELECT UserEntityKey
							FROM (SELECT UserEntityKey, ROW_NUMBER () OVER (PARTITION BY  EntityKey ORDER BY Meta_RowLastChangedDate DESC, UserEntityKey DESC) AS RowNumber FROM Dim_UserEntity WHERE EmployeeID = @EmployeeID ) a2
							WHERE RowNumber <>1)

	---------------------------------------------------------------------------------------------------------------------------------
	-- ADD / UPDATE USER ENTITY RECORDS
	---------------------------------------------------------------------------------------------------------------------------------
	--Is there a record for the entity/user combination?
	IF (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID= @EmployeeID and EntityKey = @EntityKey) IS NULL

		BEGIN

			--If there is no entity/user record, is there a different default store set for that employee?
			IF (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND UE_isDefault = 1) IS NULL

				--Insert new user/entity record where there is no default set.
				BEGIN
					INSERT INTO [dbo].[Dim_UserEntity]
					SELECT  @EmployeeID,
							@EntityKey,
							1, --@UE_isActive
							1, --@UE_IsDefault
							coalesce(@UE_IsGM,0),
							coalesce(@UE_IsController,0),
							coalesce(@UE_DOCPermission,0),
							getdate(), --@Meta_RowCreatedDate
							getdate(), --@Meta_RowLastChangedDate
							@Meta_LastChangeUserName,
							coalesce(@UE_TitleTrackingPermission,0)
				END
			ELSE

				--Insert new user/entity record where there is already a default entity for the user.
				BEGIN
					IF @UE_IsDefault = 1
						BEGIN
							SET @OriginalDefaultEntity = (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND UE_isDefault = 1)  --Get original default store

							--Update original default entity to no longer be a default.
							UPDATE [dbo].[Dim_UserEntity]
							SET [UE_isDefault] = 0
								,[UE_isActive]=@UE_isActive
								,[Meta_RowLastChangedDate] = GetDate()
								,[Meta_LastChangeUserName] = @Meta_LastChangeUserName
							WHERE UserEntityKey = @OriginalDefaultEntity

							--Insert new default record.
							INSERT INTO [dbo].[Dim_UserEntity]
							SELECT  @EmployeeID,
									@EntityKey,
									1, --@UE_isActive
									1, --@UE_IsDefault
									coalesce(@UE_IsGM,0),
									coalesce(@UE_IsController,0),
									coalesce(@UE_DOCPermission,0),
									getdate(), --@Meta_RowCreatedDate
									getdate(), --@Meta_RowLastChangedDate
									@Meta_LastChangeUserName,
									coalesce(@UE_TitleTrackingPermission,0)
						END
					ELSE

						--Insert a new record that is not a default.
						BEGIN
							INSERT INTO [dbo].[Dim_UserEntity]
							SELECT  @EmployeeID,
									@EntityKey,
									1, --@UE_isActive
									0, --@UE_IsDefault
									coalesce(@UE_IsGM,0),
									coalesce(@UE_IsController,0),
									coalesce(@UE_DOCPermission,0),
									getdate(), --@Meta_RowCreatedDate
									getdate(), --@Meta_RowLastChangedDate
									@Meta_LastChangeUserName,
									coalesce(@UE_TitleTrackingPermission,0)
						END
				END
		END
	ELSE

		--Update existing user/entity record
		BEGIN

			--If updating an existing user/entity record to be the default, clear the old default and update the new record.
			IF @UE_IsDefault = 1
				BEGIN
					SET @OriginalDefaultEntity = (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND UE_isDefault = 1)  --Get original default store

					--Update original default entity to no longer be a default.
					UPDATE [dbo].[Dim_UserEntity]
					SET [UE_isDefault] = 0
						,[UE_isActive]=@UE_isActive
						,[Meta_RowLastChangedDate] = GetDate()
						,[Meta_LastChangeUserName] = @Meta_LastChangeUserName
					WHERE UserEntityKey = @OriginalDefaultEntity

					SET @UserEntityKeyValue = (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND EntityKey = @Entitykey )

					--Update the new default record.
					UPDATE [dbo].[Dim_UserEntity]
					SET UE_isActive = 1,
						UE_IsDefault = 1,
						UE_isGM = coalesce(@UE_IsGM,0),
						UE_IsController = coalesce(@UE_IsController,0),
						UE_DOCPermission = coalesce(@UE_DOCPermission,0),
						Meta_RowLastChangedDate = getdate(),
						Meta_LastChangeUserName = @Meta_LastChangeUserName,
						UE_TitleTrackingPermission = coalesce(@UE_TitleTrackingPermission,0)
					WHERE UserEntityKey = @UserEntityKeyValue
				END
			ELSE

				--If updating an existing user/entity record and not changing the default.
				BEGIN

				SET @UserEntityKeyValue = (SELECT UserEntityKey FROM [dbo].[Dim_UserEntity] WHERE EmployeeID = @EmployeeID AND EntityKey = @Entitykey )

					UPDATE [dbo].[Dim_UserEntity]
					SET UE_isActive = @UE_isActive,
						UE_isGM = coalesce(@UE_IsGM,0),
						UE_IsController = coalesce(@UE_IsController,0),
						UE_DOCPermission = coalesce(@UE_DOCPermission,0),
						Meta_RowLastChangedDate = getdate(),
						Meta_LastChangeUserName = @Meta_LastChangeUserName,
						UE_TitleTrackingPermission = coalesce(@UE_TitleTrackingPermission,0)
					WHERE UserEntityKey = @UserEntityKeyValue
				END
		END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
