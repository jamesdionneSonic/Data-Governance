---
name: usp_Dim_EchoPark_VehicleType
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




CREATE   PROCEDURE [dbo].[usp_Dim_EchoPark_VehicleType]
			@VehicleTypeID INT
			,@VehicleTypeDESC Varchar(50)
			,@IsActiveFlag INT = 1


AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Austin McNeill
    Create date:	8/10/2022
    Description:	Insert/Update records from Dim_EchoPark_VehicleType to add/ update vehicle types across
					all of Echo Park.
========================================================================================= */

BEGIN TRY


	---------------------------------------------------------------------------------------------------------------------------------
	-- INSERT NEW Vehicle Type
	---------------------------------------------------------------------------------------------------------------------------------

	IF @VehicleTypeID IS NULL

		BEGIN

			INSERT INTO Dim_EchoPark_VehicleType
			SELECT   (SELECT Max(VehicleTypeID) + 1 from Dim_EchoPark_VehicleType)
					,@VehicleTypeDESC
					,1

		END

	ELSE

	BEGIN

		IF (SELECT VehicleTypeID from Dim_EchoPark_VehicleType where VehicleTypeID = @VehicleTypeID) IS NULL

			BEGIN

				INSERT INTO Dim_EchoPark_VehicleType
				SELECT   @VehicleTypeID
						,@VehicleTypeDESC
						,1

			END

		ELSE

	---------------------------------------------------------------------------------------------------------------------------------
		-- UPDATE EXISTING VEHICLE TYPE
	---------------------------------------------------------------------------------------------------------------------------------

			BEGIN
				--Update existing Vehicle Type records
				UPDATE dbo.Dim_EchoPark_VehicleType
				SET VehicleTypeDESC = coalesce(@VehicleTypeDESC,''),
				[IsActive] = IsNull(@IsActiveFlag, 1)
				WHERE	VehicleTypeID = @VehicleTypeID

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
