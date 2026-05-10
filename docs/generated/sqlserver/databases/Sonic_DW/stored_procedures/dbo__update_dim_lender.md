---
name: update_dim_lender
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
CREATE PROC [dbo].[update_dim_lender] (@lenderkey INT = null, @sonic_grouping varchar(500),@sonic_grouping_2 varchar(100) = NULL,@userid varchar(50),@scenario int)
AS

IF (@scenario = 1)
begin
UPDATE Sonic_DW.dbo.Dim_Lender
SET Sonic_Grouping = @sonic_grouping, Meta_RowLastChangedDate = GETDATE(), Meta_UserChangeID = @userid
WHERE LenderKey = @lenderkey
END

ELSE IF (@scenario = 2)	

BEGIN

INSERT INTO Sonic_DW.dbo.Dim_Lender_Additions (Sonic_Grouping,UserID,Meta_LoadDate)
VALUES 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
