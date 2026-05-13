---
name: update_floorplan_payoff_ssc_flag
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Syndicate_Floorplan_Payoff
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

- **dbo.Syndicate_Floorplan_Payoff** (U )

## Parameters

| Name              | Type    | Output | Default |
| ----------------- | ------- | ------ | ------- |
| `@vin`            | varchar | No     | No      |
| `@fpbalance`      | money   | No     | No      |
| `@flag`           | int     | No     | No      |
| `@days_until_due` | int     | No     | No      |
| `@user`           | varchar | No     | No      |

## Definition

```sql

CREATE PROC [dbo].[update_floorplan_payoff_ssc_flag] (@vin VARCHAR(30),@fpbalance MONEY,@flag INT,@days_until_due INT,@user VARCHAR(50) = NULL)
AS
UPDATE dbo.Syndicate_Floorplan_Payoff
SET SSC_Manual_Payoff_Flag = @flag, Meta_UserID = @user, Meta_LastUpdateDate = getdate()
WHERE vin= @vin AND FloorplanBalance = @fpbalance AND days_until_due = @days_until_due AND CONVERT(date,Meta_LoadDate) = CONVERT(date,GETDATE())

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
