---
name: usp_UpdateLateArrivingDimensionsin_Fact_Service
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

CREATE PROC usp_UpdateLateArrivingDimensionsin_Fact_Service
AS
BEGIN
	BEGIN TRY
		BEGIN TRAN

			UPDATE TGT SET
			VehicleKey = SRC.VehicleKey
			FROM Sonic_DW.dbo.Fact_Service as TGT WITH (NOLOCK)
			INNER JOIN Sonic_DW.dbo.Dim_Vehicle as SRC WITH (NOLOCK)
			ON TGT.VIN = SRC.VehVIN
			WHERE TGT.vehiclekey = -1
			and TGT.Vin is not null ;

			UPDATE TGT SET
			NewVehicleKey = SRC.VehicleKey
			FROM Sonic_DW.dbo.Fact_Service as TGT WITH (NOLOCK)
			INNER JOIN Sonic_DW.dbo.DimVIN as SRC with (nolock)
			ON TGT.vin = SRC.Vin
			WHERE TGT.NewVehicleKey = -1
			and TGT.Vin is not null ;

		COMMIT TRAN
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;

		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;

		SELECT @ErrorMessage = ERROR_MESSAGE()
			,@ErrorSeverity = ERROR_SEVERITY()
			,@ErrorState  = ERROR_STATE();

		RAISERROR (
			@ErrorMessage
			,-- Message text.
			@ErrorSeverity
			,-- Severity.
			@ErrorState -- State.
			);
	END CATCH
END
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
