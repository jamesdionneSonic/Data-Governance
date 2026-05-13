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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         AS Comments, dbo.OpsReviewItemDetail.ItemDetailID, dbo.OpsReviewItemDetail.ModifiedOn, dbo.OpsReviewItemDetail.CreatedOn, dbo.Dim_Entity.EntDealerLvl1,
                         dbo.Dim_Entity.EntRegionalTechnologyManagerID, r.DateKey, dbo.Dim_Entity.EntLineOfBusiness, CAST(r.ServiceID AS varchar(20)) + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20))
                         AS ServiceEntityID, CAST(dbo.OpsServiceDealership.OpsReviewItemID AS varchar(20)) + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)) AS ItemEntityID, dbo.OpsService.ServiceName,
                         CAST(r.ServiceID AS varchar(20)) + '.' + CAST(r.DateKey AS varchar(20)) AS ServiceDateID, CAST(r.ServiceID AS varchar(20)) + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20))
                         + '.' + CAST(r.DateKey AS varchar(20)) AS ServiceEntityDateID, dbo.OpsService.ServiceCategory
FROM            dbo.OpsReviewItemDetail RIGHT OUTER JOIN
                         dbo.OpsService INNER JOIN
                         dbo.vw_OpsReviewItem AS r ON dbo.OpsService.ServiceID = r.ServiceID ON dbo.OpsReviewItemDetail.OpsReviewItemID = r.OpsReviewItemID LEFT OUTER JOIN
                         dbo.Dim_Entity INNER JOIN
                         dbo.OpsServiceDealership ON dbo.Dim_Entity.EntityKey = dbo.OpsServiceDealership.EntityKey ON r.OpsReviewItemID = dbo.OpsServiceDealership.OpsReviewItemID
GROUP BY r.OpsReviewItemID, r.ServiceID, r.StatusID, r.OwnerID, r.OpsReviewID, r.IsBusinessImpacting, dbo.OpsServiceDealership.EntityKey, dbo.OpsServiceDealership.ConsecDays,
                         dbo.OpsServiceDealership.EntityType, dbo.OpsServiceDealership.TicketNumber, COALESCE (dbo.OpsReviewItemDetail.ActionItems, '-'), COALESCE (dbo.OpsReviewItemDetail.Comments, '-'),
                         dbo.OpsReviewItemDetail.ItemDetailID, dbo.OpsReviewItemDetail.ModifiedOn, dbo.OpsReviewItemDetail.CreatedOn, dbo.Dim_Entity.EntDealerLvl1, dbo.Dim_Entity.EntRegionalTechnologyManagerID, r.DateKey,
                         dbo.Dim_Entity.EntLineOfBusiness, CAST(r.ServiceID AS varchar(20)) + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)), CAST(dbo.OpsServiceDealership.OpsReviewItemID AS varchar(20))
                         + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)), dbo.OpsService.ServiceName, CAST(r.ServiceID AS varchar(20)) + '.' + CAST(r.DateKey AS varchar(20)), CAST(r.ServiceID AS varchar(20))
                         + '.' + CAST(dbo.OpsServiceDealership.EntityKey AS varchar(20)) + '.' + CAST(r.DateKey AS varchar(20)), dbo.OpsService.ServiceCategory

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
