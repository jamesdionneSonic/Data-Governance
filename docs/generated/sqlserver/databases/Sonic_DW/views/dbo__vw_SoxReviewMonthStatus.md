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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_SoxReviewMonthStatus]
AS
SELECT        CAST(a_1.FiscalMonth AS INT) AS FiscalMonth, CAST(a_1.FiscalYear AS INT) AS FiscalYear, a_1.EntityKey, b.ReviewID, b.ReviewStartDate, b.ControllerName, b.ReviewCompleteDate, b.ReviewCompletedBy, 
                         COALESCE (b.ReviewStatusID, - 1) AS ReviewStatusID, b.ReviewStatus, b.ReviewStatusURL, a_2.CountOK, a_2.CountNA, a_2.CountReview, a_2.CountNR, a_2.CountFail, a_2.CountQuestions, 
                         COUNT(r_
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
