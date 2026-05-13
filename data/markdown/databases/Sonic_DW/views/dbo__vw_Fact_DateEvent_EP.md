---
name: vw_Fact_DateEvent_EP
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Fact_DateEvent
  - vw_Dim_DateEvent
dependency_count: 3
column_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Fact_DateEvent** (U )
- **dbo.vw_Dim_DateEvent** (V )

## Columns

| Name          | Type | Nullable | Description |
| ------------- | ---- | -------- | ----------- |
| `DateKey`     | int  |          |             |
| `DateEventID` | int  |          |             |

## Definition

```sql

CREATE   VIEW [dbo].[vw_Fact_DateEvent_EP]
AS
SELECT        d.DateKey, ISNULL(f.DateEventID, 0) AS DateEventID
FROM            dbo.Dim_Date AS d LEFT OUTER JOIN
                         (SELECT f1.DateEventID, f1.DateKey FROM dbo.Fact_DateEvent AS f1
                LEFT OUTER JOIN dbo.vw_Dim_DateEvent AS de
                ON f1.DateEventID = de.DateEventID
                WHERE IsEchoPark = 1 AND IsActive = 1) AS f
                ON d.DateKey = f.DateKey
WHERE        (d.FullDate >= DATEFROMPARTS(YEAR(GETDATE()) - 4, 1, 1)) AND (d.FullDate <= CAST(GETDATE() AS DATE))

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
