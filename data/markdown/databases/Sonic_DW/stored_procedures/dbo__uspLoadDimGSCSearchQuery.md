---
name: uspLoadDimGSCSearchQuery
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimGSCSearchQuery
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

- **dbo.DimGSCSearchQuery** (U )

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

/* Script name    |   [dbo].[uspLoadGSCDimSearchQuery]                                      */

/* Purpose        |   This sp inserts data into DimGSCSearchQuery table                     */

/* Date           |   2021-06-28	Change: Creation					                */

/* Author         |   Sandeepak Ghosh	                                                */

/* Tables loaded  |   dbo.DimGSCSearchQuery                                                 */

/* Date Modified  |                                                                     */

/* 2021-05-11     |    TLC Initial                                                      */

/* ************************************************************************************ */

CREATE PROCEDURE [dbo].[uspLoadDimGSCSearchQuery] (@MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))

AS

BEGIN TRY

 BEGIN TRANSACTION

		insert into dbo.DimGSCSearchQuery
		(
		 SearchQuery
		,MetaLoadDate
		,MetaComputerName
		,MetaUserID
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)

    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID

	FROM (
		Select Distinct SearchQuery from ETL_Staging.stage.stgGSCQueryDaily (nolock)
		except
		Select Distinct SearchQuery from dbo.DimGSCSearchQuery (nolock)
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
