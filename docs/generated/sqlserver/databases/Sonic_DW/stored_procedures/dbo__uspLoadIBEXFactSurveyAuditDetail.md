---
name: uspLoadIBEXFactSurveyAuditDetail
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

/**********************************************************************************************************************************
-- CHANGE LOG
-- 07/06/2022:	DMD - Created procedure
-- 11/21/2022:  DMD - Updated subquery in SRC join ON sa.SurveyAuditKey = LTRIM(RTRIM(stg.SurveyID))
************************************************************************************************************************************/

--EXEC [dbo].[uspLoadIBEXFactSurveyAuditDetail]


CREATE PROC [dbo].[uspLoadIBEXFactSurveyAuditDetail]
AS

BEGIN
MERGE [Sonic_DW].[dbo].[FactSurveyAuditDetail] TGT
	USING
		(
			SELECT	sad.SurveyAuditDetailKey
					,q.QuestionID
					,stg.Answer AS QuestionAnswer
					,'1' AS QuestionShown
					,q.QuestionType
					,stg.Meta_SourceSystemName
					,stg.Meta_Src_Sys_ID
					,stg.SurveyID + '*' + stg.EventType + '*' + stg.QuestionCode AS Meta_NaturalKey
					,stg.Delivered AS DateStarted
					,stg.Completed AS DateSubmitted
			FROM [ETL_Staging].[stage].[IBEXSurveyResponse] stg
			JOIN [Sonic_DW].[dbo].[DimSurveyQuestion] q
				ON stg.QuestionCode = q.QuestionCode
				AND stg.Meta_SourceSystemName = q.Meta_SourceSystemName
			JOIN [Sonic_DW].[dbo].[DimSurveyAudit] sa
				ON sa.SurveyAuditKey = LTRIM(RTRIM(stg.SurveyID))
				--AND stg.Meta_SourceSystemName = sa.Meta_SourceSystemName
			JOIN [Sonic_DW].[dbo].DimSurveyAuditDetail sad
				ON sa.SurveyAuditKey = sad.SurveyAuditKey
				AND sa.Meta_SourceSystemName = sad.Meta_SourceSystemName
			--ORDER BY stg.completed desc
		)  SRC
	ON
		TGT.SurveyAuditDetailKey = SRC.SurveyAuditDetailKey
		AND TGT.QuestionID = SRC.QuestionID
		AND TGT.Meta_SourceSystemName = SRC.Meta_SourceSystemName
		AND TGT.Meta_NaturalKey = SRC.Meta_NaturalKey


WHEN NOT MATCHED THEN INSERT
(
	SurveyAuditDetailKey
	,QuestionID
	,QuestionAnswer
	,QuestionShown
	,QuestionType
	,ETLExecution_ID
	,Meta_ComputerName
	,Meta_LoadDate
	,Meta_SourceSystemName
	,Meta_Src_Sys_ID
	,User_ID
	,Meta_NaturalKey
	,DateStarted
	,DateSubmitted
)

VALUES
(
	SRC.SurveyAuditDetailKey
	,SRC.QuestionID
	,SRC.QuestionAnswer
	,SRC.QuestionShown
	,SRC.QuestionType
	,'-1'			----ETLExecution_ID
	,HOST_NAME()
	,GETDATE()
	,SRC.Meta_SourceSystemName
	,SRC.Meta_Src_Sys_ID
	,SYSTEM_USER
	,SRC.Meta_NaturalKey
	,SRC.DateStarted
	,SRC.DateSubmitted
)


      ;


END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
