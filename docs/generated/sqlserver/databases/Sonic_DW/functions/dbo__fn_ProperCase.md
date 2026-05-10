---
name: fn_ProperCase
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
CREATE FUNCTION [dbo].[fn_ProperCase]
(
@InputString varchar(max)
) 
RETURNS varchar(max) 
AS
BEGIN
	IF LEN(@InputString) = 0
	BEGIN
		RETURN ''
	END
	
	SELECT @InputString = LTRIM(RTRIM(LOWER(@InputString)))
	
	DECLARE @i int
	SELECT @i = ASCII('a')
	
	WHILE @i <= ASCII('z')
	BEGIN
		SELECT @InputString = REPLACE(@InputString, ' ' + CHAR(@i), ' ' + CHAR(@i-32))
		SELECT @i = @i + 1
	END

	IF LEFT(@InputString, 1) NOT LIKE '%[0-9]%'	
		SELECT @InputString = CHAR(ASCII(LEF
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
