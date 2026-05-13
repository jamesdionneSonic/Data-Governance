---
name: vw_Fact_ServiceTest2
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
  - DM_MileageMeetsModel
  - Fact_MenuOpportunity
  - Fact_Service
  - Fact_ServiceDetail
dependency_count: 6
column_count: 75
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_Entity** (U )
- **dbo.DM_MileageMeetsModel** (U )
- **dbo.Fact_MenuOpportunity** (U )
- **dbo.Fact_Service** (U )
- **dbo.Fact_ServiceDetail** (U )

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
| `QuarterNum`              | int      | ✓        |             |
| `DATENAME`                | nvarchar | ✓        |             |
| `DayofWeek`               | int      | ✓        |             |
| `fiscalyear`              | int      | ✓        |             |
| `fiscalmonth`             | int      | ✓        |             |
| `ROStatus`                | tinyint  | ✓        |             |
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

## Definition

```sql
CREATE VIEW dbo.vw_Fact_ServiceTest2
AS
SELECT        TOP (1000) b.EntDealerLvl1, a.ServiceKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.VoidDateKey, a.LastServiceDateKey, a.ServiceType, a.RONumber, a.Mileage,
                         a.LaborSale, a.LaborCost, a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.ActualHours, a.TimeCardHours, a.cora_acct_id_service, a.cora_acct_id_accounting, a.custno, a.vehid, a.vin, a.stockno,
                         a.serviceadvisor, a.opendate, a.closedate, a.voiddate, a.lastservicedate, a.laborsalecompany, a.laborsaleaccount, a.ETLExecution_ID, b.EntStoreBrand, b.EntRegion, b.EntBrand, b.EntDFODRegion, b.EntDFIDRegion,
                         b.EntBrandGroup, b.EntDealerLvl1 + a.RONumber AS ROID, DATEPART(qq, a.closedate) AS QuarterNum, DATENAME(dw, a.closedate) AS DATENAME, DATEPART(dw, a.closedate) AS DayofWeek, DATEPART(yyyy, a.closedate)
                         AS fiscalyear, DATEPART(m, a.closedate) AS fiscalmonth, a.ROStatus, a.Discounts, a.ShopSuppliesCost, a.ShopSuppliesSales, a.MCost, a.MSale, a.LCost, a.LSale, a.SCost, a.SSale, ISNULL(FMO.MenuOpportunityFlag, 0)
                         AS MenuOpportunityFlag, ISNULL(FMO.MenuClosedFlag, 0) AS MenuClosedFLag, ISNULL(FMO.Menu90Flag, 0) AS Menu90Flag, (CASE WHEN a.[ServiceType] IN ('CP') THEN ISNULL(FMO.MenuSoldFlag, 0) ELSE 0 END)
                         AS MenuSoldFlag, DATEDIFF(d, a.opendate, COALESCE (a.closedate, DATEADD(DAY, - 1, GETDATE()))) + 1 AS DaysOpen, a.ROCount, a.DMSCustomerKey, a.CPFlag, a.INTFlag, a.WTYFlag, a.OTHFlag, a.LaborDiscount,
                         a.PartsDiscount, fsd.OriginAppl, dbo.Dim_Date.FixedOpsDayFlag AS ClosedFixedOpsDays, b.EntFORCEReportFlag, COALESCE (MMM.ModelMeetsMileage, 0) AS ModelMeetsMileage
FROM            dbo.Fact_Service AS a INNER JOIN
                         dbo.Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                         dbo.Dim_Date ON a.CloseDateKey = dbo.Dim_Date.DateKey LEFT OUTER JOIN
                         dbo.DM_MileageMeetsModel AS MMM ON a.ServiceKey = MMM.ServiceKey LEFT OUTER JOIN
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
