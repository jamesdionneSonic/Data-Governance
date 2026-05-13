---
name: vw_FactFIRE_A_Thresholds
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

1- **Type**: View

- **Schema**: dbo

## Definition

```sql




CREATE VIEW [dbo].[vw_FactFIRE_A_Thresholds]
AS
SELECT     f.EntityKey,
			f.DealNo,
			f.FIMgrKey,
			f.SalesMgrKey,
			f.SalesPersonKey,
			f.AccountingDateKey,
			f.ContractDateKey,
			f.Stockno,
			f.DealTypeKey,
			f.VehicleKey,
            f.FIGLProductCategoryKey,
			f.FIAccountType,
			f.Amount,
			f.DealCount,
			f.ProductCount,
			f.PenetrationCount,
			tb.SCPenPctHigh,
			tb.SCPenPctLow,
            e.EntBrandGroup,
			COALESCE (v.vehiclemileage, 0) AS VehMileage,
			CASE WHEN f.DealTypeKey = 7 THEN 1 ELSE 0 END AS NewVehFlag,
            0 AS CertifiedVehFlag,
            CASE WHEN v.vehiclemileage = - 1 THEN 'Unknown'
				 WHEN f.DealTypeKey = 7 THEN 'New'
                 when f.DealTypeKey = 1 then 'New'
                 WHEN v.vehiclemileage < 80000 AND
                       YEAR(getdate()) - v.modelyear <= 11 THEN 'Used - Regular'
				 WHEN v.vehiclemileage >= 80000  THEN 'Used - Regular'
                 ELSE 'Unknown'
			END AS VehStockType,
			f.fiwipstatuscode,
			f.CustomerKey
FROM        dbo.factFIRE_A AS f INNER JOIN
                      dbo.Dim_Entity AS e ON f.EntityKey = e.EntityKey LEFT OUTER JOIN
                      dbo.tbl_FIRE_Thresholds_BrandGroup AS tb ON e.EntBrandGroup = tb.Brand_Group LEFT OUTER JOIN
                          (SELECT DISTINCT dealno, stockno, vehiclemileage, year AS modelyear
                            FROM          [cor-sql-02].DMS.dbo.vehiclesalescurrent
                            WHERE      (accountingdate >= '2011-01-01') and vehiclemileage is not null) AS v ON f.DealNo = v.dealno AND f.Stockno = v.stockno
WHERE		f.AccountingDateKey >= 20110101
--and f.entitykey not in (107)--remove philpott fleet









```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
