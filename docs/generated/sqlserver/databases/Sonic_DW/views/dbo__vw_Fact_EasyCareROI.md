---
name: vw_Fact_EasyCareROI
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

CREATE VIEW [dbo].[vw_Fact_EasyCareROI]
AS
SELECT      m.Fact_Mail_ID, m.MailedDateKey, m.DimCustomerID, m.EntityKey, m.VehicleKey, m.MailingSuperKey, m.MailPieceKey,
                      m.ExpirationDateKey, m.SentMailCount, m.CouponCount, m.MailCost, s.ServiceType, s.closedate, COUNT(DISTINCT s.RONumber) AS ROCount,
                      SUM(ISNULL(s.LaborSale + s.PartsSale + s.MiscSale + s.ShopSuppliesSales, 0)) AS TotalSaleAmount
FROM         dbo.Fact_PromoMailing AS m LEFT OUTER JOIN
                      [TEST-BISQL-01].Sonic_DW.dbo.Fact_Service AS s ON m.EntityKey = s.EntityKey AND m.DimCustomerID = s.CustomerKey INNER JOIN
                      dbo.Dim_Date AS d1 ON m.MailedDateKey = d1.DateKey INNER JOIN
                      dbo.Dim_Date AS d2 ON s.CloseDateKey = d2.DateKey INNER JOIN
                      dbo.Dim_MailPiece AS p ON p.MailPieceKey = m.MailPieceKey
WHERE     (d2.FullDate BETWEEN d1.FullDate AND DATEADD(dd, 30, d1.FullDate)) AND (p.MailTypeDescription IN (' Customer Recovery Mail',
                      'Declined Repairs Mail ', 'Scheduled Maintenance Mail ', 'State Inspection Reminder Mail'))
GROUP BY m.Fact_Mail_ID, m.MailedDateKey, m.DimCustomerID, m.EntityKey, m.VehicleKey, m.MailingSuperKey, m.MailPieceKey, m.ExpirationDateKey,
                      m.SentMailCount, m.CouponCount, m.MailCost, s.ServiceType, s.closedate


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
