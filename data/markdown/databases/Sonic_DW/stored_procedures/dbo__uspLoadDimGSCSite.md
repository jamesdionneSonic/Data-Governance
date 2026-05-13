---
name: uspLoadDimGSCSite
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimGSCSite
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

- **dbo.DimGSCSite** (U )

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
/* Script name    |   [dbo].[uspLoadGSCDimSite]                                      */
/* Purpose        |   This sp inserts data into GSCDimSite table                     */
/* Date           |   2021-06-28	Change: Creation					                */
/* Author         |   Sandeepak Ghosh	                                                */
/* Tables loaded  |   dbo.GSCDimSite                                                 */
/* Date Modified  |                                                                     */
/* 2021-05-11     |    TLC Initial                                                      */
/* ************************************************************************************ */
CREATE PROCEDURE [dbo].[uspLoadDimGSCSite] (@MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))
AS
BEGIN TRY
 BEGIN TRANSACTION
		insert into dbo.DimGSCSite
		(
	 	 SiteName
		,SiteURL
		,MetaLoadDate
		,MetaComputerName
		,MetaUserID
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT replace(replace(a.site,'https://',''),'/','') AS HostName,a.site,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct Site from etl_staging.stage.stgGSCDevicesCountryDaily (nolock)
		except
		Select Distinct SiteURL from dbo.DimGSCSite (nolock)
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
