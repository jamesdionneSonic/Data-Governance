---
name: FP_Skip_Payoffs
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Syndicate_Floorplan_Payoffs_Skip
dependency_count: 1
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Syndicate_Floorplan_Payoffs_Skip** (U )

## Parameters

| Name       | Type    | Output | Default |
| ---------- | ------- | ------ | ------- |
| `@user_id` | varchar | No     | No      |
| `@test`    | varchar | No     | No      |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
