---
name: vwDimVehicle_cattest
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql





CREATE VIEW [dbo].[vwDimVehicle_cattest] AS
SELECT	/* vin records */ 
		[vin].[VehicleKey], [vin].[Vin]
		, CASE WHEN [vin].[IsActiveVin] = 1 THEN 'Y' ELSE 'N' END AS IsActiveVin
		, [vin].[IsValidVin]
		
		/* vehicle records */
		, [bs].[VehicleBodyStyleId]
		, [bs].[BodyStyleDescription]
		, [bs].[StandardBodyStyle]

		, [cab].[VehicleCabId]
		, [cab].[CabDescription]
		, [cab].[StandardCabDescription] 

		, [cat].[VehicleCategoryId]
		, [cat].[CategoryDescription]
	
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
