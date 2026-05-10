---
name: usp_Update_Survey
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


CREATE PROCEDURE [dbo].[usp_Update_Survey]

@SurveyComments varchar(2000),
@SurveyApproval tinyint,
@ApprovalUserID varchar(100),
@ReviewSignoffID varchar(100),
@CommentUserID varchar(100),
@PlaybookSurveyID int

AS

SET NOCOUNT ON
BEGIN TRY

DECLARE @SurveyStatusID int

CREATE TABLE #SurveyApproval
(PlaybookSurveyID INT,
CompletionPct DECIMAL(19,2),
SurveyStatusID INT
)
INSERT INTO #SurveyApproval 

SELECT Qry_Playbook_Stats.PlaybookSurveyID
      ,CAST(Qry_Playbook_
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
