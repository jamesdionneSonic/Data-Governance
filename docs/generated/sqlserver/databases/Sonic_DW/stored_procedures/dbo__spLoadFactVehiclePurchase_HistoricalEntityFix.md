---
name: spLoadFactVehiclePurchase_HistoricalEntityFix
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

/******************** CHANGE LOG ***************************************************************************
02/14/2023:  Derrick Davis - Create stored proc for MERGE insert/update for historical EntityKey fixes
************************************************************************************************************/

CREATE PROC [dbo].[spLoadFactVehiclePurchase_HistoricalEntityFix]
(
 @insertedRowCnts  INT OUTPUT,  --added on 01/29/2021
 @updatedRowCnts   INT OUTPUT   --added on 01/
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
