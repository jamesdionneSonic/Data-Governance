---
name: corporate_variances_
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
CREATE PROC [dbo].[corporate_variances_] (@month int, @secrollupkey int,@departmentkey int,@comment varchar(max),@user varchar(100) = '') AS
IF NOT EXISTS (SELECT * FROM dbo.corporate_variances cv WHERE cv.[SECRollupKey] = @secrollupkey AND cv.FiscalMonthKey = @month AND cv.DepartmentKey = @departmentkey)
BEGIN
INSERT INTO dbo.corporate_variances (FiscalMonthKey,[SECRollupKey], DepartmentKey,Comments,meta_loaddate,approved,denied,mstr_user_input)
VALUES (@month,@secrollupkey,@departmentkey,@
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
