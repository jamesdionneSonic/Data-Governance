---
name: usp_Dim_EchoPark_VehicleType
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




CREATE   PROCEDURE [dbo].[usp_Dim_EchoPark_VehicleType]		
			@VehicleTypeID INT
			,@VehicleTypeDESC Varchar(50)
			,@IsActiveFlag INT = 1
			

AS

SET NOCOUNT ON

/* =========================================================================================
    Author:			Austin McNeill
    Create date:	8/10/2022
    Description:	Insert/Update records from Dim_EchoPark_VehicleType to add/ update vehicle types across
					all of Echo Park.
====================================
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
