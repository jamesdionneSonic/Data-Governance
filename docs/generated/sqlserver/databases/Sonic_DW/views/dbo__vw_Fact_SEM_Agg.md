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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
