---
name: vw_Fact_SEM_Agg
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_KeyWord
  - Fact_SEM
dependency_count: 2
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_KeyWord** (U )
- **dbo.Fact_SEM** (U )

## Columns

| Name              | Type    | Nullable | Description |
| ----------------- | ------- | -------- | ----------- |
| `EntityKey`       | int     |          |             |
| `DateKey`         | int     |          |             |
| `KeywordProvider` | varchar | ✓        |             |
| `Impressions`     | int     | ✓        |             |
| `Clicks`          | int     | ✓        |             |
| `Cost`            | decimal | ✓        |             |
| `Forms`           | int     | ✓        |             |
| `Calls`           | int     | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_SEM_Agg]
AS
SELECT     dbo.Fact_SEM.EntityKey, dbo.Fact_SEM.DateKey, dbo.Dim_KeyWord.KeywordProvider, SUM(dbo.Fact_SEM.Impressions) AS Impressions, SUM(dbo.Fact_SEM.Clicks)
                      AS Clicks, SUM(dbo.Fact_SEM.Cost) AS Cost, SUM(dbo.Fact_SEM.Forms) AS Forms, SUM(dbo.Fact_SEM.Calls) AS Calls
FROM         dbo.Fact_SEM INNER JOIN
                      dbo.Dim_KeyWord ON dbo.Fact_SEM.KeyWordKey = dbo.Dim_KeyWord.KeyWordKey
GROUP BY dbo.Fact_SEM.EntityKey, dbo.Fact_SEM.DateKey, dbo.Dim_KeyWord.KeywordProvider


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
