---
name: usp_DM_FORCE_Summary_LI
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
-- =============================================
-- Author:		Owen D. McPeak
-- Create date: 2014-03-05
-- Description:	Created for Jon Henin
-- =============================================
CREATE PROCEDURE [dbo].[usp_DM_FORCE_Summary_LI]
	AS
BEGIN
	IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DM_FORCE_Summary_LI]') AND type in (N'U'))
		drop table [Sonic_DW].dbo.DM_FORCE_Summary_LI

	SELECT * INTO [Sonic_DW].dbo.DM_FORCE_Summary_LI
	FROM
	(SELECT a.[Da
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
