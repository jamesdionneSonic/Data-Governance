---
name: vw_Fact_DateEvent
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE   VIEW [dbo].[vw_Fact_DateEvent]
AS
SELECT        d.DateKey, ISNULL(f.DateEventID, 0) AS DateEventID
FROM            dbo.Dim_Date AS d LEFT OUTER JOIN
                         (SELECT f1.DateEventID, f1.DateKey FROM dbo.Fact_DateEvent AS f1
                LEFT OUTER JOIN dbo.vw_Dim_DateEvent AS de
                ON f1.DateEventID = de.DateEventID
                WHERE IsActive = 1) AS f
                ON d.DateKey = f.DateKey
WHERE        (d.FullDate >= DATEFROMPARTS(YEAR(GE
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
