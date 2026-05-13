---
name: corporate_variances_
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - corporate_variances
dependency_count: 1
parameter_count: 5
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.corporate_variances** (U )

## Parameters

| Name             | Type    | Output | Default |
| ---------------- | ------- | ------ | ------- |
| `@month`         | int     | No     | No      |
| `@secrollupkey`  | int     | No     | No      |
| `@departmentkey` | int     | No     | No      |
| `@comment`       | varchar | No     | No      |
| `@user`          | varchar | No     | No      |

## Definition

```sql
CREATE PROC [dbo].[corporate_variances_] (@month int, @secrollupkey int,@departmentkey int,@comment varchar(max),@user varchar(100) = '') AS
IF NOT EXISTS (SELECT * FROM dbo.corporate_variances cv WHERE cv.[SECRollupKey] = @secrollupkey AND cv.FiscalMonthKey = @month AND cv.DepartmentKey = @departmentkey)
BEGIN
INSERT INTO dbo.corporate_variances (FiscalMonthKey,[SECRollupKey], DepartmentKey,Comments,meta_loaddate,approved,denied,mstr_user_input)
VALUES (@month,@secrollupkey,@departmentkey,@comment,getdate(),0,0,@user)
END

ELSE

BEGIN
UPDATE dbo.corporate_variances
SET
    Comments = @comment, meta_loaddate = getdate(),Meta_LastUpdateDate = getdate(), denied = 0,mstr_user_input=@user
WHERE FiscalMonthKey = @month AND [SECRollupKey] = @secrollupkey AND DepartmentKey = @departmentkey
END



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
