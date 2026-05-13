---
name: uspLoadDimGSCCountry
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimGSCCountry
dependency_count: 1
parameter_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimGSCCountry** (U )

## Parameters

| Name                    | Type    | Output | Default |
| ----------------------- | ------- | ------ | ------- |
| `@MetaLoadDate`         | varchar | No     | No      |
| `@MetaComputerName`     | varchar | No     | No      |
| `@MetaUserId`           | varchar | No     | No      |
| `@MetaSourceSystemName` | varchar | No     | No      |
| `@MetaSrcSysID`         | varchar | No     | No      |
| `@ETLExecutionID`       | varchar | No     | No      |

## Definition

```sql



/* ************************************************************************************ */

/* Script name    |   [dbo].[uspLoadGSCDimCountry]                                      */

/* Purpose        |   This sp inserts data into DimGSCCountry table                     */

/* Date           |   2021-06-28	Change: Creation					                */

/* Author         |   Sandeepak Ghosh	                                                */

/* Tables loaded  |   dbo.DimGSCCountry                                                 */

/* Date Modified  |                                                                     */

/* 2021-05-11     |    TLC Initial                                                      */

/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[uspLoadDimGSCCountry] (@MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))

AS

BEGIN TRY

 BEGIN TRANSACTION

		insert into dbo.DimGSCCountry
		(
		 CountryName
		,CountryCode
		,MetaLoadDate
		,MetaComputerName
		,MetaUserID
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct Country,CountryCode from ETL_Staging.stage.stgGSCDevicesCountryDaily (nolock)
		except
		Select Distinct CountryName,CountryCode from dbo.DimGSCCountry (nolock)
		) a;

   COMMIT TRANSACTION

END TRY

BEGIN CATCH

   DECLARE @Message varchar(MAX) = ERROR_MESSAGE(),

        @Severity int = ERROR_SEVERITY(),

        @State smallint = ERROR_STATE();



   RAISERROR (@Message, @Severity, @State)

 ROLLBACK TRANSACTION

END CATCH




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
