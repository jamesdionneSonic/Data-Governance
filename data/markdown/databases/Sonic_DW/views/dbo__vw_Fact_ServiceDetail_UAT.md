---
name: vw_Fact_ServiceDetail_UAT
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
  - Fact_ServiceDetail
  - vw_Dim_DoorRate
  - vw_Dim_LaborType
  - vw_Dim_OpCode
  - vw_Dim_PricingGrid
dependency_count: 6
column_count: 82
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Fact_ServiceDetail** (U )
- **dbo.vw_Dim_DoorRate** (V )
- **dbo.vw_Dim_LaborType** (V )
- **dbo.vw_Dim_OpCode** (V )
- **dbo.vw_Dim_PricingGrid** (V )

## Columns

| Name                      | Type    | Nullable | Description |
| ------------------------- | ------- | -------- | ----------- |
| `EntDealerLvl1`           | varchar | ✓        |             |
| `ServiceDetailKey`        | int     |          |             |
| `EntityKey`               | int     | ✓        |             |
| `TechnicianKey`           | int     |          |             |
| `OpCodeKey`               | int     |          |             |
| `LaborTypeKey`            | int     |          |             |
| `ServiceType`             | varchar | ✓        |             |
| `LineItemType`            | varchar | ✓        |             |
| `RONumber`                | varchar |          |             |
| `LineCode_Original`       | varchar | ✓        |             |
| `LineCode`                | varchar | ✓        |             |
| `LineNumber`              | int     | ✓        |             |
| `LaborSale`               | money   | ✓        |             |
| `LaborCost`               | money   | ✓        |             |
| `PartsSale`               | money   | ✓        |             |
| `PartsCost`               | money   | ✓        |             |
| `MiscSale`                | money   | ✓        |             |
| `MiscCost`                | money   | ✓        |             |
| `SoldHours`               | numeric | ✓        |             |
| `TimeCardHours`           | numeric | ✓        |             |
| `Complaint`               | varchar | ✓        |             |
| `Cause`                   | varchar | ✓        |             |
| `Correction`              | varchar | ✓        |             |
| `OneLineItemFlag`         | int     | ✓        |             |
| `LineItemCount`           | int     | ✓        |             |
| `CustomerPayCount`        | int     | ✓        |             |
| `InternalCount`           | int     | ✓        |             |
| `WarrantyCount`           | int     | ✓        |             |
| `cora_acct_id_service`    | int     | ✓        |             |
| `cora_acct_id_accounting` | int     | ✓        |             |
| `techno`                  | varchar | ✓        |             |
| `opcode`                  | varchar | ✓        |             |
| `labortype`               | varchar | ✓        |             |
| `laborsalecompany`        | varchar | ✓        |             |
| `laborsaleaccount`        | varchar | ✓        |             |
| `ETLExecution_ID`         | int     | ✓        |             |
| `EntStoreBrand`           | varchar | ✓        |             |
| `EntRegion`               | varchar | ✓        |             |
| `EntBrand`                | varchar | ✓        |             |
| `EntBrandOrigin`          | varchar | ✓        |             |
| `EntDFODRegion`           | varchar | ✓        |             |
| `EntDFIDRegion`           | varchar | ✓        |             |
| `EntBrandGroup`           | varchar | ✓        |             |
| `LbrLaborTypeCategory`    | varchar | ✓        |             |
| `InvSaleType`             | varchar |          |             |
| `OpcMenu`                 | varchar | ✓        |             |
| `OpcOpCodeDescription`    | varchar | ✓        |             |
| `LbrLaborTypeDescription` | varchar | ✓        |             |
| `OpcOther`                | varchar | ✓        |             |
| `VIPCount`                | int     |          |             |
| `GridOpportunityDoneFlag` | int     |          |             |
| `GridOpportunityFlag`     | int     |          |             |
| `OffGridFlag`             | int     |          |             |
| `GridHours`               | numeric | ✓        |             |
| `GridDollarsActual`       | numeric | ✓        |             |
| `GridDollarsTest`         | numeric | ✓        |             |
| `PgrGridName`             | varchar | ✓        |             |
| `OpcOpCodeGroup`          | varchar |          |             |
| `ItemCount`               | int     |          |             |
| `ActualHours`             | numeric | ✓        |             |
| `GridableFlag`            | int     | ✓        |             |
| `PricingGridKey`          | int     |          |             |
| `HourRate`                | numeric | ✓        |             |
| `TargetHourRate`          | numeric | ✓        |             |
| `GridOpCodeOvrd`          | int     |          |             |
| `GridSaleDollars`         | numeric | ✓        |             |
| `OpcFlatSellRate`         | numeric | ✓        |             |
| `Upsell`                  | int     |          |             |
| `ShopSuppliesSales`       | money   | ✓        |             |
| `ShopSuppliesCost`        | money   | ✓        |             |
| `OpcWeight`               | int     | ✓        |             |
| `FDCICount`               | int     |          |             |
| `LbrGridID`               | varchar | ✓        |             |
| `Discounts`               | money   | ✓        |             |
| `MenuALC`                 | int     | ✓        |             |
| `MenuIPad`                | int     | ✓        |             |
| `BSFlag`                  | tinyint | ✓        |             |
| `originappl`              | varchar | ✓        |             |
| `origincode`              | varchar | ✓        |             |
| `ServiceKey`              | int     | ✓        |             |
| `FlatSellOverride`        | int     |          |             |
| `EntFORCEReportFlag`      | varchar | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Fact_ServiceDetail_UAT]
AS
SELECT        b.EntDealerLvl1, a.ServiceDetailKey, a.EntityKey, a.TechnicianKey, a.OpCodeKey, a.LaborTypeKey, a.ServiceType, a.LineItemType, a.RONumber, a.LineCode_Original, a.LineCode, a.LineNumber, a.LaborSale, a.LaborCost,
                         a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.TimeCardHours, a.Complaint, a.Cause, a.Correction, a.[1LineItemFlag] AS OneLineItemFlag, a.LineItemCount, a.CustomerPayCount, a.InternalCount,
                         a.WarrantyCount, a.cora_acct_id_service, a.cora_acct_id_accounting, a.techno, a.opcode, a.labortype, a.laborsalecompany, a.laborsaleaccount, a.ETLExecution_ID, b.EntStoreBrand, b.EntRegion, b.EntBrand, b.EntBrandOrigin,
                         b.EntDFODRegion, b.EntDFIDRegion, b.EntBrandGroup, d.LbrLaborTypeCategory, 'RO' AS InvSaleType, c.OpcMenu, c.OpcOpCodeDescription, d.LbrLaborTypeDescription, c.OpcOther,
                         CASE WHEN OpcOther = 'VIP Reinspection' THEN 1 ELSE 0 END AS VIPCount, CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'Repair' AND a.laborsale = gridsaledollars AND c.opcflatsellrate IS NULL AND
                         d .LbrLaborTypeCategory NOT IN ('CP EXT Svc', 'CP Body Shop', 'CP Quick Lube') THEN 1 ELSE 0 END AS GridOpportunityDoneFlag, CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'Repair' AND
                         c.opcflatsellrate IS NULL AND d .LbrLaborTypeCategory NOT IN ('CP EXT Svc', 'CP Body Shop', 'CP Quick Lube') THEN 1 ELSE 0 END AS GridOpportunityFlag, CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'Repair' AND
                          a.laborsale <> gridsaledollars AND c.opcflatsellrate IS NULL AND d .LbrLaborTypeCategory NOT IN ('CP EXT Svc', 'CP Body Shop', 'CP Quick Lube') THEN 1 ELSE 0 END AS OffGridFlag, COALESCE (e.EndHours, 0.)
                         AS GridHours, COALESCE (e.PgrGridDollarsActual, 0.) AS GridDollarsActual, COALESCE (e.PgrGridDollarsTest, 0.) AS GridDollarsTest, e.PgrGridName, c.OpcOpCodeGroup, 1 AS ItemCount, a.ActualHours, a.GridableFlag,
                         e.PricingGridKey, CASE WHEN lbrlabortypecategory = 'WTY' THEN 0 ELSE HourRate END AS HourRate, CASE WHEN lbrlabortypecategory = 'WTY' THEN 0 ELSE TargetHourRate END AS TargetHourRate,
                         CASE WHEN a.gridableflag = 1 AND c.opcopcodegroup = 'repair' AND c.opcflatsellrate IS NOT NULL THEN 1 ELSE 0 END AS GridOpCodeOvrd, a.GridSaleDollars, c.OpcFlatSellRate,
                         CASE WHEN a.UpsellFlag = 1 THEN 1 ELSE 0 END AS Upsell, CASE WHEN a.LineNumber = 1 THEN ShopSuppliesSales ELSE 0 END AS ShopSuppliesSales,
                         CASE WHEN a.LineNumber = 1 THEN ShopSuppliesCost ELSE 0 END AS ShopSuppliesCost, c.OpcWeight, CASE WHEN a.fdcilineno = a.linenumber AND a.servicetype <> 'INT' THEN 1 ELSE 0 END AS FDCICount, a.LbrGridID,
                         a.Discounts, a.MenuALC, a.MenuIPad, a.BSFlag, a.originappl, a.origincode, a.ServiceKey, CASE WHEN c.opcflatsellrate IS NOT NULL AND c.opcflatsellrate <> a.laborsale THEN 1 ELSE 0 END AS FlatSellOverride,
                         b.EntFORCEReportFlag
FROM            dbo.Fact_ServiceDetail AS a INNER JOIN
                         dbo.Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                         dbo.vw_Dim_OpCode AS c ON a.OpCodeKey = c.OpCodeKey INNER JOIN
                         dbo.vw_Dim_LaborType AS d ON a.LaborTypeKey = d.LaborTypeKey INNER JOIN
                         dbo.vw_Dim_PricingGrid AS e ON a.PricingGridKey = e.PricingGridKey LEFT OUTER JOIN
                         dbo.vw_Dim_DoorRate AS f ON a.cora_acct_id_service = f.PgrHdrcora_acct_id AND a.LbrGridID = f.PgrGridName
WHERE        (a.BSFlag = 0) AND (b.EntFORCEReportFlag = 'Active')


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
