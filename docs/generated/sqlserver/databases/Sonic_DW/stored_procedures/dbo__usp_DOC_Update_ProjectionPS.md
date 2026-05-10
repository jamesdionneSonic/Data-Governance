---
name: usp_DOC_Update_ProjectionPS
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







CREATE PROCEDURE [dbo].[usp_DOC_Update_ProjectionPS]
@EntityID INT,
@NewUnits varchar(50),
@NewPVR varchar(50),
@UsedUnits varchar(50),
@UsedPVR varchar(50),
@FIPVR varchar(50),
@WholesaleGross varchar(50),
@ServiceGross varchar(50),
@PartsGross varchar(50),
@AppGenMerchGross varchar(50),
@NUSalesComp varchar(50),
@ServicePartsComp varchar(50),
@ALComp varchar(50),
@RallyComp varchar(50),
@Spiffs varchar(50),
@FIComp varchar(50),
@CompSuper varchar(50),
@FuelDelEx
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
