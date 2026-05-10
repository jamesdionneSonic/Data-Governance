---
name: fn_CharToUniqueidentifier
database: Sonic_DW
type: function
schema: dbo
owner: Data Team
tags:
  - function
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: user_function
- **Schema**: dbo

## Definition

```sql

CREATE FUNCTION [dbo].[fn_CharToUniqueidentifier](@charid CHAR(32))
RETURNS UNIQUEIDENTIFIER
AS
BEGIN
	DECLARE @tpid VARCHAR(36)
	DECLARE @uid 	UNIQUEIDENTIFIER
	SET @tpid = SUBSTRING(@charid, 1, 8) + '-'
	SET @tpid = @tpid + SUBSTRING(@charid, 13, 4) + '-'
	SET @tpid = @tpid + SUBSTRING(@charid,   9, 4) + '-'
	SET @tpid = @tpid + SUBSTRING(@charid, 23, 2)
	SET @tpid = @tpid + SUBSTRING(@charid, 21, 2) + '-'
	SET @tpid = @tpid + SUBSTRING(@charid, 19, 2)
	SET @tpid = @tpid + SUBSTR
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
