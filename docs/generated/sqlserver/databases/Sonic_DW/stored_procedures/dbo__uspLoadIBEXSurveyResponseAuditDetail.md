---
name: uspLoadIBEXSurveyResponseAuditDetail
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
-- 11/21/2022:  DMD - Updated subquery in SRC join ON sa.SurveyAuditKey = LTRIM(RTRIM(st.SurveyID))
************************************************************************************************************************************/

--EXEC [dbo].[uspLoadIBEXSurveyResponseAuditDetail]


CREATE PROC [dbo].[uspLoadIBEXSurveyResponseAuditDetail]
AS

BEGIN
MERGE [Sonic_DW].[dbo].[DimSurveyAuditDetail] TGT
	USING
		(
			SELECT 	sa.SurveyAuditKey
					,'-1' AS SubscriberID
					,'N/A' AS Invitelink
					,'Active' AS UserStatus
					,'Complete' AS SubscriberStatus
					,sa.SentDate AS DateLastSent
					,st.Completed AS SurveyStartDate
					,st.Completed AS SurveySubmitDate
					,sa.Meta_SourceSystemName
					,sa.Meta_Src_Sys_ID
			FROM [Sonic_DW].[dbo].[DimSurveyAudit] sa
			JOIN [ETL_Staging].[stage].[IBEXSurveyResponseAudit] st
				ON sa.SurveyAuditKey = LTRIM(RTRIM(st.SurveyID))
				--AND sa.StockNumber = st.StockNumber
				--AND sa.Meta_SourceSystemName = st.Meta_SourceSystemName
				--AND sa.Meta_Src_Sys_ID = st.Meta_Src_Sys_ID
			WHERE sa.Meta_SourceSystemName = 'IBEX'
			--ORDER BY SurveySubmitDate desc
		)  SRC
	ON
		TGT.SurveyAuditKey = SRC.SurveyAuditKey
		AND TGT.Meta_SourceSystemName = SRC.Meta_SourceSystemName


WHEN NOT MATCHED THEN INSERT
(
	 SurveyAuditKey
	,SubscriberID
	,Invitelink
	,UserStatus
	,SubscriberStatus
	,DateLastSent
	,CreatedBy
	,CreatedDate
	,SurveyStartDate
	,SurveySubmitDate
	,ETLExecution_ID
	,Meta_ComputerName
	,Meta_RowLastChangeDate
	,Meta_SourceSystemName
	,Meta_Src_Sys_ID
	,[User_ID]
)

VALUES
(
	 SRC.SurveyAuditKey
	,SRC.SubscriberID
	,SRC.Invitelink
	,SRC.UserStatus
	,SRC.SubscriberStatus
	,SRC.DateLastSent
	,SYSTEM_USER
	,GETDATE()
	,SRC.SurveyStartDate
	,SRC.SurveySubmitDate
	,'-1'	----ETLExecution_ID
	,HOST_NAME()
	,GETDATE()
	,SRC.Meta_SourceSystemName
	,SRC.Meta_Src_Sys_ID
	,SYSTEM_USER
)


      ;


END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
