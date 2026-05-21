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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
