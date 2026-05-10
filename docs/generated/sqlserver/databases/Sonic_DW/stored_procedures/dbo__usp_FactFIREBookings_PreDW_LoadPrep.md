---
name: usp_FactFIREBookings_PreDW_LoadPrep
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






CREATE PROC [dbo].[usp_FactFIREBookings_PreDW_LoadPrep]
AS
-- ============================================================================================
-- Author: Sudip Karki
-- Date: 2017.07.10
-- Description: Update the factFireBookingsWeOwe to filter columns value based on dealcriteria

-- =============================================================================================

BEGIN


UPDATE FF

SET 
	apr = CASE WHEN FPC.FIGLProductCategoryKey = 15 AND FGL.
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
