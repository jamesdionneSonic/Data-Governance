---
name: usp_Load_DimVehicleSought
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
















--/************************************************************
----
---- Created By Umberto Sartori 01-22-2016
---- MERGE statement to load Dim_VehicleSought table
----	1/25/2016 ubs - Add ExecutionID parm from SSIS proc call
----    1/29/2016 ubs - Updated MERGE source table for change of table name
--**********************************************************

CREATE PROCEDURE [dbo].[usp_Load_DimVehicleSought] (@ExecutionID CHAR(10))
AS

	--update edw
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
