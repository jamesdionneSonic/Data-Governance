---
name: vw_Fact_Service
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_Entity
  - Dim_Vehicle
  - Fact_MenuOpportunity
  - Fact_Service
  - Fact_ServiceDetail
  - vw_DM_MileageMeetsModel
dependency_count: 7
column_count: 82
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Dim_Vehicle** (U )
- **dbo.Fact_MenuOpportunity** (U )
- **dbo.Fact_Service** (U )
- **dbo.Fact_ServiceDetail** (U )
- **dbo.vw_DM_MileageMeetsModel** (V )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `EntDealerLvl1`           | varchar  | ✓        |             |
| `ServiceKey`              | int      |          |             |
| `EntityKey`               | int      |          |             |
| `CustomerKey`             | int      |          |             |
| `VehicleKey`              | int      |          |             |
| `ServiceAdvisorKey`       | int      |          |             |
| `OpenDateKey`             | int      |          |             |
| `CloseDateKey`            | int      |          |             |
| `VoidDateKey`             | int      |          |             |
| `LastServiceDateKey`      | int      |          |             |
| `ServiceType`             | varchar  | ✓        |             |
| `RONumber`                | varchar  | ✓        |             |
| `Mileage`                 | int      | ✓        |             |
| `LaborSale`               | money    | ✓        |             |
| `LaborCost`               | money    | ✓        |             |
| `PartsSale`               | money    | ✓        |             |
| `PartsCost`               | money    | ✓        |             |
| `MiscSale`                | money    | ✓        |             |
| `MiscCost`                | money    | ✓        |             |
| `SoldHours`               | numeric  | ✓        |             |
| `ActualHours`             | numeric  | ✓        |             |
| `TimeCardHours`           | numeric  | ✓        |             |
| `cora_acct_id_service`    | int      | ✓        |             |
| `cora_acct_id_accounting` | int      | ✓        |             |
| `custno`                  | varchar  | ✓        |             |
| `vehid`                   | varchar  | ✓        |             |
| `vin`                     | varchar  | ✓        |             |
| `stockno`                 | varchar  | ✓        |             |
| `serviceadvisor`          | varchar  | ✓        |             |
| `opendate`                | datetime | ✓        |             |
| `closedate`               | datetime | ✓        |             |
| `voiddate`                | datetime | ✓        |             |
| `lastservicedate`         | datetime | ✓        |             |
| `laborsalecompany`        | varchar  | ✓        |             |
| `laborsaleaccount`        | varchar  | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `EntStoreBrand`           | varchar  | ✓        |             |
| `EntRegion`               | varchar  | ✓        |             |
| `EntBrand`                | varchar  | ✓        |             |
| `EntDFODRegion`           | varchar  | ✓        |             |
| `EntDFIDRegion`           | varchar  | ✓        |             |
| `EntBrandGroup`           | varchar  | ✓        |             |
| `ROID`                    | varchar  | ✓        |             |
| `VehModelYear`            | int      | ✓        |             |
| `VehicleAge`              | numeric  | ✓        |             |
| `QuarterNum`              | int      | ✓        |             |
| `DATENAME`                | nvarchar | ✓        |             |
| `DayofWeek`               | int      | ✓        |             |
| `fiscalyear`              | int      | ✓        |             |
| `fiscalmonth`             | int      | ✓        |             |
| `VehVIN`                  | varchar  | ✓        |             |
| `VehMakeDesc`             | varchar  | ✓        |             |
| `VehModelDesc`            | varchar  | ✓        |             |
| `VehModelYear2`           | int      | ✓        |             |
| `rostatus`                | tinyint  | ✓        |             |
| `Discounts`               | money    | ✓        |             |
| `ShopSuppliesCost`        | money    | ✓        |             |
| `ShopSuppliesSales`       | money    | ✓        |             |
| `MCost`                   | money    | ✓        |             |
| `MSale`                   | money    | ✓        |             |
| `LCost`                   | money    | ✓        |             |
| `LSale`                   | money    | ✓        |             |
| `SCost`                   | money    | ✓        |             |
| `SSale`                   | money    | ✓        |             |
| `MenuOpportunityFlag`     | int      |          |             |
| `MenuClosedFLag`          | int      |          |             |
| `Menu90Flag`              | int      |          |             |
| `MenuSoldFlag`            | int      |          |             |
| `DaysOpen`                | int      | ✓        |             |
| `ROCount`                 | tinyint  | ✓        |             |
| `DMSCustomerKey`          | int      | ✓        |             |
| `CPFlag`                  | tinyint  | ✓        |             |
| `INTFlag`                 | tinyint  | ✓        |             |
| `WTYFlag`                 | tinyint  | ✓        |             |
| `OTHFlag`                 | tinyint  | ✓        |             |
| `LaborDiscount`           | money    | ✓        |             |
| `PartsDiscount`           | money    | ✓        |             |
| `OriginAppl`              | varchar  | ✓        |             |
| `ClosedFixedOpsDays`      | int      | ✓        |             |
| `EntFORCEReportFlag`      | varchar  | ✓        |             |
| `ModelMeetsMileage`       | int      | ✓        |             |
| `DimVehicleKey`           | bigint   |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_Service
AS
SELECT        b.EntDealerLvl1, a.ServiceKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.VoidDateKey, a.LastServiceDateKey, a.ServiceType, a.RONumber, a.Mileage, a.LaborSale,
                         a.LaborCost, a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.ActualHours, a.TimeCardHours, a.cora_acct_id_service, a.cora_acct_id_accounting, a.custno, a.vehid, a.vin, a.stockno, a.serviceadvisor,
                         a.opendate, a.closedate, a.voiddate, a.lastservicedate, a.laborsalecompany, a.laborsaleaccount, a.ETLExecution_ID, b.EntStoreBrand, b.EntRegion, b.EntBrand, b.EntDFODRegion, b.EntDFIDRegion, b.EntBrandGroup,
                         b.EntDealerLvl1 + a.RONumber AS ROID, c.VehModelYear, CASE WHEN NULLIF (c.VehModelYear, '') IS NULL THEN 0 WHEN NULLIF (c.VehModelYear, - 1) IS NULL THEN 1 WHEN NULLIF (c.VehModelYear, 0) IS NULL
                         THEN 0 WHEN YEAR(a.closedate) = c.VehModelYear THEN 1 ELSE ((YEAR(a.closedate) - c.VehModelYear + 1) * 12.) / 12. END AS VehicleAge, DATEPART(qq, a.closedate) AS QuarterNum, DATENAME(dw, a.closedate)
                         AS DATENAME, DATEPART(dw, a.closedate) AS DayofWeek, DATEPART(yyyy, a.closedate) AS fiscalyear, DATEPART(m, a.closedate) AS fiscalmonth, c.VehVIN, c.VehMakeDesc, c.VehModelDesc,
                         CASE WHEN VehModelYear < 1900 THEN (0 + YEAR(GETDATE())) ELSE VehModelYear END AS VehModelYear2, a.ROStatus AS rostatus, a.Discounts, a.ShopSuppliesCost, a.ShopSuppliesSales, a.MCost, a.MSale, a.LCost,
                         a.LSale, a.SCost, a.SSale, ISNULL(FMO.MenuOpportunityFlag, 0) AS MenuOpportunityFlag, ISNULL(FMO.MenuClosedFlag, 0) AS MenuClosedFLag, ISNULL(FMO.Menu90Flag, 0) AS Menu90Flag,
                         (CASE WHEN a.[ServiceType] IN ('CP') THEN ISNULL(FMO.MenuSoldFlag, 0) ELSE 0 END) AS MenuSoldFlag, DATEDIFF(d, a.opendate, COALESCE (a.closedate, DATEADD(DAY, - 1, GETDATE()))) + 1 AS DaysOpen, a.ROCount,
                         a.DMSCustomerKey, a.CPFlag, a.INTFlag, a.WTYFlag, a.OTHFlag, a.LaborDiscount, a.PartsDiscount, fsd.OriginAppl, dbo.Dim_Date.FixedOpsDayFlag AS ClosedFixedOpsDays, b.EntFORCEReportFlag,
                         COALESCE (MMM.ModelMeetsMileage, 0) AS ModelMeetsMileage, a.NewVehicleKey AS DimVehicleKey
FROM            dbo.Fact_Service AS a INNER JOIN
                         dbo.Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                         dbo.Dim_Date ON a.CloseDateKey = dbo.Dim_Date.DateKey LEFT OUTER JOIN
                         dbo.vw_DM_MileageMeetsModel AS MMM ON a.ServiceKey = MMM.ServiceKey LEFT OUTER JOIN
                         dbo.Dim_Vehicle AS c ON a.VehicleKey = c.VehicleKey LEFT OUTER JOIN
                         dbo.Fact_MenuOpportunity AS FMO ON a.ServiceKey = FMO.ServiceKey LEFT OUTER JOIN
                             (SELECT        ServiceKey, MIN(originappl) AS OriginAppl
                               FROM            dbo.Fact_ServiceDetail
                               GROUP BY ServiceKey) AS fsd ON a.ServiceKey = fsd.ServiceKey
WHERE        (b.EntFORCEReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
