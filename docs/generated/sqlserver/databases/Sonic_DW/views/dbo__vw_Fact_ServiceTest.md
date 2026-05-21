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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
