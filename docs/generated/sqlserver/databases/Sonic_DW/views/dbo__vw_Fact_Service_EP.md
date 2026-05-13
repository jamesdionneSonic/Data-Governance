---
name: vw_Fact_Service_EP
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
CREATE VIEW dbo.vw_Fact_Service_EP
AS
SELECT        b.EntDealerLvl1, a.ServiceKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.VoidDateKey, a.LastServiceDateKey, a.ServiceType, a.RONumber, a.Mileage, a.LaborSale,
                         a.LaborCost, a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.ActualHours, a.TimeCardHours, a.cora_acct_id_service, a.cora_acct_id_accounting, a.custno, a.vehid, a.vin, a.stockno, a.serviceadvisor,
                         a.opendate, a.closedate, a.voiddate, a.lastservicedate, a.laborsalecompany, a.laborsaleaccount, a.ETLExecution_ID, b.EntStoreBrand, b.EntRegion, b.EntBrand, b.EntDFODRegion, b.EntDFIDRegion, b.EntBrandGroup,
                         b.EntDealerLvl1 + a.RONumber AS ROID, c.ModelYear AS VehModelYear, CASE WHEN NULLIF (c.ModelYear, '') IS NULL THEN 0 WHEN NULLIF (c.ModelYear, - 1) IS NULL THEN 1 WHEN NULLIF (c.ModelYear, 0) IS NULL
                         THEN 0 WHEN YEAR(a.closedate) = c.ModelYear THEN 1 ELSE ((YEAR(a.closedate) - c.ModelYear + 1) * 12.) / 12. END AS VehicleAge, DATEPART(qq, a.closedate) AS QuarterNum, DATENAME(dw, a.closedate) AS DATENAME,
                         DATEPART(dw, a.closedate) AS DayofWeek, DATEPART(yyyy, a.closedate) AS fiscalyear, DATEPART(m, a.closedate) AS fiscalmonth, c.Vin AS VehVIN, c.MakeDescription AS VehMakeDesc, c.ModelDescription AS VehModelDesc,
                         CASE WHEN ModelYear < 1900 THEN (0 + YEAR(GETDATE())) ELSE ModelYear END AS VehModelYear2, a.ROStatus, a.Discounts, a.ShopSuppliesCost, a.ShopSuppliesSales, a.MCost, a.MSale, a.LCost, a.LSale, a.SCost,
                         a.SSale, 0 AS MenuOpportunityFlag, 0 AS MenuClosedFLag, 0 AS Menu90Flag, 0 AS MenuSoldFlag, DATEDIFF(d, a.opendate, COALESCE (a.closedate, DATEADD(DAY, - 1, GETDATE()))) + 1 AS DaysOpen, a.ROCount,
                         a.DMSCustomerKey, a.CPFlag, a.INTFlag, a.WTYFlag, a.OTHFlag, a.LaborDiscount, a.PartsDiscount, NULL AS OriginAppl, dbo.Dim_Date.FixedOpsDayFlag AS ClosedFixedOpsDays, b.EntFORCEReportFlag,
                         CASE WHEN year(a.closedate) - c.ModelYear <= 5 AND a.Mileage <= 50000 THEN '550' WHEN year(a.closedate) - c.ModelYear <= 8 AND
                         a.Mileage <= 80000 THEN '880' WHEN a.mileage > 80000 THEN 'C-Car' ELSE 'Other' END AS ModelMeetsMileage, CASE WHEN year(a.closedate) - c.ModelYear <= 5 AND a.Mileage <= 50000 THEN 1 WHEN year(a.closedate)
                         - c.ModelYear <= 8 AND a.Mileage <= 80000 THEN 2 ELSE 3 END AS VehicleTypeID, COALESCE (ucab.TechnicianKey, - 1) AS UCABTechnicianKey
FROM            dbo.Fact_Service AS a INNER JOIN
                         dbo.Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                         dbo.Dim_Date ON a.CloseDateKey = dbo.Dim_Date.DateKey LEFT OUTER JOIN
                         dbo.vwDimVehicle AS c ON a.vin = c.Vin LEFT OUTER JOIN
                             (SELECT        ServiceKey, TechnicianKey
                               FROM            dbo.Fact_ServiceDetail
                               WHERE        (opcode = 'UCAB')) AS ucab ON a.ServiceKey = ucab.ServiceKey
WHERE        (b.EntFORCEReportFlag = 'Active') AND (b.EntLineOfBusiness = 'EchoPark')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
