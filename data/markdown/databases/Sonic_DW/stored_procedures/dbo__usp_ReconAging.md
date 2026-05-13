---
name: usp_ReconAging
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Fact_ReconAging_TXN
dependency_count: 1
parameter_count: 15
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Fact_ReconAging_TXN** (U )

## Parameters

| Name                  | Type     | Output | Default |
| --------------------- | -------- | ------ | ------- |
| `@EntityKey`          | int      | No     | No      |
| `@VIN`                | varchar  | No     | No      |
| `@PhaseETA`           | date     | No     | No      |
| `@ReconETA`           | date     | No     | No      |
| `@AgingNotes`         | varchar  | No     | No      |
| `@Meta_User`          | nvarchar | No     | No      |
| `@StatusName`         | varchar  | No     | No      |
| `@BucketJumperNotes`  | varchar  | No     | No      |
| `@ExteriorCondition`  | varchar  | No     | No      |
| `@InteriorCondition`  | varchar  | No     | No      |
| `@StartRun`           | varchar  | No     | No      |
| `@RoadTest`           | varchar  | No     | No      |
| `@WashVac`            | varchar  | No     | No      |
| `@SmokeSmell`         | varchar  | No     | No      |
| `@LastInspectionDate` | date     | No     | No      |

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

/* =========================================================================================
Author: Austin McNeill
Create date: 02/18/2025
Description: Insert records to sonic_dw.dbo.Fact_ReconAging_TXN to store comments about
recon aging and estimated completion dates.
========================================================================================= */

BEGIN TRY

---------------------------------------------------------------------------------------------------------------------------------
-- Update Existing Meta_IsCurrent flags
---------------------------------------------------------------------------------------------------------------------------------

UPDATE dbo.Fact_ReconAging_TXN
SET Meta_RowIsCurrent = 0
WHERE EntityKey = @EntityKey
and VIN=@VIN
--and statusname = @StatusName (Testing Purposes)


---------------------------------------------------------------------------------------------------------------------------------
-- Insert New Record
---------------------------------------------------------------------------------------------------------------------------------
INSERT INTO dbo.Fact_ReconAging_TXN
SELECT @Entitykey
,@VIN
,cast(@PhaseETA as date)
,cast(@ReconETA as date)
,@AgingNotes
,@Meta_User
,getdate() --Meta_LoadDate default
,1 --Meta_RowIsCurrent default
,@StatusName
,@BucketJumperNotes
,@ExteriorCondition
,@InteriorCondition
,@StartRun
,@RoadTest
,@WashVac
,@SmokeSmell
,cast(@LastInspectionDate as date)

END TRY

BEGIN CATCH
SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
RETURN -1
END CATCH

SET NOCOUNT OFF
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
