---
name: FP_Skip_Payoffs
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

CREATE PROC [dbo].[FP_Skip_Payoffs] (@user_id VARCHAR(50) = NULL, @test VARCHAR(50) = NULL)
as
IF NOT EXISTS (SELECT * FROM dbo.Syndicate_Floorplan_Payoffs_Skip WHERE FP_Date = convert(DATE,getdate()))

INSERT INTO Syndicate_Floorplan_Payoffs_Skip (FP_Date, Skip, Meta_UserID,PayoffEarlyDate)
VALUES (CONVERT(DATE,GETDATE()),1,@user_id,NULL)

ELSE
UPDATE dbo.Syndicate_Floorplan_Payoffs_Skip
SET [Skip] = CASE WHEN [Skip] = 1 THEN 0 ELSE 1 END, Meta_UserID = @user_id,PayoffEarlyDate = NULL
WHERE FP_Date = CONVERT(DATE,GETDATE())


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
