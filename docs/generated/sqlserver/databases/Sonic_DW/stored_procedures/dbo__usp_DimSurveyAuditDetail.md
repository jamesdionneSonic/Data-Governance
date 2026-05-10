---
name: usp_DimSurveyAuditDetail
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
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
	
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
