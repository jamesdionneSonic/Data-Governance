---
name: uspScoresDimOportunitySourceLoad
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimOpportunitySource
dependency_count: 1
parameter_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimOpportunitySource** (U )

## Parameters

| Name                    | Type     | Output | Default |
| ----------------------- | -------- | ------ | ------- |
| `@MetaComputerName`     | varchar  | No     | No      |
| `@MetaSrcSysID`         | int      | No     | No      |
| `@MetaUserID`           | varchar  | No     | No      |
| `@MetaLoadDate`         | datetime | No     | No      |
| `@MetaSourceSystemName` | varchar  | No     | No      |
| `@ETLExecution_ID`      | int      | No     | No      |
| `@insertedRowCnts`      | int      | Yes    | No      |
| `@updatedRowCnts`       | int      | Yes    | No      |

## Definition

```sql











-- ================================================
-- Author:       Umberto Sartori
-- Create date:  14/18/2017
-- Description:  Inserts/Update DimOpportunitySource dimension table
--
-- ubs - 4/18/2017 - added source sytem name and ID to target table.
-- ================================================
CREATE PROCEDURE [dbo].[uspScoresDimOportunitySourceLoad] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME
	,@MetaSourceSystemName VARCHAR(20)
	,@ETLExecution_ID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT)

AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
	,@updatedCount INT;

MERGE INTO dbo.DimOpportunitySource AS [TGT]
USING (
	SELECT distinct isnull(SrcUpType, 'UNKNOWN') as SrcUpType
		,isnull(SrcCompanyID, -1) as SrcCompanyID
		,isnull(SrcSourceID, -1) as SrcSourceID
		,isnull(SrcSourceDesc, 'UNKNOWN') as SrcSourceDesc
		,isnull(SrcSubSourceId, -1) as SrcSubSourceID
		,isnull(SrcSubSourceDesc, 'UNKNOWN') as SrcSubSourceDesc
		,isnull(SrcSourceGroup, 'UNKNOWN') as SrcSourceGroup
		,isnull(SrcIsActive, -1) as SrcIsActive
		,isnull(MetaNaturalKey, 'UNKNOWN') as MetaNaturalKey
		,MetaSourceSystemName
		,MetaSourceSystemID
	FROM ETL_Staging.dbo.[StgDimOpportunitySource]
	) AS SRC
	ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
		AND TGT.Meta_SourceSystemName in ('SCORESMSCRM', 'EchoPark SCORES DealerContact')
WHEN MATCHED
	AND (
		SRC.SrcUpType <> TGT.SrcUpType
		OR SRC.SrcCompanyID <> TGT.SrcCompanyID
		OR SRC.SrcSourceID <> TGT.SrcSourceID
		OR SRC.SrcSourceDesc <> TGT.SrcSourceDesc
		OR SRC.SrcSubSourceId <> TGT.SrcSubSourceId
		OR SRC.SrcSubSourceDesc <> TGT.SrcSubSourceDesc
		OR SRC.SrcSourceGroup <> TGT.SrcSourceGroup
		OR SRC.SrcIsActive <> TGT.SrcIsActive
		)
	THEN
		UPDATE
		SET TGT.SrcUpType = SRC.SrcUpType
			,TGT.SrcCompanyID = SRC.SrcCompanyID
			,TGT.SrcSourceID = SRC.SrcSourceID
			,TGT.SrcSourceDesc = SRC.SrcSourceDesc
			,TGT.SrcSubSourceId = SRC.SrcSubSourceId
			,TGT.SrcSubSourceDesc = SRC.SrcSubSourceDesc
			,TGT.SrcSourceGroup = SRC.SrcSourceGroup
			,TGT.SrcIsActive = SRC.SrcIsActive
			,TGT.[Meta_RowLastChangeDate]=@MetaLoadDate
			,TGT.ETLExecution_ID = @ETLExecution_ID
WHEN NOT MATCHED
	THEN
		INSERT (
			[SrcUpType]
			,[SrcCompanyID]
			,[SrcSourceID]
			,[SrcSourceDesc]
			,[SrcSubSourceId]
			,[SrcSubSourceDesc]
			,SrcSourceDetails
			,[SrcSourceGroup]
			,[SrcIsActive]
			,[Meta_NaturalKey]
			,[Meta_SrcSysID]
			,[User_ID]
			,[Meta_ComputerName]
			,[Meta_RowEffectiveDate]
			,[Meta_RowExpiredDate]
			,[Meta_RowIsCurrent]
			,[Meta_SourceSystemName]
			,[Meta_RowLastChangeDate]
			,[Meta_AuditKey]
			,[Meta_AuditScore]
			,[Meta_Checksum]
			,[Meta_LoadDate]
			,[ETLExecution_ID]
			)
		VALUES (
			SRC.[SrcUpType]
			,SRC.[SrcCompanyID]
			,SRC.[SrcSourceID]
			,SRC.[SrcSourceDesc]
			,SRC.[SrcSubSourceId]
			,SRC.[SrcSubSourceDesc]
			,'UNDEFINED'
			,SRC.[SrcSourceGroup]
			,SRC.[SrcIsActive]
			,SRC.[MetaNaturalKey]
			,SRC.MetaSourceSystemID
			,@MetaUserID
			,@MetaComputerName
			,@MetaLoadDate
			,NULL
			,'Y'
			,SRC.MetaSourceSystemName
			,@MetaLoadDate
			,NULL
			,NULL
			,NULL
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
