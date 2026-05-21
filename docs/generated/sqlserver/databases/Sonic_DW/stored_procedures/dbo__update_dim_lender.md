---
name: update_dim_lender
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
VALUES (@sonic_grouping,@userid,GETDATE())
END


ELSE IF (@scenario = 3)
BEGIN

UPDATE Sonic_DW.dbo.dim_lender
SET Sonic_Grouping = @sonic_grouping_2, Meta_RowLastChangedDate = GETDATE(), Meta_UserChangeID = @userid
WHERE Sonic_Grouping = @sonic_grouping
END

/*Raj please add below- 20221107*/
ELSE IF (@scenario = 4)
BEGIN

UPDATE Sonic_DW.dbo.dim_lender
SET Sonic_Grouping = @sonic_grouping_2, Meta_RowLastChangedDate = GETDATE(), Meta_UserChangeID = @userid
WHERE name1 = @sonic_grouping
END

/*Raj please add below- 20230202*/
UPDATE dl
SET dl.LenderFICOTierKey = dlm.LenderFICOTierKey, dl.LenderTypeKey = dlm.LenderTypeKey, dl.PreferenceStatus = dlm.PreferenceStatus, dl.Meta_RowLastChangedDate = GETDATE()
FROM dbo.Dim_Lender dl
JOIN (
SELECT Sonic_Grouping,MAX(LenderTypeKey) LenderTypeKey,MAX(LenderFICOTierKey) LenderFICOTierKey,MAX(PreferenceStatus) PreferenceStatus
FROM dbo.Dim_Lender
GROUP BY Sonic_Grouping
HAVING COALESCE(MAX(LenderTypeKey),MAX(LenderFICOTierKey),MAX(PreferenceStatus)) IS not null
) dlm
ON dlm.Sonic_Grouping = dl.Sonic_Grouping
WHERE dl.LenderFICOTierKey IS NULL OR dl.LenderTypeKey IS NULL OR dl.PreferenceStatus IS null


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
