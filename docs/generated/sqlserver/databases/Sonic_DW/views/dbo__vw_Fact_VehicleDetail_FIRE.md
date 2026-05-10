---
name: vw_Fact_VehicleDetail_FIRE
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
CREATE VIEW dbo.vw_Fact_VehicleDetail_FIRE
AS
SELECT     EntityKey, AccountingDateKey, VehicleKey, VehicleMileage, StockType, VehicleYear, CertifiedFlag, Stockno, LEFT(Stockno, 1) AS StocknoPrefix, 
                      CASE WHEN StockType = 'New' THEN 'New' WHEN (StockType = 'USED' AND CertifiedFlag = 'Y') THEN 'CPO' WHEN ((StockType = 'Used' OR
                      (StockType = 'NA' AND DealTypeKey = 5)) AND ((VehicleMileage > 80000) OR
                      ((FLOOR(AccountingDateKey / 
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
