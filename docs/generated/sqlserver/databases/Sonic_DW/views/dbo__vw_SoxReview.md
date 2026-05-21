---
name: vw_SoxReview
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
CREATE VIEW dbo.vw_SoxReview
AS
SELECT        a.ReviewID, a.EntityKey, a.ReviewStartDate, a.ControllerName, a.ReviewCompleteDate, a.ReviewCompletedBy, a.ReviewStatusID, a.ReviewMonth, b.ReviewStatus, b.ReviewStatusURL, YEAR(DATEADD(m, - 1,
                         a.ReviewStartDate)) AS ReviewYear, c.FiscalMonthKey, dbo.Dim_Entity.EntDealerLvl1
FROM            dbo.SoxReview AS a INNER JOIN
                         dbo.SoxReviewStatus AS b ON a.ReviewStatusID = b.ReviewStatusID INNER JOIN
                         dbo.vw_Dim_Month AS c ON a.ReviewMonth = c.FiscalMonth AND YEAR(DATEADD(m, - 1, a.ReviewStartDate)) = c.FiscalYear INNER JOIN
                         dbo.Dim_Entity ON a.EntityKey = dbo.Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
