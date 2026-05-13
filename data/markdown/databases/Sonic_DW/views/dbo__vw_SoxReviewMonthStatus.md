---
name: vw_SoxReviewMonthStatus
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
  - SoxReviewItem
  - SoxReviewResult
  - vw_Dim_Month
  - vw_SoxReview
dependency_count: 5
column_count: 19
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.SoxReviewItem** (U )
- **dbo.SoxReviewResult** (U )
- **dbo.vw_Dim_Month** (V )
- **dbo.vw_SoxReview** (V )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `FiscalMonth`        | int      | ✓        |             |
| `FiscalYear`         | int      | ✓        |             |
| `EntityKey`          | int      |          |             |
| `ReviewID`           | int      | ✓        |             |
| `ReviewStartDate`    | datetime | ✓        |             |
| `ControllerName`     | varchar  | ✓        |             |
| `ReviewCompleteDate` | datetime | ✓        |             |
| `ReviewCompletedBy`  | varchar  | ✓        |             |
| `ReviewStatusID`     | int      | ✓        |             |
| `ReviewStatus`       | varchar  | ✓        |             |
| `ReviewStatusURL`    | varchar  | ✓        |             |
| `CountOK`            | int      | ✓        |             |
| `CountNA`            | int      | ✓        |             |
| `CountReview`        | int      | ✓        |             |
| `CountNR`            | int      | ✓        |             |
| `CountFail`          | int      | ✓        |             |
| `CountQuestions`     | int      | ✓        |             |
| `CountReviewItem`    | int      | ✓        |             |
| `FiscalMonthKey`     | int      |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_SoxReviewMonthStatus]
AS
SELECT        CAST(a_1.FiscalMonth AS INT) AS FiscalMonth, CAST(a_1.FiscalYear AS INT) AS FiscalYear, a_1.EntityKey, b.ReviewID, b.ReviewStartDate, b.ControllerName, b.ReviewCompleteDate, b.ReviewCompletedBy,
                         COALESCE (b.ReviewStatusID, - 1) AS ReviewStatusID, b.ReviewStatus, b.ReviewStatusURL, a_2.CountOK, a_2.CountNA, a_2.CountReview, a_2.CountNR, a_2.CountFail, a_2.CountQuestions,
                         COUNT(r_2.ReviewItem) AS CountReviewItem, a_1.FiscalMonthKey
FROM            (SELECT        a.FiscalMonth, a.FiscalYear, b.EntityKey, a.FiscalMonthKey
                          FROM            dbo.vw_Dim_Month AS a CROSS JOIN
                                                    dbo.Dim_Entity AS b
                          WHERE        (a.StartDate BETWEEN CONVERT(DATETIME, '2013-07-01 00:00:00', 102) AND CONVERT(DATETIME, GETDATE(), 102)) AND (b.EntActive = 'Active') AND (b.EntDefaultDlrshpLvl1 = '1'))
                         AS a_1 LEFT OUTER JOIN
                             (SELECT        ReviewID, SUM(CountOK) AS CountOK, SUM(CountReview) AS CountReview, SUM(CountNA) AS CountNA, SUM(CountNR) AS CountNR, SUM(CountFail) AS CountFail, COUNT(ReviewID)
                                                         AS CountQuestions
                               FROM            (SELECT        CAST(ReviewID AS INT) AS ReviewID, CASE WHEN ReviewResult = 1 THEN 1 ELSE 0 END AS CountOK, CASE WHEN ReviewResult = 0 THEN 1 ELSE 0 END AS CountReview,
                                                                                   CASE WHEN ReviewResult = 2 THEN 1 ELSE 0 END AS CountNA, CASE WHEN ReviewResult = 3 THEN 1 ELSE 0 END AS CountNR,
                                                                                   CASE WHEN ReviewResult = 4 THEN 1 ELSE 0 END AS CountFail
                                                         FROM            dbo.SoxReviewResult AS r) AS r_1
                               GROUP BY ReviewID) AS a_2 INNER JOIN
                         dbo.vw_SoxReview AS b ON a_2.ReviewID = b.ReviewID ON a_1.FiscalMonth = b.ReviewMonth AND a_1.FiscalYear = b.ReviewYear AND a_1.EntityKey = b.EntityKey CROSS JOIN
                         dbo.SoxReviewItem AS r_2
WHERE        (r_2.Meta_IsActive = 1)
GROUP BY CAST(a_1.FiscalMonth AS INT), CAST(a_1.FiscalYear AS INT), a_1.EntityKey, b.ReviewID, b.ReviewStartDate, b.ControllerName, b.ReviewCompleteDate, b.ReviewCompletedBy, COALESCE (b.ReviewStatusID, - 1),
                         b.ReviewStatus, b.ReviewStatusURL, a_2.CountOK, a_2.CountNA, a_2.CountReview, a_2.CountNR, a_2.CountFail, a_2.CountQuestions, a_1.FiscalMonthKey


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
