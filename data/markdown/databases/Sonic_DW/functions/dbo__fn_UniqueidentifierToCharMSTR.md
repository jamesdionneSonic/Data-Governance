---
name: fn_UniqueidentifierToCharMSTR
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

| Name      | Type | Output | Default |
| --------- | ---- | ------ | ------- |
| ``        | char | Yes    | No      |
| `@charid` | char | No     | No      |

## Definition

```sql

CREATE FUNCTION [dbo].[fn_UniqueidentifierToCharMSTR](@charid CHAR(36))
RETURNS CHAR(32)
AS
BEGIN
DECLARE @tpid VARCHAR(32)
SET @tpid = SUBSTRING(@charid, 1, 8)
SET @tpid = @tpid + SUBSTRING(@charid, 15, 4)
SET @tpid = @tpid + SUBSTRING(@charid,  10, 4)
SET @tpid = @tpid + SUBSTRING(@charid, 27, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 25, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 22, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 20, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 35, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 33, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 31, 2)
SET @tpid = @tpid + SUBSTRING(@charid, 29, 2)
RETURN @tpid
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
