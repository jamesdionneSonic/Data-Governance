---
name: FP_Payoff_Early
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

CREATE PROC [dbo].[FP_Payoff_Early] (@user_id VARCHAR(50) = NULL, @payoff_through_date date = NULL)
as
IF NOT EXISTS (SELECT * FROM dbo.Syndicate_Floorplan_Payoffs_Skip WHERE FP_Date = convert(DATE,getdate()))

INSERT INTO Syndicate_Floorplan_Payoffs_Skip (FP_Date, Skip, Meta_UserID,PayoffEarlyDate)
VALUES (CONVERT(DATE,GETDATE()),0,@user_id,@payoff_through_date)

ELSE
UPDATE dbo.Syndicate_Floorplan_Payoffs_Skip
SET PayoffEarlyDate = @payoff_through_date
, Meta_UserID = @user_id
,Skip = 0
WHERE FP_Date = CONVERT(DATE,GETDATE())

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
