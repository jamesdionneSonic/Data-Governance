---
name: usp_Update_Dim_LaborType
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


CREATE PROCEDURE [dbo].[usp_Update_Dim_LaborType] 
@LaborTypeKey int,
@UserName varchar(20),
@LaborTypeCategory varchar(20),
@GridName varchar(50)
--@OffGridFlag bit
AS 
--
-- ============================================================================
-- Module:  usp_Update_Dim_LaborType
-- Author:  Roger Williams
--   Date:  09/29/2011
--
-- Description:
--   Update Dim_LaborType 
--
-- Dependencies:
--   dbo.Dim_LaborType
--
-- Revisions:
-- Date        Name           
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
