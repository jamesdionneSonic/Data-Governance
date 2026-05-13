---
name: vw_Fact_TSD
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
CREATE VIEW dbo.vw_Fact_TSD
AS
SELECT        dbo.Fact_TSDTemp.FactTSDKey, dbo.Fact_TSDTemp.Unit, dbo.Fact_TSDTemp.Year, dbo.Fact_TSDTemp.Make, dbo.Fact_TSDTemp.Model, dbo.Fact_TSDTemp.VIN, dbo.Fact_TSDTemp.VehicleStatus,
                         dbo.Fact_TSDTemp.SubsidyStatus, dbo.Dim_TSDTemp.EntityKey, dbo.Dim_Vehicle.VehicleKey, dbo.Fact_TSDTemp.Datekey, 1 AS [RowCount]
FROM            dbo.Dim_TSDTemp INNER JOIN
                         dbo.Fact_TSDTemp ON dbo.Dim_TSDTemp.OEMTSD = dbo.Fact_TSDTemp.DealerNumber AND dbo.Dim_TSDTemp.Make = dbo.Fact_TSDTemp.Make LEFT OUTER JOIN
                         dbo.Dim_Vehicle ON dbo.Fact_TSDTemp.VIN = dbo.Dim_Vehicle.VehVIN

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
