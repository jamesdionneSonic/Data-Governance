---
name: uspLoadIBEXSurveyQuestion
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
		SE
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
