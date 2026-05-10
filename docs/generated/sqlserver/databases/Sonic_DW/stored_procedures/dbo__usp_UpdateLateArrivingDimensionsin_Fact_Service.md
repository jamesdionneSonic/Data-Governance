---
name: usp_UpdateLateArrivingDimensionsin_Fact_Service
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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
			INNER JOIN Sonic_DW.dbo.D
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
