---
name: usp_DeleteOldStatstics
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
-- Author:		David Ekren
-- Create date: 7/15/2021
-- Description:	Delete Old Stats from DB, insert Historical data into table in DBA db
-- example execution:     exec dbo.usp_DeleteOldStatstics 'DBA', 1000
-- !!!!!!!!!!!! THIS SP NEEDS TO RESIDE IN THE DB, NOT THE DBA DB. THE HISTORICAL DATA WILL GO INTO THE TABLE OldStatsDeletedHistory IN THE DBA DB !!!!!!!!!!
-- =============================================
CREATE PROCEDURE [dbo].
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
