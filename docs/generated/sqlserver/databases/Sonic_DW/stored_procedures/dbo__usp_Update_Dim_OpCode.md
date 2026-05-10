---
name: usp_Update_Dim_OpCode
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



CREATE PROCEDURE [dbo].[usp_Update_Dim_OpCode] 
@OpCodeKey int,
@UserName varchar(20),
@OpCodeCategory varchar(50),
@Menu varchar(50),
@Other varchar(50),
@Weight int

AS 
--
-- ============================================================================
-- Module:  usp_Update_Dim_OpCode
-- Author:  Roger Williams
--   Date:  09/29/2011
--
-- Description:
--   Update Dim_OpCode
--
-- Dependencies:
--   dbo.Dim_OpCode
--
-- Revisions:
-- Date        Name             De
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
