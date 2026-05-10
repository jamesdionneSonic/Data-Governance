---
name: vw_OpsServiceDealership
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

CREATE VIEW [dbo].[vw_OpsServiceDealership]
AS
SELECT        dbo.OpsServiceDealership.EntityKey, dbo.OpsServiceDealership.OpsReviewItemID, dbo.OpsServiceDealership.ConsecDays, dbo.vw_OpsReview.DateKey, 
                         dbo.OpsServiceDealership.EntityType, dbo.OpsServiceDealership.TicketNumber, dbo.Dim_Entity.EntDealerLvl1, CAST(dbo.OpsReviewItem.ServiceID AS varchar(20)) 
                         + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)) AS ServiceEntityID, 0
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
