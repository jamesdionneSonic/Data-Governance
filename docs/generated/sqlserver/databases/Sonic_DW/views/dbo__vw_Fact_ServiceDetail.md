---
name: vw_Fact_ServiceDetail
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
CREATE VIEW dbo.vw_Fact_ServiceDetail
AS
SELECT DISTINCT
                         b.EntDealerLvl1, a.ServiceDetailKey, a.EntityKey, a.TechnicianKey, a.OpCodeKey, a.LaborTypeKey, a.ServiceType, a.LineItemType, a.RONumber, a.LineCode_Original, a.LineCode, a.LineNumber, a.LaborSale, a.LaborCost,
                         a.PartsSale, a.PartsCost, a.MiscSale, a.MiscCost, a.SoldHours, a.TimeCardHours, a.Complaint, a.Cause, a.Correction, a.[1LineItemFlag] AS OneLineItemFlag, a.LineItemCount, a.CustomerPayCount, a.InternalCount,
                         a.WarrantyCount, a.cora_acct_id_service, a.cora_acct_id_accounting, COALESCE (a.techno, '-1') AS techno, a.opcode, a.labortype, a.laborsalecompany, a.laborsaleaccount, a.ETLExecution_ID, b.EntStoreBrand, b.EntRegion,
                         b.EntBrand, b.EntBrandOrigin, b.EntDFODRegion, b.EntDFIDRegion, b.EntBrandGroup, d.LbrLaborTypeCategory, 'RO' AS InvSaleType, c.OpcMenu, c.OpcOpCodeDescription, d.LbrLaborTypeDescription, c.OpcOther,
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
                         b.EntFORCEReportFlag, 1 AS ServiceDetailCount, COALESCE (sv.SubletVendorName, '') AS SubletVendorName, COALESCE (sv.SubletVendorKey, - 1) AS SubletVendorKey, CASE WHEN (LaborCost + MiscCost + PartsCost)
                         <> 0 THEN 1 ELSE 0 END AS CostFlag, dbo.vw_Dim_Associate_Current.AsoJobCode
FROM            dbo.Fact_ServiceDetail AS a INNER JOIN
                         dbo.Dim_Entity AS b ON a.EntityKey = b.EntityKey INNER JOIN
                         dbo.vw_Dim_OpCode AS c ON a.OpCodeKey = c.OpCodeKey INNER JOIN
                         dbo.vw_Dim_LaborType AS d ON a.LaborTypeKey = d.LaborTypeKey INNER JOIN
                         dbo.vw_Dim_PricingGrid AS e ON a.PricingGridKey = e.PricingGridKey LEFT OUTER JOIN
                         dbo.Dim_DMSEmployee ON a.TechnicianKey = dbo.Dim_DMSEmployee.AssociateKey LEFT OUTER JOIN
                         dbo.vw_Dim_Associate_Current ON dbo.Dim_DMSEmployee.custno = dbo.vw_Dim_Associate_Current.AsoTimeClockID AND b.EntityKey = dbo.vw_Dim_Associate_Current.EntityKey LEFT OUTER JOIN
                         dbo.Dim_SubletVendor AS sv ON COALESCE (a.techno, '-1') = CAST(sv.SubletVendorKey AS VARCHAR(10)) LEFT OUTER JOIN
                         dbo.vw_Dim_DoorRate AS f ON a.cora_acct_id_service = f.PgrHdrcora_acct_id AND a.LbrGridID = f.PgrGridName
WHERE        (a.BSFlag = 0) AND (b.EntFORCEReportFlag = 'Active')

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
