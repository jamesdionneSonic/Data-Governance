---
name: vw_Sales_NewUsed_view
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_DMSCustomer
  - DimVehicle
  - DimVehicleMake
  - DimVehicleModel
  - DimVin
  - FactFireSummary
  - vw_Dim_EntityMAR
dependency_count: 8
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_DMSCustomer** (U )
- **dbo.DimVehicle** (U )
- **dbo.DimVehicleMake** (U )
- **dbo.DimVehicleModel** (U )
- **dbo.DimVin** (U )
- **dbo.FactFireSummary** (U )
- **dbo.vw_Dim_EntityMAR** (V )

## Columns

| Name             | Type    | Nullable | Description |
| ---------------- | ------- | -------- | ----------- |
| `EntRegion`      | varchar | ✓        |             |
| `EntityKey`      | int     |          |             |
| `SaleDealership` | varchar | ✓        |             |
| `EntBrand`       | varchar | ✓        |             |
| `VIN`            | varchar |          |             |
| `DealType`       | varchar |          |             |
| `VehModelYear`   | int     | ✓        |             |
| `VehMakeDesc`    | varchar | ✓        |             |
| `VehModelDesc`   | varchar | ✓        |             |
| `CustomerZip`    | varchar | ✓        |             |
| `SourceType`     | varchar |          |             |
| `LeadProvider`   | varchar |          |             |
| `FullDate`       | date    |          |             |
| `DateKey`        | int     |          |             |

## Definition

```sql








CREATE VIEW [dbo].[vw_Sales_NewUsed_view]
AS
SELECT DISTINCT
                         e.EntRegion, e.EntityKey, e.EntDealerLvl1 AS SaleDealership, e.EntBrand, f.VIN, f.DealType, vv.ModelYear VehModelYear, vm.StandardMakeDescription VehMakeDesc, vmm.ModelDescription VehModelDesc,
						 LEFT(c.DMSCstAddressZipCode, 5) AS CustomerZip, 'Unknown' SourceType, 'Unknown'  LeadProvider,d.FullDate, d.DateKey
FROM            dbo.FactFireSummary AS f INNER JOIN
                         dbo.vw_dim_entitymar AS e ON e.EntityKey = f.EntityKey INNER JOIN
                         dbo.Dim_Date AS d ON d.DateKey = f.ContractDateKey LEFT OUTER JOIN
						 DimVin as dv on f.VIN = dv.VIN LEFT OUTER JOIN
						DimVehicle as vv on dv.vehiclekey = vv.vehiclekey LEFT OUTER JOIN
                         DimVehicleMake as vm on vv.VehicleMakeId = vm.VehicleMakeId LEFT OUTER JOIN
						 DimVehicleModel as vmm on  vv.VehicleModelId = vmm.VehicleModelId LEFT OUTER JOIN
                         dbo.Dim_DMSCustomer AS c ON c.DMSCustomerKey = f.DMSCustomerKey
WHERE        (d.FullDate   BETWEEN  cast(DATEADD(yy,-2,DATEADD(yy,DATEDIFF(yy,0,GETDATE()),0)) as date) AND CAST(DATEADD(day, - 1, GETDATE()) AS date))
AND (f.DealStatus in ('F', 'B')) AND
                         (f.StatCount = '1') and e.entlineofbusiness='Sonic'


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
