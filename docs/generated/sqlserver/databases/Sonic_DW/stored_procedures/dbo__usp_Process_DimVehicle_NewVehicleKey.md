---
name: usp_Process_DimVehicle_NewVehicleKey
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


CREATE   PROCEDURE [dbo].[usp_Process_DimVehicle_NewVehicleKey] 

AS

BEGIN

DROP TABLE IF EXISTS #MissingVINS ;

DROP TABLE IF EXISTS #MissingVINS_Final;


select FCT.FactOpportunityKey
, VIN.Vin
, VIN.IsActiveVin
, VIN.IsValidVIN
, LTRIM(RTRIM(vchl.szVIN)) as OppVIN
, CAST(CASE WHEN vchl.szVIN NOT LIKE '%[^A-Za-z0-9]%' AND LEN(LTRIM(RTRIM(vchl.szVIN))) = 17 THEN 1 ELSE 0 END as BIT) as OppIsValidVIN
, VIN.eLeadVehID
, vchl.szVIN
, vchl.lMakeID
, vchl.szMake
, vchl.lMod
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
