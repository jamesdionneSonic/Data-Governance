---
name: usp_Process_VehicleKey_NewVehicleKey
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


CREATE   PROCEDURE [dbo].[usp_Process_VehicleKey_NewVehicleKey]

AS

BEGIN

exec dbo.usp_Process_Dim_Vehicle_VehicleKey ;

exec dbo.usp_Process_DimVehicle_NewVehicleKey ;



END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
