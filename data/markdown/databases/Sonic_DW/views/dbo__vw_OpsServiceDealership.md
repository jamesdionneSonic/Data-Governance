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
depends_on:
  - Dim_Entity
  - OpsReviewItem
  - OpsService
  - OpsServiceDealership
  - vw_OpsReview
dependency_count: 5
column_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.OpsReviewItem** (U )
- **dbo.OpsService** (U )
- **dbo.OpsServiceDealership** (U )
- **dbo.vw_OpsReview** (V )

## Columns

| Name                | Type    | Nullable | Description |
| ------------------- | ------- | -------- | ----------- |
| `EntityKey`         | int     |          |             |
| `OpsReviewItemID`   | int     | ✓        |             |
| `ConsecDays`        | int     | ✓        |             |
| `DateKey`           | varchar | ✓        |             |
| `EntityType`        | varchar | ✓        |             |
| `TicketNumber`      | varchar | ✓        |             |
| `EntDealerLvl1`     | varchar | ✓        |             |
| `ServiceEntityID`   | varchar | ✓        |             |
| `DeleteFlag`        | int     |          |             |
| `EntLineOfBusiness` | varchar | ✓        |             |
| `ServiceDateID`     | varchar | ✓        |             |
| `ServiceID`         | int     |          |             |
| `ItemEntityID`      | varchar | ✓        |             |
| `ServiceName`       | varchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_OpsServiceDealership]
AS
SELECT        dbo.OpsServiceDealership.EntityKey, dbo.OpsServiceDealership.OpsReviewItemID, dbo.OpsServiceDealership.ConsecDays, dbo.vw_OpsReview.DateKey,
                         dbo.OpsServiceDealership.EntityType, dbo.OpsServiceDealership.TicketNumber, dbo.Dim_Entity.EntDealerLvl1, CAST(dbo.OpsReviewItem.ServiceID AS varchar(20))
                         + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)) AS ServiceEntityID, 0 AS DeleteFlag, dbo.Dim_Entity.EntLineOfBusiness,
                         CAST(dbo.OpsReviewItem.ServiceID AS varchar(20)) + '.' + CAST(dbo.vw_OpsReview.DateKey AS varchar(20)) AS ServiceDateID, dbo.OpsReviewItem.ServiceID,
                         CAST(dbo.OpsServiceDealership.OpsReviewItemID AS varchar(20)) + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)) AS ItemEntityID,
                         dbo.OpsService.ServiceName
FROM            dbo.OpsServiceDealership INNER JOIN
                         dbo.OpsReviewItem ON dbo.OpsServiceDealership.OpsReviewItemID = dbo.OpsReviewItem.OpsReviewItemID INNER JOIN
                         dbo.vw_OpsReview ON dbo.OpsReviewItem.OpsReviewID = dbo.vw_OpsReview.OpsReviewID INNER JOIN
                         dbo.Dim_Entity ON dbo.OpsServiceDealership.EntityKey = dbo.Dim_Entity.EntityKey INNER JOIN
                         dbo.OpsService ON dbo.OpsReviewItem.ServiceID = dbo.OpsService.ServiceID


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
