---
name: uspScoresSendSummaryMail
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


-- =====================================================   
-- Author:       Bhramar Chandrakar   
-- Create date:  14/03/2016    
-- Description:  Send Process Summary In Mail
-- =====================================================
CREATE PROCEDURE [dbo].[uspScoresSendSummaryMail] (
	@LoadDate DATETIME
	,@Profile VARCHAR(500)
	,@ToLine VARCHAR(500)
	,@Prefix VARCHAR(500)
	,@PackageName NVARCHAR(100)
	,@DeletedRowCount INT
	)
AS
BEGIN
	DECLARE @tableHTML NVARCHAR(MAX)
		,@Su
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
