---
name: corporate_variances_reviewer
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

-----Alter Sonic_DW.dbo.[corporate_variances_reviewer] to include update proc for the above added column (only addition is the highlighted piece at end of proc):

CREATE PROC [dbo].[corporate_variances_reviewer] (@month INT, @SECRollupKey INT, @departmentkey INT, @approved INT = 0, @denied INT = 0, @reviewer_comment VARCHAR(MAX) = '', @comment VARCHAR(MAX) = '', @CFO_Comment VARCHAR(MAX) = '', @user VARCHAR(100) = '', @SECLevel0_Desc VARCHAR(260) = '', @CorporateVarianceRollup VARCHAR(100) =
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
