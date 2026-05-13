---
name: vw_FactFIRE_A
database: Sonic_DW
type: view
schema: MS
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 3
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

1- **Type**: View

- **Schema**: MS

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.vw_Dim_date** (V )
- **dbo.vw_DimVehicleBridge** (V )

## Definition

```sql








CREATE VIEW [MS].[vw_FactFIRE_A]
AS
SELECT        a1.EntityKey, DealNo, Concat(a1.EntityKey, '.', a1.DealNo) AS DealNoKey, a1.FIMgrKey, a1.SalesMgrKey, a1.SalesPersonKey, a1.AccountingDateKey, a1.ContractDateKey, a1.CashPrice, a1.Stockno, a1.StockType,
                         a1.DealTypeKey, a1.PurchaseType, CASE WHEN TransactionType = 'Product Only' THEN 'Product Only' WHEN ([PurchaseType] = 'Finance(Buy)') THEN 'Finance(Buy)' WHEN ([PurchaseType] = 'Lease')
                         THEN 'Lease' WHEN ([PurchaseType] = 'Cash(Buy)' AND TransactionType = 'Vehicle Deal') THEN 'Cash(Buy)' WHEN TransactionType = 'NA' OR
                         PurchaseType = 'NA' THEN 'NA/Accounting' ELSE [PurchaseType] END AS DealTypeFIRE, a1.TransactionType, a1.IsRetail, a1.VehicleKey, a1.VehicleMileage, a1.VehicleYear, a1.CertifiedFlag,
                         CASE WHEN a3.EntLineOfBusiness = 'EchoPark' AND a1.FIGLProductCategoryKey = 17 THEN 0 ELSE a1.FIGLProductCategoryKey END AS FIGLProductCategoryKey, a1.FIAccountType, a1.Amount, a1.DealCount,
                         a1.ProductCount, a1.PenetrationCount, a1.CustomerKey, a1.fiwipstatuscode, a1.LenderKey, COALESCE(a1.DMSCustomerKey, -1) AS DMSCustomerKey, a2.DaysAlignedFullKey, a1.Age, (CASE WHEN Round(a1.age / 30, 0)
                         + 1 >= 5 THEN 5 WHEN a1.age < 0 THEN 1 ELSE Round(a1.age / 30, 0) + 1 END) AS AgeBucket, a1.FactFireAKey, a4.VehicleKey AS DimVehicleKey
FROM            (SELECT [FactFireAKey]
      ,[EntityKey]
      ,[DealNo]
      ,[FIMgrKey]
      ,[SalesMgrKey]
      ,[SalesPersonKey]
      ,[AccountingDateKey]
      ,[ContractDateKey]
      ,[CashPrice]
      ,[Stockno]
      ,[StockType]
      ,[DealTypeKey]
      ,[PurchaseType]
      ,[TransactionType]
      ,[IsRetail]
      ,[VehicleKey]
      ,[VehicleMileage]
      ,[VehicleYear]
      ,[CertifiedFlag]
      ,[FIGLProductCategoryKey]
      ,[FIAccountType]
      ,[Amount]
      ,[DealCount]
      ,[ProductCount]
      ,[PenetrationCount]
      ,[CustomerKey]
      ,[DMSCustomerKey]
      ,[fiwipstatuscode]
      ,[LenderKey]
      ,[apr]
      ,[age]
      ,[buyrateapr]
      ,[buyrateaddon]
      ,[buyratelfm]
      ,[extwarrantyexpmileslease]
      ,[extwarrantytermlease]
      ,[frontweowesgrosssales]
      ,[mbilimit]
      ,[mbiname]
      ,[mbiterm]
      ,[makename]
      ,[modelname]
      ,[sellrateapr]
      ,[totaltradesover]
      ,[term]
      ,[VSC_RowLastUpdated]
  FROM [Sonic_DW].[dbo].[factFIRE_A]
  WHERE FactFireAKey NOT IN (SELECT FactFireAKey FROM [Sonic_DW].[dbo].[factFIRE_A] WHERE EntityKey IN (59,60) AND AccountingDateKey Between 20240301 AND 20240331)
  UNION
  SELECT [FactFireAKey]
      ,[EntityKey]
      ,[DealNo]
      ,[FIMgrKey]
      ,[SalesMgrKey]
      ,[SalesPersonKey]
      ,[AccountingDateKey]
      ,[ContractDateKey]
      ,[CashPrice]
      ,[Stockno]
      ,[StockType]
      ,[DealTypeKey]
      ,[PurchaseType]
      ,[TransactionType]
      ,[IsRetail]
      ,[VehicleKey]
      ,[VehicleMileage]
      ,[VehicleYear]
      ,[CertifiedFlag]
      ,[FIGLProductCategoryKey]
      ,[FIAccountType]
      ,[Amount]
      ,[DealCount]
      ,[ProductCount]
      ,[PenetrationCount]
      ,[CustomerKey]
      ,[DMSCustomerKey]
      ,[fiwipstatuscode]
      ,[LenderKey]
      ,[apr]
      ,[age]
      ,[buyrateapr]
      ,[buyrateaddon]
      ,[buyratelfm]
      ,[extwarrantyexpmileslease]
      ,[extwarrantytermlease]
      ,[frontweowesgrosssales]
      ,[mbilimit]
      ,[mbiname]
      ,[mbiterm]
      ,[makename]
      ,[modelname]
      ,[sellrateapr]
      ,[totaltradesover]
      ,[term]
      ,[VSC_RowLastUpdated]
  FROM [Sonic_DW].[dbo].[factFIRE_A_BMWMini] WHERE [fiwipstatuscode] = 'F') AS a1 INNER JOIN
                         dbo.vw_Dim_date a2 ON a1.AccountingDateKey = a2.DateKey INNER JOIN
                         dbo.Dim_Entity a3 ON a1.EntityKey = a3.EntityKey LEFT OUTER JOIN
                         (SELECT DISTINCT Dim_VehicleKey, VehicleKey FROM dbo.vw_DimVehicleBridge WHERE Dim_VehicleKey <> -1) AS a4 ON a1.VehicleKey = a4.Dim_VehicleKey
WHERE        ((a1.AccountingDateKey >= CONVERT(VARCHAR(10), DATEADD(yy, - 6, DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0)), 112)) AND (a3.EntLineOfBusiness = 'EchoPark') AND (a1.FIGLProductCategoryKey <> 17) OR
                         (a1.AccountingDateKey >= CONVERT(VARCHAR(10), DATEADD(yy, - 6, DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0)), 112)) AND (a3.EntLineOfBusiness = 'Sonic')) AND NOT ((a3.EntLineOfBusiness = 'Sonic') AND
                         (a1.FIGLProductCategoryKey = 17) AND (a3.EntDFIDRegion = 'RFJ'))

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
