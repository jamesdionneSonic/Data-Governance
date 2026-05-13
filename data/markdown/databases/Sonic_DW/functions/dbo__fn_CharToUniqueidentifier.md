---
name: fn_CharToUniqueidentifier
database: Sonic_DW
type: function
schema: dbo
owner: Data Team
tags:
  - function
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: user_function
- **Schema**: dbo

## Parameters

| Name      | Type             | Output | Default |
| --------- | ---------------- | ------ | ------- |
| ``        | uniqueidentifier | Yes    | No      |
| `@charid` | char             | No     | No      |

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
	SET @tpid = @tpid + SUBSTRING(@charid, 17, 2)
	SET @tpid = @tpid + SUBSTRING(@charid, 31, 2)
	SET @tpid = @tpid + SUBSTRING(@charid, 29, 2)
	SET @tpid = @tpid + SUBSTRING(@charid, 27, 2)
	SET @tpid = @tpid + SUBSTRING(@charid, 25, 2)
	SET @uid = CAST(@tpid AS UNIQUEIDENTIFIER)
	RETURN @uid
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
