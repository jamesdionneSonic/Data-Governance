---
name: usp_Process_VehicleKey_NewVehicleKey
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - usp_Process_Dim_Vehicle_VehicleKey
  - usp_Process_DimVehicle_NewVehicleKey
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.usp_Process_Dim_Vehicle_VehicleKey** (P )
- **dbo.usp_Process_DimVehicle_NewVehicleKey** (P )

## Definition

```sql


CREATE   PROCEDURE [dbo].[usp_Process_VehicleKey_NewVehicleKey]

AS

BEGIN

exec dbo.usp_Process_Dim_Vehicle_VehicleKey ;

exec dbo.usp_Process_DimVehicle_NewVehicleKey ;



END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
