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
extracted_at: 2026-05-09T12:34:14.349Z
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
FROM            dbo.OpsRevi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
