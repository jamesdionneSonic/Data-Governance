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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
