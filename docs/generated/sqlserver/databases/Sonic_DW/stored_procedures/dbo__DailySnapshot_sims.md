---
name: DailySnapshot_sims
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






CREATE PROCEDURE dbo.DailySnapshot_sims

AS

SET NOCOUNT ON;

/* =========================================================================================
    Author:			Brittany Rogers
    Create date:	8/21/2025
    Description:	take a daily snapshot of the in_transit_recon_SimsTab table

========================================================================================= */

BEGIN

TRUNCATE TABLE dbo.Historical_darpts_Sims

INSERT INTO Historical_darpts_Sims (
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
