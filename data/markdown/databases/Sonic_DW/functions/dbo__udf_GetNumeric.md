---
name: udf_GetNumeric
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

| Name               | Type    | Output | Default |
| ------------------ | ------- | ------ | ------- |
| ``                 | varchar | Yes    | No      |
| `@strAlphaNumeric` | varchar | No     | No      |

## Definition

```sql
CREATE FUNCTION dbo.udf_GetNumeric(@strAlphaNumeric VARCHAR(256))
RETURNS VARCHAR(256)
AS
BEGIN
    DECLARE @intAlpha INT
    SET @intAlpha = PATINDEX('%[^0-9]%', @strAlphaNumeric)
    BEGIN
        WHILE @intAlpha > 0
        BEGIN
            SET @strAlphaNumeric = STUFF(@strAlphaNumeric, @intAlpha, 1, '')
            SET @intAlpha = PATINDEX('%[^0-9]%', @strAlphaNumeric)
        END
    END
    RETURN ISNULL(@strAlphaNumeric,0)
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
