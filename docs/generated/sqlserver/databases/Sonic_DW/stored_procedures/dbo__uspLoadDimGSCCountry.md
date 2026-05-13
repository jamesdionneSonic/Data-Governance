---
name: uspLoadDimGSCCountry
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
