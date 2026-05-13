---
name: uspScoresDimDealTypeLoad
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimDealType
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

- **dbo.DimDealType** (U )

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
-- Author:        Amrendra Kumar
-- Create date:  01/07/2016
-- Description:   Inserts/Update DimLeadStatus

-- 5/1/2016 - ubs - added  SCD type 1 update on DealTypeDesc. Added attributevalue as DealTypeCode, not just natural key.
-- =============================================
CREATE PROCEDURE [dbo].[uspScoresDimDealTypeLoad] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME
	,@MetaSourceSystemName VARCHAR(50)
	,@ETLExecution_ID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	)
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
	,@updatedCount INT;

MERGE INTO dbo.DimDealType AS [TGT]
USING  [ETL_Staging].[dbo].[stgDimDealType] AS SRC
	ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
WHEN MATCHED
	AND (
		SRC.DealTypeDesc <> TGT.DealTypeDesc
		)
	THEN
		UPDATE	-- SCD type 1
		SET TGT.DealTypeDesc= SRC.DealTypeDesc
			,TGT.Meta_RowLastChangeDate = @MetaLoadDate
			,TGT.ETLExecution_ID = @ETLExecution_ID
WHEN NOT MATCHED
	THEN
		INSERT ([DealTypeCode]
			,[DealTypeDesc]
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
			,[Meta_NaturalKey]
			,[Meta_Checksum]
			,[Meta_LoadDate]
			,[ETLExecution_ID]
			)
		VALUES (
			 SRC.DealTypeCode
			,SRC.[DealTypeDesc]
			,@MetaSrcSysID
			,@MetaUserID
			,@MetaComputerName
			,@MetaLoadDate
			,NULL
			,'Y'
			,@MetaSourceSystemName
			,@MetaLoadDate
			,-1
			,-1
			,SRC.MetaNaturalKey
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
