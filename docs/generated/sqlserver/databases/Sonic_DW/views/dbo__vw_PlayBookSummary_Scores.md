---
name: vw_PlayBookSummary_Scores
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
CREATE VIEW dbo.vw_PlayBookSummary_Scores
AS
SELECT     pa99.EntRegion AS Region, pa99.EntHFMDealershipName AS Dealership, SUM(pa99.WJXBFS1) AS Score, SUM(pa99.WJXBFS2) AS Max_Score, SUM(pa99.WJXBFS4) 
                      AS Score_Pct, pa99.PlaybookID, pa99.PbePlaybookYear, SUM(pa99.WJXBFS1) / SUM(pa99.WJXBFS2) AS TotalScore, pa99.PbePlaybookYear - 1 AS pbYearLY, 
                      dbo.PlaybookName.PlaybookNameSub, pa99.EntityKey
FROM         (SELECT     a16.EntRegion, a16.EntDealerLv
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
