---
name: vw_Fact_DateEventList
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

--CREATE VIEW dbo.vw_Fact_DateEventList
--AS
--SELECT
--    d.DateKey,
--    CASE
--        WHEN COUNT(f.DateEventID) = 0
--            THEN '0'
--        ELSE STRING_AGG(CAST(f.DateEventID AS VARCHAR(10)), ',')
--    END AS DateEventIDs
--FROM dbo.Dim_Date d
--LEFT JOIN dbo.Fact_DateEventDate f
--    ON d.DateKey = f.DateKey
--WHERE d.FullDate >= DATEFROMPARTS(YEAR(GETDATE()) - 4, 1, 1)
--  AND d.FullDate <= CAST(GETDATE() AS DATE)
--GROUP BY d.DateKey;
--GO

CREATE VIEW [dbo
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
