---
name: usp_Load_DM_AdvertistingExpense
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

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[usp_Load_DM_AdvertistingExpense]
AS
BEGIN


IF OBJECT_ID('tempdb..#TempAdvertisingExpense') IS NOT NULL  
	drop table [#TempAdvertisingExpense];

CREATE TABLE #TempAdvertisingExpense (
    EntityKey INT,
    NewUsedID NCHAR(2),
    CalendarYearMonth VARCHAR(7),
    me
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
