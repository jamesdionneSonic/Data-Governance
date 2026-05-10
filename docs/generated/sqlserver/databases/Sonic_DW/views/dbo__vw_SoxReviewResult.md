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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_SoxReviewResult]
AS
SELECT     dbo.SoxReviewResult.*, dbo.vw_SoxReview.FiscalMonthKey
FROM         dbo.SoxReviewResult INNER JOIN
                      dbo.vw_SoxReview ON dbo.SoxReviewResult.ReviewID = dbo.vw_SoxReview.ReviewID


```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
