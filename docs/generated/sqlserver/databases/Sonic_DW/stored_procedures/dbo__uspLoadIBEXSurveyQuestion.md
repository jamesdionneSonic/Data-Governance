---
name: uspLoadIBEXSurveyQuestion
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
-- 07/05/2022:	DMD - Created procedure
************************************************************************************************************************************/

--EXEC [dbo].[uspLoadIBEXSurveyQuestion]


CREATE PROC [dbo].[uspLoadIBEXSurveyQuestion]
AS

BEGIN
MERGE [Sonic_DW].[dbo].[DimSurveyQuestion] TGT
	USING
		(
		SELECT	DISTINCT
				q.QuestionNumber
				,CASE WHEN q.QuestionText LIKE '%?%' THEN 'Question'
					ELSE 'Action' END AS QuestionBaseType
				,q.QuestionCode
				,q.datatype AS QuestionType
				,q.QuestionText
				--,sr.SurveyID
				,q.Meta_SourceSystemName
				,q.Meta_Src_Sys_ID
		FROM ETL_Staging.stage.IBEXQuestions q
		JOIN [ETL_Staging].[stage].[IBEXSurveyResponse] sr
			ON q.QuestionCode = sr.QuestionCode
		)  SRC
	ON
		TGT.QuestionNumber = SRC.QuestionNumber
		AND TGT.QuestionCode = SRC.QuestionCode
		AND TGT.Meta_SourceSystemName = SRC.Meta_SourceSystemName


WHEN NOT MATCHED THEN INSERT
(
	QuestionBaseType
	,QuestionNumber
	,QuestionType
	,QuestionText
	,SurveyID
	,ETLExecution_ID
	,Meta_ComputerName
	,Meta_LoadDate
	,Meta_SourceSystemName
	,Meta_Src_Sys_ID
	,User_ID
	,QuestionCode
)

VALUES
(
	 SRC.QuestionBaseType
	,SRC.QuestionNumber
	,SRC.QuestionType
	,SRC.QuestionText
	,'-1'		----SurveyID
	,'-1'		----ETLExecution_ID
	,HOST_NAME()
	,GETDATE()
	,SRC.Meta_SourceSystemName
	,SRC.Meta_Src_Sys_ID
	,SYSTEM_USER
	,QuestionCode
)


      ;


END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
