---
name: usp_FactSurveyAuditDetail
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

/* ******************************************************************************************************** */
/* Date: 2019-08-14		Author: Keveana Carter		Comments: Creation										*/
/* Date: 2021-06-30		Modified: Keveana Carter	Comments: Change to merge/update/insert/delete			*/
/* Date: 2021-09-23		Modified: Keveana Carter	Comments: Include answers not from users & changed answers*/
/* Date:				Modified:					Comments:												*/
/* ******************************************************************************************************** */

CREATE procedure [dbo].[usp_FactSurveyAuditDetail]
as


/* Mismatched sguid = survey completed by webcrawler instead of user - do not include it */
SELECT	dim.SurveyAuditDetailKey
		, q.QuestionID
		, wrk.QuestionAnswer
		, wrk.QuestionShown
		, wrk.QuestionType
		, wrk.ETLExecution_ID
		, wrk.Meta_ComputerName
		, wrk.Meta_LoadDate
		, wrk.Meta_SourceSystemName
		, wrk.Meta_Src_Sys_ID
		, wrk.User_ID
		, convert(varchar,wrk.contactid) + '*' + wrk.sguid as Meta_NaturalKey
		, datestarted
		, DateSubmitted
into	#AuditDetail
FROM	ETL_Staging.wrk.FactSurveyAuditDetail wrk
		INNER JOIN Sonic_DW.dbo.DimSurveyAuditDetail dim
			ON wrk.contactid = dim.SubscriberID
			--AND wrk.sguid = SUBSTRING(dim.invitelink, CHARINDEX('sguid=',Invitelink, 1)+6, LEN(wrk.sguid))
		inner JOIN Sonic_DW.dbo.DimSurveyQuestion as q
			on wrk.QuestionNumber = q.QuestionNumber
;

/* delete old records */
delete  tgt
from	Sonic_dw.dbo.factsurveyauditdetail AS tgt
		inner join #auditDetail src
			on src.meta_naturalkey = tgt.meta_naturalKey

/* insert new and changed answers */
INSERT into Sonic_dw.dbo.factsurveyauditdetail (
	SurveyAuditDetailKey, QuestionID, QuestionAnswer, QuestionShown, QuestionType
	, ETLExecution_ID, Meta_ComputerName, Meta_LoadDate, Meta_SourceSystemName, Meta_Src_Sys_ID, User_ID
	, Meta_NaturalKey, DateStarted, DateSubmitted
	)
select	src.SurveyAuditDetailKey
		, src.QuestionID
		, src.QuestionAnswer
		, src.QuestionShown
		, src.QuestionType
		, src.ETLExecution_ID
		, src.Meta_ComputerName
		, src.Meta_LoadDate
		, src.Meta_SourceSystemName
		, src.Meta_Src_Sys_ID
		, src.User_ID
		, src.Meta_NaturalKey
		, src.datestarted
		, src.datesubmitted
from	#AuditDetail src
;

DROP TABLE #AuditDetail;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
