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
extracted_at: 2026-05-09T12:34:14.349Z
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
FROM         dbo.Fact_PromoMailing AS m LEFT OUTER J
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
