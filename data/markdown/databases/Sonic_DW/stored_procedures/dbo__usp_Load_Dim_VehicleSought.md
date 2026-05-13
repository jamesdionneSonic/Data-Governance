---
name: usp_Load_Dim_VehicleSought
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

CREATE PROCEDURE [dbo].[usp_Load_Dim_VehicleSought]
	@ExecutionID CHAR(10)
AS

	--update edw table from staging data

	MERGE dbo.DimVehicleSought AS vhc
	USING ETL_Staging.clean.DimVehicleSought AS src
	ON vhc.Make = src.Make
		AND vhc.model = src.model
		AND vhc.style = src.style
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
		AND src.Meta_ActionFlag = 0
		AND src.ETLExecution_ID = @ExecutionID
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
				'',
				src.Meta_LoadDate,
				@ExecutionID);

		-- locate all vehicle records to be deleted
		SELECT (UPPER(LTRIM(RTRIM(vhc.Make))) + UPPER(LTRIM(RTRIM(vhc.Model))) + UPPER(LTRIM(RTRIM(vhc.Trim))) +
			  cast(vhc.NewUsed as varchar) + cast(vhc.modelYear as varchar) + cast(vhc.modelYearFrom as varchar) +
						 cast(vhc.modelYearTo as varchar)) as Meta_NaturalKey
		INTO #vhc
		FROM
		(SELECT  distinct
			  ISNULL(vs.[szMake], 'UNKNOWN') as Make
			  ,ISNULL(vs.[szModel], 'UNKNOWN') as Model
			  ,ISNULL(vs.[szStyle], 'UNKNOWN') as Style
			  ,ISNULL(vs.[szTrim], 'UNKNOWN') as Trim
			  ,CAST((case when vs.bNewUsed = 1 then 0 else 1 end) AS SMALLINT) as NewUsed
			  ,ISNULL(datepart(year,vs.[dtModelYear]), 1900) as ModelYear
			  ,ISNULL(datepart(year,vs.[dtModelYearFrom]), 1900) as ModelYearFrom
			  ,ISNULL(datepart(year,vs.[dtModelYearTo]), 1900) as ModelYearTo
		  FROM ETL_Staging.dbo.dwFullVehicleSought vs inner join ETL_Staging.dbo.dwFullOpportunity opp
	 			on vs.ldealid = opp.lDealID
					and vs.ETLExecution_ID = @ExecutionID
		  WHERE vs.dwActive = 0) vhc


		-- soft delete records which have been marked to remove
		UPDATE opp
			set Meta_RowIsCurrent = 'N'
		FROM dbo.DimVehicleSought opp inner join #vhc vhc
				on opp.Meta_NaturalKey = vhc.Meta_NaturalKey
					and opp.Meta_SourceSystemName = 'eLeadDW'

		DROP TABLE #vhc














```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
