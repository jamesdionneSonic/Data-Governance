---
name: PopulateDimDate
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

--Note that all of the columns are defined as NOT NULL. This is ideal for dimension tables, but when trying to incorporate invalid dates, this may not be the best approach. In this example, I do not include any invalid dates.

--And here is a stored procedure I would use to populate it.

CREATE PROCEDURE [dbo].[PopulateDimDate]
     @starting_dt DATE
     , @ending_dt DATE
     , @FiscalYearMonthsOffset int
AS

SET NOCOUNT ON
SET DATEFIRST 7     -- Standard for U.S. Week starts on S
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
