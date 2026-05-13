---
name: uspLoadDimRMSource
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

CREATE   PROCEDURE [dbo].[uspLoadDimRMSource] (@MetaLoadDate varchar(100), @MetaComputerName varchar(100),@MetaUserId varchar(100), @MetaSourceSystemName varchar(100), @MetaSrcSysID varchar(100), @ETLExecutionID varchar(100))
AS
BEGIN TRY
 BEGIN TRANSACTION
		insert into dbo.DimRMSource
		(
	 	 Source
		,MetaLoadDate
		,MetaComputerName
		,MetaUserID
		,MetaSourceSystemName
		,MetaSrcSysID
		,ETLExecutionID
		)
    SELECT a.*,@MetaLoadDate, @MetaComputerName,@MetaUserId,@MetaSourceSystemName,@MetaSrcSysID,@ETLExecutionID
	FROM (
		Select Distinct SourceID from etl_staging.stage.StgRMReviewMonthly (nolock)
		except
		Select Distinct Source from dbo.DimRMSource (nolock)
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
