---
name: usp_Load_DimOpportunitySource
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











-- =============================================
-- Author:        Umberto Sartori
-- Create date:  04/1/2016
-- Description:   Inserts/Update opportunity source Dimension records (type 1)

-- 11/2/2016 - ubs - add szMapGroup to target table load.
-- =============================================

CREATE PROCEDURE [dbo].[usp_Load_DimOpportunitySource] (
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
USING etl_staging.wrk.eLead_Dim_OpprotunitySrc_Staging AS SRC
	ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
		and TGT.Meta_SourceSystemName = @MetaSourceSystemName
WHEN MATCHED
	AND isnull(SRC.szSourceGroup, 'UNKNOWN') <> isnull(TGT.SrcSourceGroup, 'UNKNOWN')
	THEN
		UPDATE
		SET TGT.SrcSourceGroup = SRC.szSourceGroup
			,TGT.[Meta_RowLastChangeDate] = @MetaLoadDate
			,TGT.ETLExecution_ID = @ETLExecution_ID
WHEN NOT MATCHED BY TARGET
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
			,[szLegacyUpType]
			)
		VALUES (
			SRC.szuptype
			,SRC.lCompanyID
			,SRC.lsourceid
			,SRC.szupsource
			,SRC.lsubsourceid
			,SRC.szsubsource
			,SRC.szSourceDetails
			,SRC.szSourceGroup
			,-1
			,SRC.[MetaNaturalKey]
			,@MetaSrcSysID
			,@MetaUserID
			,@MetaComputerName
			,@MetaLoadDate
			,NULL
			,'Y'
			,@MetaSourceSystemName
			,@MetaLoadDate
			,NULL
			,NULL
			,NULL
			,@MetaLoadDate
			,@ETLExecution_ID
			,szLegacyUpType
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
