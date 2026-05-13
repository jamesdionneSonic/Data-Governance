---
name: vw_OpsReview
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - OpsReview
dependency_count: 1
column_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.OpsReview** (U )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `OpsReviewID`        | int      |          |             |
| `CreatedByUserName`  | varchar  | ✓        |             |
| `ModifiedByUserName` | varchar  | ✓        |             |
| `CreatedOnDateTime`  | datetime | ✓        |             |
| `ModifiedOnDateTime` | datetime | ✓        |             |
| `DateKey`            | varchar  | ✓        |             |
| `ServiceType`        | varchar  | ✓        |             |
| `maxReviewFlag`      | int      |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_OpsReview
AS
SELECT        TOP (100) PERCENT a.OpsReviewID, a.CreatedByUserName, a.ModifiedByUserName, a.CreatedOnDateTime, a.ModifiedOnDateTime, CONVERT(varchar(10), a.CreatedOnDateTime, 112) AS DateKey,
                         a.ServiceType, (CASE WHEN maxReview.OpsReviewID IS NULL THEN 0 ELSE 1 END) AS maxReviewFlag
FROM            dbo.OpsReview AS a LEFT OUTER JOIN
                             (SELECT        ServiceType, MAX(OpsReviewID) AS OpsReviewID
                               FROM            dbo.OpsReview
                               GROUP BY ServiceType) AS maxReview ON a.OpsReviewID = maxReview.OpsReviewID

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
