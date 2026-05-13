---
name: usp_Load_DimVehicleSought
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimVehicleSought
dependency_count: 1
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimVehicleSought** (U )

## Parameters

| Name           | Type | Output | Default |
| -------------- | ---- | ------ | ------- |
| `@ExecutionID` | char | No     | No      |

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

	--update edw table from staging data

	MERGE dbo.DimVehicleSought AS vhc
	USING ETL_Staging.clean.DimVehicleSought AS src
	ON vhc.Make = src.Make
		AND vhc.model = src.model
		--AND vhc.style = src.style
		AND vhc.Trim = src.Trim
		AND vhc.NewVehicleFlag = src.NewUsed
		AND vhc.ModelYear = src.ModelYear
		AND vhc.ModelYearFrom = src.ModelYearFrom
		AND vhc.ModelYearTo = src.ModelYearTo
	WHEN MATCHED
		AND src.Meta_ActionFlag = 1
		AND src.ETLExecution_ID = @ExecutionID
		AND isnull(vhc.Style, 'UNKNOWN') <> isnull(src.Style, 'UNKNOWN')
		THEN UPDATE
			SET	vhc.Style = src.Style
				,vhc.Meta_RowLastChangedDate = src.Meta_RowLastChangeDate
				,vhc.ETLExecution_ID = @ExecutionID
	WHEN NOT MATCHED
		THEN INSERT (
				Make,
				model,
				style,
				Trim,
				NewVehicleFlag,
				ModelYear,
				ModelYearFrom,
				ModelYearTo,
				Meta_SrcSysID,
				Meta_SourceSystemName,
				Meta_ComputerName,
				[User_ID],
				Meta_RowEffectiveDate,
				Meta_RowExpiredDate,
				Meta_RowIsCurrent,
				Meta_RowLastChangedDate,
				Meta_AuditKey,
				Meta_AuditScore,
				Meta_NaturalKey,
				Meta_LoadDate,
				ETLExecution_ID)
		 VALUES (
				src.Make,
				src.model,
				src.style,
				src.Trim,
				src.NewUsed,
				src.ModelYear,
				src.ModelYearFrom,
				src.ModelYearTo,
				src.Meta_SrcSysID,
				src.Meta_SourceSystemName,
				src.Meta_ComputerName,
				src.[User_ID],
				src.Meta_RowEffectiveDate,
				src.Meta_RowExpiredDate,
				src.Meta_RowIsCurrent,
				src.Meta_RowLastChangeDate,
				-1,
				-1,
				src.Meta_Naturalkey,
				src.Meta_LoadDate,
				@ExecutionID);
















```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
