---
name: usp_UpdateSurveyStatus
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

/*---------------------------------
*
*
*MOD001:  Remove reference to PlaybookEntityRel.  -Doug Morgan 03/21/2017
*--------------------------------*/
CREATE PROCEDURE [dbo].[usp_UpdateSurveyStatus]

--exec usp_UpdateSurveyStatus @PlaybookSurveyID, @ScoreUserID
--select * from PlaybookSurvey

@PlaybookSurveyID INT,
@ScoreUserID varchar(100)

AS

SET NOCOUNT ON

DECLARE 

@SurveyStatusID INT,
@CreateDate DATETIME


CREATE TABLE #SurveyStatus
(PlaybookSurveyID INT,
Comple
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
