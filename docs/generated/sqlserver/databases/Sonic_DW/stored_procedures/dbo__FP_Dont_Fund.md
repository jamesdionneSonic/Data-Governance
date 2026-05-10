---
name: FP_Dont_Fund
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

CREATE PROC [dbo].[FP_Dont_Fund] (@Vin VARCHAR(20),@Meta_UserID varchar(30))

AS

INSERT INTO dbo.Syndicate_Floorplan_BoA_Dont_Fund (vin, Meta_UserID,Meta_LoadDate)
VALUES (@Vin,@Meta_UserID,getdate())


```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
