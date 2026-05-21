---
name: usp_OldDimVehicle
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql


/* ************************************************************************************ */
/* Author: Jo Carter	Date: 2018-10-10	Change: Creation							*/
/*																						*/
/* ***** Note: if a user changes a value in SAM - it will not reflect here *****		*/
/*																						*/
/* Change:				Date: 2018-06-14	Change:										*/
/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[usp_OldDimVehicle]
(
	@InsertedRowCnts INT OUTPUT,
	@UpdatedRowCnts INT OUTPUT
)
AS
SET NOCOUNT ON;





/* variables */
DECLARE @RowCounts TABLE (MergeAction VARCHAR(20));
DECLARE @Yesterday date = getdate()-2;





SET IDENTITY_INSERT Dim_Vehicle ON;
MERGE	[dbo].[Dim_Vehicle] AS [tgt]
USING	(
		SELECT	*
		FROM	[vwOldDimVehicle] AS src
		WHERE	[src].[Meta_RowLastChangedDate] >= @yesterday
		) AS [src]
		ON [tgt].[vehvin] = [src].[vehvin]

WHEN MATCHED THEN UPDATE
	SET
		[tgt].[VehUpdateSource]				= [src].[VehUpdateSource]
		--, [VehVIN]
		, [tgt].[VehNewUsed]				= [src].[VehNewUsed]
		, [tgt].[VehCategory]				= [src].[VehCategory]
		, [tgt].[VehDMVCategory]			= [src].[VehDMVCategory]
		, [tgt].[VehMakeCode]				= [src].[VehMakeCode]
		, [tgt].[VehMakeDesc]				= [src].[VehMakeDesc]
		, [tgt].[VehModelCode]				= [src].[VehModelCode]
		, [tgt].[VehModelDesc]				= [src].[VehModelDesc]
		, [tgt].[VehModelYear]				= [src].[VehModelYear]
		, [tgt].[VehSeriesDesc]				= [src].[VehSeriesDesc]
		, [tgt].[VehSeriesCode]				= [src].[VehSeriesCode]
		, [tgt].[VehInteriorColorCode]		= [src].[VehInteriorColorCode]
		, [tgt].[VehInteriorColorDesc]		= [src].[VehInteriorColorDesc]
		, [tgt].[VehExteriorColorCode]		= [src].[VehExteriorColorCode]
		, [tgt].[VehExteriorColorDesc]		= [src].[VehExteriorColorDesc]
		, [tgt].[VehTransmissionDesc]		= [src].[VehTransmissionDesc]
		, [tgt].[VehNumberOfCylinders]		= [src].[VehNumberOfCylinders]
		, [tgt].[VehNumberOfDoors]			= [src].[VehNumberOfDoors]
		, [tgt].[VehNumberOfPassengers]		= [src].[VehNumberOfPassengers]
		, [tgt].[VehChassisDesc]			= [src].[VehChassisDesc]
		, [tgt].[VehCabDesc]				= [src].[VehCabDesc]
		, [tgt].[VehRestraintsDesc]			= [src].[VehRestraintsDesc]
		, [tgt].[VehCurrentMileage]			= [src].[VehCurrentMileage]
		, [tgt].[VehCPOflg]					= [src].[VehCPOflg]
		, [tgt].[VehLastSoldDate]			= [src].[VehLastSoldDate]
		, [tgt].[VehLastServiceDate]		= [src].[VehLastServiceDate]
		, [tgt].[VehWarrantyExpDate]		= [src].[VehWarrantyExpDate]
		, [tgt].[VehLastStockDate]			= [src].[VehLastStockDate]
		, [tgt].[VehLastUpdateDate]			= [src].[VehLastUpdateDate]
		, [tgt].[VehModelCategory]			= [src].[VehModelCategory]
		, [tgt].[VehModelSubCategory]		= [src].[VehModelSubCategory]
		, [tgt].[IsValidVin]				= [src].[IsValidVin]
		, [tgt].[IsChromeDecoded]			= [src].[IsChromeDecoded]
		, [tgt].[ETLExecution_ID]			= [src].[ETLExecution_ID]
		, [tgt].[Meta_Src_Sys_ID]			= [src].[Meta_Src_Sys_ID]
		, [tgt].[User_ID]					= [src].[User_ID]
		, [tgt].[Meta_ComputerName]			= [src].[Meta_ComputerName]
		, [tgt].[Meta_SourceSystemName]		= [src].[Meta_SourceSystemName]
		----, [tgt].[Meta_LoadDate]
		, [tgt].[Meta_RowEffectiveDate]		= [src].[Meta_RowEffectiveDate]
		, [tgt].[Meta_RowExpiredDate]		= [src].[Meta_RowExpiredDate]
		, [tgt].[Meta_RowIsCurrent]			= [src].[Meta_RowIsCurrent]
		, [tgt].[Meta_RowLastChangedDate]	= sysdatetime()
		, [tgt].[Meta_AuditKey]				= [src].[Meta_AuditKey]
		, [tgt].[Meta_NaturalKey]			= [src].[Meta_NaturalKey]
		, [tgt].[Meta_Checksum]				= [src].[Meta_Checksum]


WHEN NOT MATCHED THEN INSERT(
	[vehiclekey]
	, [VehUpdateSource]
	, [vehvin]
	, [VehNewUsed]
	, [VehCategory]
	, [VehDMVCategory]
	, [VehMakeCode]
	, [VehMakeDesc]
	, [VehModelCode]
	, [VehModelDesc]
	, [VehModelYear]
	, [VehSeriesDesc]
	, [VehSeriesCode]
	, [VehInteriorColorCode]
	, [VehInteriorColorDesc]
	, [VehExteriorColorCode]
	, [VehExteriorColorDesc]
	, [VehTransmissionDesc]
	, [VehNumberOfCylinders]
	, [VehNumberOfDoors]
	, [VehNumberOfPassengers]
	, [VehChassisDesc]
	, [VehCabDesc]
	, [VehRestraintsDesc]
	, [VehCurrentMileage]
	, [VehCPOflg]
	, [VehLastSoldDate]
	, [VehLastServiceDate]
	, [VehWarrantyExpDate]
	, [VehLastStockDate]
	, [VehLastUpdateDate]
	, [VehModelCategory]
	, [VehModelSubCategory]
	, [IsValidVin]
	, [IsChromeDecoded]
	, [ETLExecution_ID]
	, [Meta_Src_Sys_ID]
	, [User_ID]
	, [Meta_ComputerName]
	, [Meta_SourceSystemName]
	, [Meta_LoadDate]
	, [Meta_RowEffectiveDate]
	, [Meta_RowExpiredDate]
	, [Meta_RowIsCurrent]
	, [Meta_RowLastChangedDate]
	, [Meta_AuditKey]
	, [Meta_NaturalKey]
	, [Meta_Checksum]
	)
	Values	(
		  [src].[vehiclekey]
		, [src].[VehUpdateSource]
		, [src].[vehvin]
		, [src].[VehNewUsed]
		, [src].[VehCategory]
		, [src].[VehDMVCategory]
		, [src].[VehMakeCode]
		, [src].[VehMakeDesc]
		, [src].[VehModelCode]
		, [src].[VehModelDesc]
		, [src].[VehModelYear]
		, [src].[VehSeriesDesc]
		, [src].[VehSeriesCode]
		, [src].[VehInteriorColorCode]
		, [src].[VehInteriorColorDesc]
		, [src].[VehExteriorColorCode]
		, [src].[VehExteriorColorDesc]
		, [src].[VehTransmissionDesc]
		, [src].[VehNumberOfCylinders]
		, [src].[VehNumberOfDoors]
		, [src].[VehNumberOfPassengers]
		, [src].[VehChassisDesc]
		, [src].[VehCabDesc]
		, [src].[VehRestraintsDesc]
		, [src].[VehCurrentMileage]
		, [src].[VehCPOflg]
		, [src].[VehLastSoldDate]
		, [src].[VehLastServiceDate]
		, [src].[VehWarrantyExpDate]
		, [src].[VehLastStockDate]
		, [src].[VehLastUpdateDate]
		, [src].[VehModelCategory]
		, [src].[VehModelSubCategory]
		, [src].[IsValidVin]
		, [src].[IsChromeDecoded]
		, [src].[ETLExecution_ID]
		, [src].[Meta_Src_Sys_ID]
		, [src].[User_ID]
		, [src].[Meta_ComputerName]
		, [src].[Meta_SourceSystemName]
		, [src].[Meta_LoadDate]
		, [src].[Meta_RowEffectiveDate]
		, [src].[Meta_RowExpiredDate]
		, [src].[Meta_RowIsCurrent]
		, sysdatetime() --- last change date
		, [src].[Meta_AuditKey]
		, [src].[Meta_NaturalKey]
		, [src].[Meta_Checksum]
	)
OUTPUT $ACTION INTO @rowcounts;

SET IDENTITY_INSERT Dim_Vehicle OFF;



/* ************************************************************************************ */
/* capture Inserted counts ************************************************************ */
/* ************************************************************************************ */
SELECT	@InsertedRowCnts = [INSERT]
		, @UpdatedRowCnts = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM @RowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([INSERT], [UPDATE])) AS pvt;
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
