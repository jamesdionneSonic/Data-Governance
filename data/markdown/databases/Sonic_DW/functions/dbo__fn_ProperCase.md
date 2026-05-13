---
name: fn_ProperCase
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

| Name           | Type    | Output | Default |
| -------------- | ------- | ------ | ------- |
| ``             | varchar | Yes    | No      |
| `@InputString` | varchar | No     | No      |

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
		SELECT @InputString = CHAR(ASCII(LEFT(@InputString, 1)) - 32) + RIGHT(@InputString, LEN(@InputString) - 1)

	RETURN @InputString
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
