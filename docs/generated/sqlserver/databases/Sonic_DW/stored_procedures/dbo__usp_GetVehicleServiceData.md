---
name: usp_GetVehicleServiceData
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
CREATE PROCEDURE [dbo].[usp_GetVehicleServiceData]
(@lastloaddate    INT,
 @maxclosedatekey INT
)
AS
     BEGIN      
        --- OPEN RO    

         INSERT INTO ETL_Staging.dbo.stgEleadVehicleServiceExport
         ([Name-File],
          LastName,
          FirstName,
          [Address],
          City,
          Zip,
          Email,
          HomePhone,
          CellPhone,
          DMSID,
          VIN,
          MaxRONumber,
          DateKey,
          RN
      
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
