---
name: uspScoresDimActivityStatusLoad
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimActivityStatus
dependency_count: 1
parameter_count: 9
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimActivityStatus** (U )

## Parameters

| Name                    | Type      | Output | Default |
| ----------------------- | --------- | ------ | ------- |
| `@MetaRowEffectiveDate` | datetime2 | No     | No      |
| `@MetaSrcSysID`         | int       | No     | No      |
| `@MetaLoadDate`         | datetime2 | No     | No      |
| `@MetaSourceSystemName` | varchar   | No     | No      |
| `@ETLExecution_ID`      | int       | No     | No      |
| `@insertedRowCnts`      | int       | Yes    | No      |
| `@updatedRowCnts`       | int       | Yes    | No      |
| `@UserID`               | varchar   | No     | No      |
| `@MetaComputerName`     | varchar   | No     | No      |

## Definition

```sql


--declare @inserted int, @updated int;


--exec dbo.uspScoresDimActivityStatusLoad '7/18/2017', 40, '7/18/2017', 'SCORESMSCRM', 55618,  @inserted, @updated  ,'usartori', 'shqbt0091'

-- =============================================
-- Author:        Umberto Sartori
-- Create date:  04/25/2016
-- Description:   Inserts DimActivityStatus
-- =============================================
CREATE PROCEDURE [dbo].[uspScoresDimActivityStatusLoad] (
	@MetaRowEffectiveDate datetime2(7)
	,@MetaSrcSysID INT
	,@MetaLoadDate datetime2(7)
	,@MetaSourceSystemName VARCHAR(20)
	,@ETLExecution_ID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	,@UserID varchar(50)
	,@MetaComputerName varchar(50)
	)
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
	,@updatedCount INT;

MERGE INTO dbo.DimActivityStatus AS [TGT]
USING  etl_staging.dbo.StgDimActivityStatus AS SRC		-- select * from etl_staging.dbo.StgDimActivityStatus order by [StateCode_DisplayName], [Statuscode_displayname] select * from dbo.dimactivitystatus
	ON TGT.ActivityStateDesc = SRC.[StateCode_DisplayName]
		AND TGT.ActivityStatusDesc = SRC.[Statuscode_displayname]
WHEN NOT MATCHED
	THEN
		INSERT ([ActivityStateDesc]
			,[ActivityStatusDesc]
			,[Meta_SrcSysID]
			,[Meta_RowEffectiveDate]
			,[Meta_RowExpiredDate]
			,[Meta_RowIsCurrent]
			,[Meta_SourceSystemName]
			,[Meta_ComputerName]
			,[Meta_RowLastChangeDate]
			,[Meta_AuditKey]
			,[Meta_AuditScore]
			,[Meta_NaturalKey]
			,[Meta_Checksum]
			,[User_ID]
			,[Meta_LoadDate]
			,[ETLExecution_ID]
			)
		VALUES (
			 SRC.[StateCode_DisplayName]
			,SRC.[Statuscode_displayname]
			,@MetaSrcSysID
			,@MetaRowEffectiveDate
			,NULL
			,'Y'
			,@MetaSourceSystemName
			,@MetaComputerName
			,@MetaLoadDate
			,-1
			,-1
			,(SRC.[StateCode_DisplayName] + '-' + SRC.[Statuscode_displayname])	-- MetaNaturalKey
			,-1
			,@UserID
			,@MetaLoadDate
			,@ETLExecution_ID
			)
OUTPUT $ACTION
INTO @rowcounts;

SELECT @insertedCount = [INSERT]
	,@updatedCount = [UPDATE]
FROM (
	SELECT MergeAction
		,1 ROWS
	FROM @rowcounts
	) AS p
PIVOT(COUNT(rows) FOR p.MergeAction IN (
			[INSERT]
			,[UPDATE]
			)) AS pvt

SELECT @insertedRowCnts = isnull(@insertedcount, 0)
	,@updatedRowCnts = isnull(@updatedCount, 0)








```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
