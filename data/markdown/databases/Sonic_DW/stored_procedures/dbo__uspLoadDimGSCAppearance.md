---
name: uspLoadDimGSCAppearance
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimGSCAppearance
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

- **dbo.DimGSCAppearance** (U )

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

CREATE PROCEDURE [dbo].[uspLoadDimGSCAppearance] (@MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))

AS

BEGIN TRY

 BEGIN TRANSACTION

		insert into dbo.DimGSCAppearance
		(
		 SearchAppearance
		,MetaLoadDate
		,MetaComputerName
		,MetaUserID
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct SearchAppearance from ETL_Staging.stage.stgGSCAppearanceDaily (nolock)
		except
		Select Distinct SearchAppearance from dbo.DimGSCAppearance (nolock)
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
