---
name: usp_DimSurveyAuditDetail
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

CREATE procedure [dbo].[usp_DimSurveyAuditDetail]
as

/* ******************************************************************************************************** */
/* Date: 2021-06-30		Modified: Keveana Carter	Comments: Change to max date & exclude sguid in join	*/
/* Date:				Modified:					Comments:												*/
/* ******************************************************************************************************** */

UPDATE	dbo
SET		dbo.SurveyStartDate = wrk.SurveyStartDate
		, dbo.SurveySubmitDate = wrk.SurveySubmitDate
		, dbo.Meta_RowLastChangeDate = getdate()
FROM	(
		SELECT	contactid
				--,wrk.sguid
				, max(cast(cast(SUBSTRING(wrk.datestarted, 1, 19) AS datetime) at time zone 'Eastern Standard Time' AS datetimeoffset)) AS SurveyStartDate
				, max(cast(cast(SUBSTRING(wrk.datesubmitted, 1, 19) AS datetime) at time zone 'Eastern Standard Time' AS datetimeoffset)) AS SurveySubmitDate
		FROM	ETL_Staging.wrk.FactSurveyAuditDetail AS wrk
		GROUP BY wrk.contactid--, wrk.sguid, wrk.datestarted, wrk.datesubmitted
		) AS wrk
		INNER JOIN sonic_dw.dbo.DimSurveyAuditDetail AS dbo
			ON wrk.contactid = dbo.SubscriberID
			--AND wrk.sguid = SUBSTRING(dbo.invitelink, CHARINDEX('sguid=',Invitelink, 1)+6, LEN(wrk.sguid))
--WHERE	dbo.SurveySubmitDate IS NULL ;
;


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
