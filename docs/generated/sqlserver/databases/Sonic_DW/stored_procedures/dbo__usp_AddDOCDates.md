---
name: usp_AddDOCDates
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

-- Fill in the last doc date of the prior month for FinalDocDate, and the first doc date of the new month for StartDocDate
-- For example FinalDocDate = 20240305, StartDocDate = 20240307
-- For the most part FinalDocDate is 3rd business day and FirstDocDate is 5th business day

CREATE PROCEDURE [dbo].[usp_AddDOCDates]
@FinalDocDate INT,
@StartDocDate INT
As

SET NOCOUNT ON

BEGIN TRY

DECLARE @NextMonthStartDate date = DateAdd(d, 1, EOMONTH(CONVERT(CHAR(10), @StartDocDate, 120)))
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
