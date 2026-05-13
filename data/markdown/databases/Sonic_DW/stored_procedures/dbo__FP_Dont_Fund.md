---
name: FP_Dont_Fund
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Syndicate_Floorplan_BoA_Dont_Fund
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

- **dbo.Syndicate_Floorplan_BoA_Dont_Fund** (U )

## Parameters

| Name           | Type    | Output | Default |
| -------------- | ------- | ------ | ------- |
| `@Vin`         | varchar | No     | No      |
| `@Meta_UserID` | varchar | No     | No      |

## Definition

```sql

CREATE PROC [dbo].[FP_Dont_Fund] (@Vin VARCHAR(20),@Meta_UserID varchar(30))

AS

INSERT INTO dbo.Syndicate_Floorplan_BoA_Dont_Fund (vin, Meta_UserID,Meta_LoadDate)
VALUES (@Vin,@Meta_UserID,getdate())


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
