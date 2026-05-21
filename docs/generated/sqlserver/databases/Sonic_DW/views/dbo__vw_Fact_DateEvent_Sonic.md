---
name: vw_Fact_DateEvent_Sonic
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE   VIEW [dbo].[vw_Fact_DateEvent_Sonic]
AS
SELECT        d.DateKey, ISNULL(f.DateEventID, 0) AS DateEventID
FROM            dbo.Dim_Date AS d LEFT OUTER JOIN
                         (SELECT f1.DateEventID, f1.DateKey FROM dbo.Fact_DateEvent AS f1
                LEFT OUTER JOIN dbo.vw_Dim_DateEvent AS de
                ON f1.DateEventID = de.DateEventID
                WHERE IsSonic = 1 AND IsActive = 1) AS f
                ON d.DateKey = f.DateKey
WHERE        (d.FullDate >= DATEFROMPARTS(YEAR(GETDATE()) - 4, 1, 1)) AND (d.FullDate <= CAST(GETDATE() AS DATE))

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
