---
name: usp_DimVin
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimVin
  - SynWrkDimVehicleInventoryVins
  - SynWrkDimVehicleVehicle
dependency_count: 3
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimVin** (U )
- **dbo.SynWrkDimVehicleInventoryVins** (SN)
- **dbo.SynWrkDimVehicleVehicle** (SN)

## Parameters

| Name               | Type | Output | Default |
| ------------------ | ---- | ------ | ------- |
| `@InsertedRowCnts` | int  | Yes    | No      |
| `@UpdatedRowCnts`  | int  | Yes    | No      |

## Definition

```sql

/* ************************************************************************************ */
/* Author: Jo Carter	Date: 2018-01-17	Change: Creation							*/
/* Change: Jo Carter	Date: 2018-06-14	Change: Add columns for Sims				*/
/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[usp_DimVin]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;

/* variables */
DECLARE @RowCounts TABLE (MergeAction VARCHAR(20));



/* ************************************************************************************ */
/* process Vin Valid Status *********************************************************** */
/* 1. Must be 17 Characters *********************************************************** */
/* 2. Can only have 0-9 and A-Z values ************************************************ */
/* ************************************************************************************ */

UPDATE	[SynWrkDimVehicleVehicle]
SET		[IsValidVin] = CASE WHEN LEN([vin]) != 17 THEN 'N'
							WHEN [vin] NOT LIKE '%[^A-Za-z0-9]%' THEN 'Y'
							ELSE 'N' END;

/* ************************************************************************************ */
/* process DMS (Service) records ****************************************************** */
/* Lowest weight because of freeform with little to no mapping/validation ************* */
/* ************************************************************************************ */
MERGE	[dbo].[DimVin] AS [tgt]
USING	(
		SELECT	[src].[Vin]
				, [src].[IsValidVin]
				, 1 AS [DMSVehId] -- dmsvehid is a one way value - without a daily historical loads it cant be maintainted
				, [src].[ETLExecution_ID]
				, [src].[Meta_ComputerName]
				, [src].[Meta_Src_Sys_ID]
				, [src].[Meta_SourceSystemName]
				, [src].[Meta_UserID]
		FROM	[SynWrkDimVehicleVehicle] AS src
		WHERE	[src].[Meta_Src_Sys_ID] = 1
		) AS [src]
		ON [tgt].[Vin] = [src].[VIN]

/* Found in DMS tables - Update record */
WHEN MATCHED AND [tgt].[DmsVehID] != [src].[DmsVehID]
	THEN UPDATE SET
		[tgt].[IsActiveVin]				= 1
		, [tgt].[DmsVehID]				= [src].[DMSVehId]
		, [tgt].[ETLExecution_ID]		= [src].[ETLExecution_ID]
		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
		, [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_SourceSystemName] = [src].[Meta_SourceSystemName]
		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]

/* VIN not found - write new record */
WHEN NOT MATCHED THEN INSERT (
	[Vin]
	, [IsActiveVin]
	, [IsValidVin]
	, [DmsVehID]
	, [WebVVehID]
	, [EPVehID]
	, [SimsVehId]
	, [SimsEPVehId]
	, [VehicleMartId]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_Src_Sys_ID]
	, [Meta_SourceSystemName]
	, [Meta_UserID]
	)
	VALUES (
		[src].[Vin]
		, 1 --- [IsActiveVin]
		, [src].[IsValidVin]
		,  [src].[DMSVehID]
		, -1 ---[WebVVehID]
		, -1 ---[EPVehID]
		, -1 ---[SimsVehId]
		, -1 ---[SimsEPVehId]
		, -1 ---[VehicleMartId]
		, [src].[ETLExecution_ID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_Src_Sys_ID]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_UserID]
	)
OUTPUT $ACTION INTO @rowcounts;

/* Purge Vins Missing from Source */
UPDATE	[tgt]
SET		[tgt].[DMSVehID] = -1
from	[dbo].[DimVin] AS tgt
WHERE	[tgt].[DMSVehID] != -1
		AND NOT EXISTS (
						SELECT	1
						FROM	[SynWrkDimVehicleInventoryVins] AS src
						WHERE	[tgt].[Vin] = [src].[Vin]
								AND [src].[Meta_Src_Sys_ID] = 1
						);




/* ************************************************************************************ */
/* process WebV records *************************************************************** */
/* 2nd highest wieght - Retail information ******************************************** */
/* ************************************************************************************ */
MERGE	[dbo].[DimVin] AS [tgt]
USING	(
		SELECT	[src].[Vin]
				, [src].[IsValidVin]
				, [src].[WebvVehID]
				, [src].[ETLExecution_ID]
				, [src].[Meta_ComputerName]
				, [src].[Meta_Src_Sys_ID]
				, [src].[Meta_SourceSystemName]
				, [src].[Meta_UserID]
		FROM	[SynWrkDimVehicleVehicle] AS src
		WHERE	[src].[Meta_Src_Sys_ID] = 32
		) AS [src]
		ON [tgt].[Vin] = [src].[VIN]

/* VIN is the same but WebV Vehicle ID is different - Update record */
WHEN MATCHED AND ([tgt].[WebVVehID]	!= [src].[WebvVehID])
	THEN UPDATE SET
		[tgt].[WebVVehID]				= [src].[WebvVehID]
		, [tgt].[IsActiveVin]			= 1
		, [tgt].[ETLExecution_ID]		= [src].[ETLExecution_ID]
		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
		, [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_SourceSystemName]	= [src].[Meta_SourceSystemName]
		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]

/* VIN not found - write new record */
WHEN NOT MATCHED BY TARGET
	THEN INSERT (
	[Vin]
	, [IsActiveVin]
	, [IsValidVin]
	, [DmsVehID]
	, [WebVVehID]
	, [EPVehID]
	, [SimsVehId]
	, [SimsEPVehId]
	, [VehicleMartId]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_Src_Sys_ID]
	, [Meta_SourceSystemName]
	, [Meta_UserID]
	)
	VALUES (
		[src].[Vin]
		, 1	--- [IsActiveVin]
		, [src].[IsValidVin]
		, -1  ---[DmsVehID]
		, [src].[WebvVehID]
		, -1 ---[EPVehID]
		, -1 ---[SimsVehId]
		, -1 ---[SimsEPVehId]
		, -1 ---[VehicleMartId]
		, [src].[ETLExecution_ID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_Src_Sys_ID]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_UserID]
		)
OUTPUT $ACTION INTO @rowcounts;

/* Purge Vins Missing from Source */
UPDATE	[tgt]
SET		[tgt].[WebVVehID] = -1
from	[dbo].[DimVin] AS tgt
WHERE	[tgt].[WebVVehID] != -1
		AND NOT EXISTS (
						SELECT	1
						FROM	[SynWrkDimVehicleInventoryVins] AS src
						WHERE	[tgt].[Vin] = [src].[Vin]
								AND [src].[Meta_Src_Sys_ID] = 32
						);






/* ************************************************************************************ */
/* process WebV Echo Park records ***************************************************** */
/* 3rd highest wieght - Used Car stores *********************************************** */
/* ************************************************************************************ */
MERGE	[dbo].[DimVin] AS [tgt]
USING	(
		SELECT	[src].[Vin]
				, [src].[IsValidVin]
				, [src].[EPVehID]
				, [src].[ETLExecution_ID]
				, [src].[Meta_ComputerName]
				, [src].[Meta_Src_Sys_ID]
				, [src].[Meta_SourceSystemName]
				, [src].[Meta_UserID]
		FROM	[SynWrkDimVehicleVehicle] AS src
		WHERE	[src].[Meta_Src_Sys_ID] = 44
		) AS [src]
		ON [tgt].[Vin] = [src].[VIN]

/* VIN is the same but Vehicle ID is different - Update record */
WHEN MATCHED AND ([tgt].[EPVehID] != [src].[EPVehID])
	THEN UPDATE SET
		[tgt].[EPVehID]					= [src].[EpVehID]
	    , [tgt].[ETLExecution_ID]		= [src].[ETLExecution_ID]
		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
	    , [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
		, [tgt].[Meta_SourceSystemName] = [src].[Meta_SourceSystemName]
		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]

/* VIN not found - write new record */
WHEN NOT MATCHED BY TARGET
	THEN INSERT (
	[Vin]
	, [IsActiveVin]
	, [IsValidVin]
	, [DmsVehID]
	, [WebVVehID]
	, [EPVehID]
	, [SimsVehId]
	, [SimsEPVehId]
	, [VehicleMartId]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_Src_Sys_ID]
	, [Meta_SourceSystemName]
	, [Meta_UserID]
	)
	VALUES (
		[src].[Vin]
		, 1 --- [IsActiveVin]
		, [src].[IsValidVin]
		, -1 ---[DmsVehID]
		, -1 ---[WebVVehID]
		, [src].[EPVehID]
		, -1 ---[SimsVehId]
		, -1 ---[SimsEPVehId]
		, -1 ---[VehicleMartId]
		, [src].[ETLExecution_ID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_Src_Sys_ID]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_UserID]
		)
OUTPUT $ACTION INTO @rowcounts;

/* Purge Vins Missing from Source */
UPDATE	[tgt]
SET		[tgt].[EPVehID] = -1
from	[dbo].[DimVin] AS tgt
WHERE	[tgt].[EPVehID] != -1
		AND NOT EXISTS (
						SELECT	1
						FROM	[SynWrkDimVehicleInventoryVins] AS src
						WHERE	[tgt].[Vin] = [src].[Vin]
								AND [src].[Meta_Src_Sys_ID] = 44
						);



/* ************************************************************************************ */
/* process Sims Retail records ******************************************************** */
/* ************************************************************************************ */
--MERGE	[dbo].[DimVin] AS [tgt]
--USING	(
--		SELECT	[src].[Vin]
--				, [src].[IsValidVin]
--				, [src].[SimsVehID]
--				, [src].[ETLExecution_ID]
--				, [src].[Meta_ComputerName]
--				, [src].[Meta_Src_Sys_ID]
--				, [src].[Meta_SourceSystemName]
--				, [src].[Meta_UserID]
--		FROM	[SynWrkDimVehicleVehicle] AS src
--		WHERE	[src].[Meta_Src_Sys_ID] = 49
--		) AS [src]
--		ON [tgt].[Vin] = [src].[VIN]

--/* VIN is the same but Vehicle ID is different - Update record */
--WHEN MATCHED AND ([tgt].[SimsVehID] != [src].[SimsVehID])
--	THEN UPDATE SET
--		[tgt].[SimsVehID]				= [src].[SimsVehID]
--	    , [tgt].[ETLExecution_ID]		= [src].[ETLExecution_ID]
--		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
--	    , [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
--		, [tgt].[Meta_SourceSystemName] = [src].[Meta_SourceSystemName]
--		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]

--/* VIN not found - write new record */
--WHEN NOT MATCHED BY TARGET
--	THEN INSERT (
--	[Vin]
--	, [IsActiveVin]
--	, [IsValidVin]
--	, [DmsVehID]
--	, [WebVVehID]
--	, [EPVehID]
--	, [SimsVehId]
--	, [SimsEPVehId]
--	, [VehicleMartId]
--	, [ETLExecution_ID]
--	, [Meta_ComputerName]
--	, [Meta_Src_Sys_ID]
--	, [Meta_SourceSystemName]
--	, [Meta_UserID]
--	)
--	VALUES (
--		[src].[Vin]
--		, 1 --- [IsActiveVin]
--		, [src].[IsValidVin]
--		, -1 ---[DmsVehID]
--		, -1 ---[WebVVehID]
--		, -1 ---[EPVehID]
--		, [src].[SimsVehId]
--		, -1 ---[SimsEPVehId]
--		, -1 ---[VehicleMartId]
--		, [src].[ETLExecution_ID]
--		, [src].[Meta_ComputerName]
--		, [src].[Meta_Src_Sys_ID]
--		, [src].[Meta_SourceSystemName]
--		, [src].[Meta_UserID]
--		)
--OUTPUT $ACTION INTO @rowcounts;

--/* Purge Vins Missing from Source */
--UPDATE	[tgt]
--SET		[tgt].[SimsVehID] = -1
--from	[dbo].[DimVin] AS tgt
--WHERE	[tgt].[SimsVehID] != -1
--		AND NOT EXISTS (
--						SELECT	1
--						FROM	[SynWrkDimVehicleInventoryVins] AS src
--						WHERE	[tgt].[Vin] = [src].[Vin]
--								AND [src].[Meta_Src_Sys_ID] = 49
--						);





/* ************************************************************************************ */
/* process Sims Echo Park records ***************************************************** */
/* ************************************************************************************ */
--MERGE	[dbo].[DimVin] AS [tgt]
--USING	(
--		SELECT	[src].[Vin]
--				, [src].[IsValidVin]
--				, [src].[SimsEPVehID]
--				, [src].[ETLExecution_ID]
--				, [src].[Meta_ComputerName]
--				, [src].[Meta_Src_Sys_ID]
--				, [src].[Meta_SourceSystemName]
--				, [src].[Meta_UserID]
--		FROM	[SynWrkDimVehicleVehicle] AS src
--		WHERE	[src].[Meta_Src_Sys_ID] = 50
--		) AS [src]
--		ON [tgt].[Vin] = [src].[VIN]

--/* VIN is the same but Vehicle ID is different - Update record */
--WHEN MATCHED AND ([tgt].[SimsEPVehID] != [src].[SimsEPVehID])
--	THEN UPDATE SET
--		[tgt].[SimsEPVehID]				= [src].[SimsEpVehID]
--	    , [tgt].[ETLExecution_ID]		= [src].[ETLExecution_ID]
--		, [tgt].[Meta_ComputerName]		= [src].[Meta_ComputerName]
--	    , [tgt].[Meta_Src_Sys_ID]		= [src].[Meta_Src_Sys_ID]
--		, [tgt].[Meta_SourceSystemName] = [src].[Meta_SourceSystemName]
--		, [tgt].[Meta_UserID]			= [src].[Meta_UserID]

--/* VIN not found - write new record */
--WHEN NOT MATCHED BY TARGET
--	THEN INSERT (
--	[Vin]
--	, [IsActiveVin]
--	, [IsValidVin]
--	, [DmsVehID]
--	, [WebVVehID]
--	, [EPVehID]
--	, [SimsVehId]
--	, [SimsEPVehId]
--	, [VehicleMartId]
--	, [ETLExecution_ID]
--	, [Meta_ComputerName]
--	, [Meta_Src_Sys_ID]
--	, [Meta_SourceSystemName]
--	, [Meta_UserID]
--	)
--	VALUES (
--		[src].[Vin]
--		, 1 --- [IsActiveVin]
--		, [src].[IsValidVin]
--		, -1 ---[DmsVehID]
--		, -1 ---[WebVVehID]
--		, -1 ---[EPVehID]
--		, -1 ---[SimsVehId]
--		, [src].[SimsEPVehId]
--		, -1 ---[VehicleMartId]
--		, [src].[ETLExecution_ID]
--		, [src].[Meta_ComputerName]
--		, [src].[Meta_Src_Sys_ID]
--		, [src].[Meta_SourceSystemName]
--		, [src].[Meta_UserID]
--		)
--OUTPUT $ACTION INTO @rowcounts;

--/* Purge Vins Missing from Source */
--UPDATE	[tgt]
--SET		[tgt].[SimsEPVehID] = -1
--from	[dbo].[DimVin] AS tgt
--WHERE	[tgt].[SimsEPVehID] != -1
--		AND NOT EXISTS (
--						SELECT	1
--						FROM	[SynWrkDimVehicleInventoryVins] AS src
--						WHERE	[tgt].[Vin] = [src].[Vin]
--								AND [src].[Meta_Src_Sys_ID] = 50
--						);



/* ************************************************************************************ */
/* Update Active Flag ***************************************************************** */
/* Active if currently listed in at least one source ********************************** */
/* ************************************************************************************ */
/* Record is not active if sources are all -1 */
UPDATE	[dbo].[DimVin]
SET		[IsActiveVin] = 0
WHERE	[IsActiveVin] = 1
		AND [DMSVehID] = -1
		AND [WebVVehID] = -1
		AND [EPVehID] = -1
		AND [SimsVehId] = -1
		AND [SimsEPVehId] = -1
		;

/* Update Active Flag */
UPDATE	[dbo].[DimVin]
SET		[IsActiveVin] = 1
WHERE	[IsActiveVin] = 0
		AND (
			[DMSVehID] != -1
			OR [WebVVehID] != -1
			OR [EPVehID] != -1
			OR [SimsVehId] != -1
			OR [SimsEPVehId] != -1
		)
		;


/* ************************************************************************************ */
/* capture merge counts *************************************************************** */
/* ************************************************************************************ */
SELECT	@InsertedRowCnts = [INSERT]
		, @UpdatedRowCnts = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM @RowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([INSERT], [UPDATE])) AS pvt;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
