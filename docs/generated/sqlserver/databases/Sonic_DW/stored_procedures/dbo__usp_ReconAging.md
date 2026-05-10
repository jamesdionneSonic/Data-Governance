---
name: usp_ReconAging
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
CREATE PROCEDURE [dbo].[usp_ReconAging]
@EntityKey INT
,@VIN varchar(50)
,@PhaseETA date
,@ReconETA date
,@AgingNotes varchar(600)
,@Meta_User nvarchar(100)
,@StatusName varchar(50)
,@BucketJumperNotes varchar(600)
,@ExteriorCondition varchar(12)
,@InteriorCondition varchar(12)
,@StartRun varchar(12)
,@RoadTest varchar(12)
,@WashVac varchar(12)
,@SmokeSmell varchar(12)
,@LastInspectionDate date

 
 
AS
 
SET NOCOUNT ON
 
/* ========================================================================
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
