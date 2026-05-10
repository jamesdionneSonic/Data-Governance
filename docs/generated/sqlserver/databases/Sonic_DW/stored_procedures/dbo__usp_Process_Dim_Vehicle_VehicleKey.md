---
name: usp_Process_Dim_Vehicle_VehicleKey
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






CREATE   PROCEDURE [dbo].[usp_Process_Dim_Vehicle_VehicleKey]

AS


BEGIN

DROP TABLE IF EXISTS #MissingVINS;

DROP TABLE IF EXISTS #MissingVINS_Final;


SELECT DV.VehicleKey
, DV.vehVIN
, vchl.lVehicleID as vchl_lVehicleID
, CAST(CASE WHEN vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%' AND LEN(LTRIM(RTRIM(vchl.szVIN))) = 17 THEN 1 ELSE 0 END as BIT) as IsValidVIN
, vchl.szVIN
, vchl.lMakeID
, vchl.szMake
, vchl.lModelID
, vchl.szModel
, vchl.szTrim
, vchl.nliClassID
, v
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
