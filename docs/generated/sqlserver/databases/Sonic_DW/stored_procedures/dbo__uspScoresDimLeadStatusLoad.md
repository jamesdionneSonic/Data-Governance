---
name: uspScoresDimLeadStatusLoad
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





-- =============================================
-- Author:        Amrendra Kumar
-- Create date:  01/07/2016
-- Description:   Inserts/Update DimLeadStatus
-- =============================================
CREATE PROCEDURE [dbo].[uspScoresDimLeadStatusLoad] (
	@MetaComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME
	,@MetaSourceSystemName VARCHAR(20)
	,@ETLExecution_ID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	)
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
		,@updatedCount INT;

MERGE INTO dbo.DimLeadStatus AS [TGT]
USING (
	SELECT [LeadStatusCode]
		,[LeadStatusDescr]
		,[LeadInactiveReasonCode]
		,[LeadInactiveReasonDesc]
		,[MetaNaturalKey]
	FROM [ETL_Staging].[dbo].[stgDimLeadStatus]
	) AS SRC
	ON SRC.MetaNaturalKey = TGT.Meta_NaturalKey
WHEN MATCHED
	AND (
		isnull(SRC.[LeadStatusDescr], '') <> isnull(TGT.[LeadStatusDesc], '')
		OR SRC.[LeadInactiveReasonCode] <> TGT.[LeadInactiveReasonCode]
		OR isnull(SRC.[LeadInactiveReasonDesc], '') <> isnull(TGT.[LeadInactiveReasonDesc], '')
		)
	THEN
		UPDATE
		SET TGT.[LeadStatusDesc] = SRC.[LeadStatusDescr]
			,TGT.[LeadInactiveReasonCode] = SRC.[LeadInactiveReasonCode]
			,TGT.[LeadInactiveReasonDesc] = SRC.[LeadInactiveReasonDesc]
			,TGT.[Meta_RowLastChangeDate] = @MetaLoadDate
			,TGT.ETLExecution_ID = @ETLExecution_ID
WHEN NOT MATCHED
	THEN
		INSERT (
			[LeadStatusCode]
			,[LeadStatusDesc]
			,[LeadInactiveReasonCode]
			,[LeadInactiveReasonDesc]
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
			SRC.[LeadStatusCode]
			,SRC.[LeadStatusDescr]
			,SRC.[LeadInactiveReasonCode]
			,SRC.[LeadInactiveReasonDesc]
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
			,SRC.MetaNaturalKey
			,-1
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
