---
name: vw_DimVehicleBridge
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

2- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_DimVehicleBridge]
AS
SELECT 
VehicleKey, 
StandardMakeDescription, 
MakeDescription, 
a.SourceMakeCode, 
ModelDescription, 
ModelCategory,
ModelSubCategory, 
SourceModelCode, 
SeriesDescription, 
StandardSeriesDescription, 
Vin, 
TrimDescription, 
StandardTrimDescription, 
SourceTrimCode, 
Dim_VehicleKey, 
a.VehMakeDesc, 
a.VehModelCode, 
a.VehModelDesc, 
VehModelYear, 
VehSeriesCode, 
VehSeriesDesc, 
StockNumber, 
FuelTypeDescription, 
StandardF
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
