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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
