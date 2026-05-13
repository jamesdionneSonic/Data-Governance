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
depends_on:
  - Dim_Entity
  - SoxReview
  - SoxReviewStatus
  - vw_Dim_Month
dependency_count: 4
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.SoxReview** (U )
- **dbo.SoxReviewStatus** (U )
- **dbo.vw_Dim_Month** (V )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `ReviewID`           | int      |          |             |
| `EntityKey`          | int      | ✓        |             |
| `ReviewStartDate`    | datetime | ✓        |             |
| `ControllerName`     | varchar  | ✓        |             |
| `ReviewCompleteDate` | datetime |          |             |
| `ReviewCompletedBy`  | varchar  | ✓        |             |
| `ReviewStatusID`     | int      | ✓        |             |
| `ReviewMonth`        | int      | ✓        |             |
| `ReviewStatus`       | varchar  | ✓        |             |
| `ReviewStatusURL`    | varchar  | ✓        |             |
| `ReviewYear`         | int      | ✓        |             |
| `FiscalMonthKey`     | int      |          |             |
| `EntDealerLvl1`      | varchar  | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
