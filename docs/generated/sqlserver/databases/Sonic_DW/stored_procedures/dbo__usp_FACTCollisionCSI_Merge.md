---
name: usp_FACTCollisionCSI_Merge
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


create Procedure [dbo].[usp_FACTCollisionCSI_Merge]
(
	@InsertedRowCnt INT OUTPUT,
	@UpdatedRowCnt INT OUTPUT
)
AS

declare @rowCounts table (MergeAction VARCHAR(20));


MERGE	[Sonic_DW].[dbo].[FactCollisionCSI] AS [tgt]
USING	[ETL_Staging].[wrk].[CollisionCSI] AS [src]
			ON [tgt].[Meta_NaturalKey] = [src].[Meta_NaturalKey]

WHEN MATCHED
THEN UPDATE SET
    [tgt].[FiscalMonthDateKey] = [src].[FiscalMonthDateKey],
    [tgt].[EntityKey] = [src].[EntityKey],
	[tgt].[NumberSurveys] = [src].[NumberSurveys],
	[tgt].[QualityCount] = [src].[QualityCount],
	[tgt].[QualitySum] = [src].[QualitySum],
	[tgt].[ReadyCount] = [src].[ReadyCount],
	[tgt].[ReadySum] = [src].[ReadySum],
	[tgt].[InformedCount] = [src].[InformedCount],
	[tgt].[InformedSum] = [src].[InformedSum],
	[tgt].[ThoroughCount] = [src].[ThoroughCount],
	[tgt].[ThoroughSum] = [src].[ThoroughSum],
	[tgt].[TreatedCount] = [src].[TreatedCount],
	[tgt].[TreatedSum] = [src].[TreatedSum],
	[tgt].[CommunicationCount] = [src].[CommunicationCount],
	[tgt].[CommunicationSum] = [src].[CommunicationSum],
	[tgt].[RecommendCount] = [src].[RecommendCount],
	[tgt].[RecommendSum] = [src].[RecommendSum],
	[tgt].[OverallCount] = [src].[OverallCount],
	[tgt].[OverAllSum] = [src].[OverAllSum],
	[tgt].[OverallCSI] = [src].[OverallCSI],

	[tgt].[ETLExecution_ID] = [src].[ETLExecution_ID],
	[tgt].[Meta_ComputerName] = [src].[Meta_ComputerName],
    --[tgt].[Meta_LoadDate] = [src].[Meta_LoadDate],
	--[tgt].[Meta_NaturalKey]= [src].[Meta_NaturalKey],
	[tgt].[Meta_RowLastChangeDate] = [src].[Meta_LoadDate],
	[tgt].[Meta_SourceSystemName] = [src].[Meta_SourceSystemName],
	[tgt].[Meta_Src_Sys_ID] = [src].[Meta_Src_Sys_ID],
	[tgt].[User_ID] = [src].[User_ID]


WHEN NOT MATCHED THEN INSERT (
	--CollisionCSIID,
	EntityKey,
	FiscalMonthDateKey,
	OverallCSI,
	NumberSurveys,
	QualityCount,
	QualitySum,
	ReadyCount,
	ReadySum,
	InformedCount,
	InformedSum,
	ThoroughCount,
	ThoroughSum,
	TreatedCount,
	TreatedSum,
	CommunicationCount,
	CommunicationSum,
	RecommendCount,
	RecommendSum,
	OverallCount,
	OverallSum,
	ETLExecution_ID,
	Meta_ComputerName,
	Meta_LoadDate,
	Meta_Naturalkey,
	Meta_RowLastChangeDate,
	[Meta_SourceSystemName],
	Meta_Src_Sys_ID,
	[User_ID]
	)
	values(
		src.EntityKey,
		src.FiscalMonthDateKey,
		src.OverallCSI,
		src.NumberSurveys,
		src.QualityCount,
		src.QualitySum,
		src.ReadyCount,
		src.ReadySum,
		src.InformedCount,
		src.InformedSum,
		src.ThoroughCount,
		src.ThoroughSum,
		src.TreatedCount,
		src.TreatedSum,
		src.CommunicationCount,
		src.CommunicationSum,
		src.RecommendCount,
		src.RecommendSum,
		src.OverallCount,
		src.OverallSum,
		src.ETLExecution_ID,
		src.Meta_ComputerName,
		src.Meta_LoadDate,
		src.Meta_Naturalkey,
		src.Meta_LoadDate, --Meta_RowLastChangeDate,
		src.Meta_SourceSystemName,
		src.Meta_Src_Sys_ID,
		src.[User_ID]
		)
		OUTPUT $ACTION INTO @rowCounts;

/* collect merge counts */
SELECT	@InsertedRowCnt = [INSERT]
		, @UpdatedRowCnt = [UPDATE]
FROM	(SELECT MergeAction, 1 ROWS  FROM @rowCounts) AS p
PIVOT	(COUNT(rows) FOR p.MergeAction IN ([INSERT], [UPDATE])) AS pvt
;










```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
