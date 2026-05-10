---
name: UpdIns_FactTrafficSummaryDailyDept_Batched_MTD
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

CREATE   PROCEDURE dbo.UpdIns_FactTrafficSummaryDailyDept_Batched_MTD
AS
BEGIN
/*
04/23/2026 - DATA-16316 - Jasmin Gajera: Created the proc

Execution Command:
EXEC UpdIns_FactTrafficSummaryDailyDept_Batched_MTD

Test SQL:
SELECT COUNT(*) FROM FactTrafficSummaryDailyDept WHERE Meta_RowLastChangeDate > '2026-04-22 18:10:00.000' 

*/
--SET NOCOUNT ON;

DECLARE @BatchSize INT = 10000;

------------------------------------------------------------------
-- 1. Load source into temp
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
