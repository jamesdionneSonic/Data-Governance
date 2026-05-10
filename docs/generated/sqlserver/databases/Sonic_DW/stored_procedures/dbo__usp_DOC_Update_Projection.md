---
name: usp_DOC_Update_Projection
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






CREATE PROCEDURE [dbo].[usp_DOC_Update_Projection]
@EntityID INT,
@NewUnits varchar(50),
@FleetUnits varchar(50),
@UsedUnits varchar(50),
@NewPVR varchar(50),
@UsedPVR varchar(50),
@FIPVR varchar(50),
@NFB varchar(50),  --New Factory Bonus
@NFBPVR varchar(50),
@UFB varchar(50),  --Used Factory Bonus
@WholesaleGross varchar(50),
@ServiceGross varchar(50),
@BodyShopGross varchar(50),
@PartsGross varchar(50),
@NUSalesComp varchar(50),
@CompSuper varchar(50),
@DelExp var
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
