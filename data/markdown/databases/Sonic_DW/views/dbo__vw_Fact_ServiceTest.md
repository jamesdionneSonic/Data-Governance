---
name: vw_Fact_ServiceTest
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Fact_ServiceDetail
  - vw_Dim_Entity
  - vw_Dim_LaborType
  - vw_Dim_OpCode
  - vw_Dim_PricingGrid
dependency_count: 5
column_count: 102
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Fact_ServiceDetail** (U )
- **dbo.vw_Dim_Entity** (V )
- **dbo.vw_Dim_LaborType** (V )
- **dbo.vw_Dim_OpCode** (V )
- **dbo.vw_Dim_PricingGrid** (V )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `EntDealerLvl1`           | varchar  | ✓        |             |
| `ServiceDetailKey`        | int      |          |             |
| `EntityKey`               | int      |          |             |
| `CustomerKey`             | int      |          |             |
| `VehicleKey`              | int      |          |             |
| `ServiceAdvisorKey`       | int      |          |             |
| `OpenDateKey`             | int      |          |             |
| `CloseDateKey`            | int      |          |             |
| `TechnicianKey`           | int      |          |             |
| `OpCodeKey`               | int      |          |             |
| `LaborTypeKey`            | int      |          |             |
| `ServiceType`             | varchar  | ✓        |             |
| `LineItemType`            | varchar  | ✓        |             |
| `RONumber`                | varchar  |          |             |
| `LineCode_Original`       | varchar  | ✓        |             |
| `LineCode`                | varchar  | ✓        |             |
| `LineNumber`              | int      | ✓        |             |
| `Mileage`                 | int      | ✓        |             |
| `LaborSale`               | money    | ✓        |             |
| `LaborCost`               | money    | ✓        |             |
| `PartsSale`               | money    | ✓        |             |
| `PartsCost`               | money    | ✓        |             |
| `MiscSale`                | money    | ✓        |             |
| `MiscCost`                | money    | ✓        |             |
| `SoldHours`               | numeric  | ✓        |             |
| `TimeCardHours`           | numeric  | ✓        |             |
| `MenuOpportunityFlag`     | int      | ✓        |             |
| `MenuClosedFlag`          | int      | ✓        |             |
| `Menu90Flag`              | int      | ✓        |             |
| `Complaint`               | varchar  | ✓        |             |
| `Cause`                   | varchar  | ✓        |             |
| `Correction`              | varchar  | ✓        |             |
| `OneLineItemFlag`         | int      | ✓        |             |
| `LineItemCount`           | int      | ✓        |             |
| `CustomerPayCount`        | int      | ✓        |             |
| `InternalCount`           | int      | ✓        |             |
| `WarrantyCount`           | int      | ✓        |             |
| `cora_acct_id_service`    | int      | ✓        |             |
| `cora_acct_id_accounting` | int      | ✓        |             |
| `vehid`                   | varchar  | ✓        |             |
| `vin`                     | varchar  | ✓        |             |
| `stockno`                 | varchar  | ✓        |             |
| `serviceadvisor`          | varchar  | ✓        |             |
| `opendate`                | datetime | ✓        |             |
| `closedate`               | datetime | ✓        |             |
| `techno`                  | varchar  | ✓        |             |
| `opcode`                  | varchar  | ✓        |             |
| `labortype`               | varchar  | ✓        |             |
| `laborsalecompany`        | varchar  | ✓        |             |
| `laborsaleaccount`        | varchar  | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `ROCount`                 | int      |          |             |
| `EntStoreBrand`           | varchar  | ✓        |             |
| `EntRegion`               | varchar  | ✓        |             |
| `EntBrand`                | varchar  | ✓        |             |
| `EntBrandOrigin`          | varchar  | ✓        |             |
| `EntDFODRegion`           | varchar  | ✓        |             |
| `EntDFIDRegion`           | varchar  | ✓        |             |
| `EntBrandGroup`           | varchar  | ✓        |             |
| `LbrLaborTypeCategory`    | varchar  | ✓        |             |
| `InvSaleType`             | varchar  |          |             |
| `OpcMenu`                 | varchar  | ✓        |             |
| `OpcOpCodeDescription`    | varchar  | ✓        |             |
| `LbrLaborTypeDescription` | varchar  | ✓        |             |
| `OpcOther`                | varchar  | ✓        |             |
| `VIPCount`                | int      |          |             |
| `GridOpportunityDoneFlag` | int      |          |             |
| `GridOpportunityFlag`     | int      |          |             |
| `OffGridFlag`             | int      | ✓        |             |
| `GridHours`               | numeric  | ✓        |             |
| `GridDollarsActual`       | numeric  | ✓        |             |
| `GridDollarsTest`         | numeric  | ✓        |             |
| `PgrGridName`             | varchar  | ✓        |             |
| `OpcOpCodeGroup`          | varchar  |          |             |
| `QuarterNum`              | int      | ✓        |             |
| `ItemCount`               | int      |          |             |
| `ActualHours`             | numeric  | ✓        |             |
| `DateName`                | nvarchar | ✓        |             |
| `DayofWeek`               | int      | ✓        |             |
| `GridableFlag`            | int      | ✓        |             |
| `PricingGridKey`          | int      |          |             |
| `GridOpCodeOvrd`          | int      |          |             |
| `DaysOpen`                | int      | ✓        |             |
| `MenuUps`                 | int      | ✓        |             |
| `MenuCls`                 | int      | ✓        |             |
| `GridSaleDollars`         | numeric  | ✓        |             |
| `OpcFlatSellRate`         | numeric  | ✓        |             |
| `Upsell`                  | int      |          |             |
| `ShopSuppliesSales`       | money    | ✓        |             |
| `ShopSuppliesCost`        | money    | ✓        |             |
| `ROStatus`                | tinyint  | ✓        |             |
| `OpcWeight`               | int      | ✓        |             |
| `FDCICount`               | int      |          |             |
| `LbrGridID`               | varchar  | ✓        |             |
| `Discounts`               | money    | ✓        |             |
| `custno`                  | varchar  | ✓        |             |
| `MileageHeader`           | int      | ✓        |             |
| `MenuCount`               | int      | ✓        |             |
| `MenuALC`                 | int      | ✓        |             |
| `MenuIPad`                | int      | ✓        |             |
| `BSFlag`                  | int      | ✓        |             |
| `DMSCustomerKey`          | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_ServiceTest
AS
SELECT     b.EntDealerLvl1, a.ServiceDetailKey, a.EntityKey, a.CustomerKey, a.VehicleKey, a.ServiceAdvisorKey, a.OpenDateKey, a.CloseDateKey, a.TechnicianKey,
                      a.OpCodeKey, a.LaborTypeKey, a.ServiceType, a.LineItemType, a.RONumber, a.LineCode_Original, a.LineCode, a.LineNumber, a.Mileage, a.LaborSale, a.LaborCost,
                      a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.TimeCardHours, a.MenuOpportunityFlag, a.MenuClosedFlag, a.Menu90Flag, a.Complaint, a.Cause,
                      a.Correction, a.[1LineItemFlag] AS OneLineItemFlag, a.LineItemCount, a.CustomerPayCount, a.InternalCount, a.WarrantyCount, a.cora_acct_id_service,
                      a.cora_acct_id_accounting, a.vehid, a.vin, a.stockno, a.serviceadvisor, a.opendate, a.closedate, a.techno, a.opcode, a.labortype, a.laborsalecompany,
                      a.laborsaleaccount, a.ETLExecution_ID, CASE WHEN a.LineNumber = 1 THEN 1 ELSE 0 END AS ROCount, b.EntStoreBrand, b.EntRegion, b.EntBrand,
                      b.EntBrandOrigin, b.EntDFODRegion, b.EntDFIDRegion, b.EntBrandGroup, d.LbrLaborTypeCategory, 'RO' AS InvSaleType, c.OpcMenu, c.OpcOpCodeDescription,
                      d.LbrLaborTypeDescription, c.OpcOther, CASE WHEN OpcOther = 'VIP Reinspection' THEN 1 ELSE 0 END AS VIPCount, CASE WHEN a.gridableflag = 1 AND
                      c.opcopcodegroup = 'Repair' AND a.laborsale = gridsaledollars AND c.opcflatsellrate IS NULL THEN 1 ELSE 0 END AS GridOpportunityDoneFlag,
                      CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'Repair' AND c.opcflatsellrate IS NULL THEN 1 ELSE 0 END AS GridOpportunityFlag, a.OffGridFlag,
                      COALESCE (e.EndHours, 0.) AS GridHours, COALESCE (e.PgrGridDollarsActual, 0.) AS GridDollarsActual, COALESCE (e.PgrGridDollarsTest, 0.) AS GridDollarsTest,
                      e.PgrGridName, c.OpcOpCodeGroup, DATEPART(qq, a.closedate) AS QuarterNum, 1 AS ItemCount, a.ActualHours, DATENAME(dw, a.closedate) AS DateName,
                      DATEPART(dw, a.closedate) AS DayofWeek, a.GridableFlag, e.PricingGridKey, CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'repair' AND
                      c.opcflatsellrate IS NOT NULL THEN 1 ELSE 0 END AS GridOpCodeOvrd, CASE WHEN a.LineNumber = 1 THEN DATEDIFF(d, a.opendate, a.closedate)
                      + 1 ELSE 0 END AS DaysOpen, CASE WHEN servicetype <> 'int' THEN MenuOpportunityFlag ELSE 0 END AS MenuUps,
                      CASE WHEN servicetype = 'cp' THEN MenuClosedFlag ELSE 0 END AS MenuCls, a.GridSaleDollars, c.OpcFlatSellRate,
                      CASE WHEN a.UpsellFlag = 1 THEN 1 ELSE 0 END AS Upsell, a.ShopSuppliesSales, a.ShopSuppliesCost, a.ROStatus, c.OpcWeight,
                      CASE WHEN a.fdcilineno = a.linenumber AND servicetype <> 'INT' THEN 1 ELSE 0 END AS FDCICount, a.LbrGridID, a.Discounts, a.custno,
                      CASE WHEN a.linenumber = 1 THEN mileage ELSE NULL END AS MileageHeader, a.MenuSoldFlag AS MenuCount, a.MenuALC, a.MenuIPad, CAST(a.BSFlag AS Int)
                      AS BSFlag, a.DMSCustomerKey
FROM         dbo.Fact_ServiceDetail AS a INNER JOIN
                      dbo.vw_Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                      dbo.vw_Dim_OpCode AS c ON a.OpCodeKey = c.OpCodeKey INNER JOIN
                      dbo.vw_Dim_LaborType AS d ON a.LaborTypeKey = d.LaborTypeKey INNER JOIN
                      dbo.vw_Dim_PricingGrid AS e ON a.PricingGridKey = e.PricingGridKey

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
