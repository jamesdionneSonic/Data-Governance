---
name: vw_OpsEntityReviewItem
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
CREATE VIEW dbo.vw_OpsEntityReviewItem
AS
SELECT        r.OpsReviewItemID, r.ServiceID, r.StatusID, r.OwnerID, r.OpsReviewID, r.IsBusinessImpacting, dbo.OpsServiceDealership.EntityKey, dbo.OpsServiceDealership.ConsecDays, 
                         dbo.OpsServiceDealership.EntityType, dbo.OpsServiceDealership.TicketNumber, COALESCE (dbo.OpsReviewItemDetail.ActionItems, '-') AS ActionItems, COALESCE (dbo.OpsReviewItemDetail.Comments, '-') 
                         AS Comments, dbo.OpsReviewIte
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
