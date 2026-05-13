---
name: vw_SoxReviewResult
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - SoxReviewResult
  - vw_SoxReview
dependency_count: 2
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.SoxReviewResult** (U )
- **dbo.vw_SoxReview** (V )

## Columns

| Name                   | Type     | Nullable | Description |
| ---------------------- | -------- | -------- | ----------- |
| `SoxResultID`          | int      |          |             |
| `ReviewID`             | int      |          |             |
| `ReviewItemID`         | int      |          |             |
| `EntityKey`            | int      |          |             |
| `ReviewDate`           | datetime | ✓        |             |
| `ReviewedBy`           | varchar  | ✓        |             |
| `ReviewResult`         | int      | ✓        |             |
| `ReviewComment`        | varchar  | ✓        |             |
| `ControllerReviewed`   | int      | ✓        |             |
| `ControllerReviewDate` | datetime | ✓        |             |
| `TrainingComment`      | varchar  | ✓        |             |
| `RowCreateDate`        | datetime | ✓        |             |
| `FiscalMonthKey`       | int      |          |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_SoxReviewResult]
AS
SELECT     dbo.SoxReviewResult.*, dbo.vw_SoxReview.FiscalMonthKey
FROM         dbo.SoxReviewResult INNER JOIN
                      dbo.vw_SoxReview ON dbo.SoxReviewResult.ReviewID = dbo.vw_SoxReview.ReviewID


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
