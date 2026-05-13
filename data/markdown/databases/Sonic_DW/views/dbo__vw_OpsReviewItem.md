---
name: vw_OpsReviewItem
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - OpsReviewItem
  - OpsReviewItemDetail
  - OpsService
  - vw_OpsReview
dependency_count: 4
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.OpsReviewItem** (U )
- **dbo.OpsReviewItemDetail** (U )
- **dbo.OpsService** (U )
- **dbo.vw_OpsReview** (V )

## Columns

| Name                  | Type    | Nullable | Description |
| --------------------- | ------- | -------- | ----------- |
| `ServiceID`           | int     |          |             |
| `OpsReviewItemID`     | int     |          |             |
| `StatusID`            | int     |          |             |
| `OwnerID`             | varchar |          |             |
| `OpsReviewID`         | int     |          |             |
| `IsBusinessImpacting` | int     | ✓        |             |
| `DateKey`             | varchar | ✓        |             |
| `ActionItems`         | varchar | ✓        |             |
| `Comments`            | varchar | ✓        |             |
| `ServiceDateID`       | varchar | ✓        |             |
| `ServiceName`         | varchar | ✓        |             |
| `ServiceType`         | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_OpsReviewItem
AS
SELECT        a.ServiceID, a.OpsReviewItemID, a.StatusID, a.OwnerID, a.OpsReviewID, a.IsBusinessImpacting, b.DateKey, COALESCE (dbo.OpsReviewItemDetail.ActionItems, '-') AS ActionItems,
                         COALESCE (dbo.OpsReviewItemDetail.Comments, '-') AS Comments, CAST(a.ServiceID AS varchar(20)) + '.' + CAST(b.DateKey AS varchar(20)) AS ServiceDateID, dbo.OpsService.ServiceName,
                         b.ServiceType
FROM            dbo.OpsReviewItem AS a INNER JOIN
                         dbo.vw_OpsReview AS b ON a.OpsReviewID = b.OpsReviewID INNER JOIN
                         dbo.OpsService ON a.ServiceID = dbo.OpsService.ServiceID LEFT OUTER JOIN
                         dbo.OpsReviewItemDetail ON a.OpsReviewItemID = dbo.OpsReviewItemDetail.OpsReviewItemID

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
