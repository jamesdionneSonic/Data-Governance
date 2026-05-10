---
name: fn_UniqueidentifierToCharMSTR
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
SET @tpid = @tpid + SUBSTRING(@charid
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
