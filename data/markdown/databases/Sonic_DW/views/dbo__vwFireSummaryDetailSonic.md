---
name: vwFireSummaryDetailSonic
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
  - dim_DealType
  - Dim_Entity
  - dim_FIGLAccounts
  - dim_FIGLProductCategory
  - factFIRE
dependency_count: 6
column_count: 105
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Date** (U )
- **dbo.dim_DealType** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.dim_FIGLProductCategory** (U )
- **dbo.factFIRE** (U )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `ID`                       | bigint   | ✓        |             |
| `AccountingDate`           | date     |          |             |
| `accountingdatekey`        | int      | ✓        |             |
| `postingdate`              | datetime | ✓        |             |
| `VehicleMileage`           | int      | ✓        |             |
| `AssignedFlag`             | int      |          |             |
| `CertifiedFlag`            | varchar  | ✓        |             |
| `ContractDate`             | date     | ✓        |             |
| `DealNumber`               | varchar  | ✓        |             |
| `DealStatus`               | char     | ✓        |             |
| `EntAccountingPrefix`      | char     | ✓        |             |
| `EntADPCompanyID`          | varchar  | ✓        |             |
| `EntCoraAccountID`         | int      |          |             |
| `EntityKey`                | int      | ✓        |             |
| `EntLineOfBusiness`        | varchar  | ✓        |             |
| `DealTypeFI`               | varchar  | ✓        |             |
| `FIAccountClassification`  | varchar  | ✓        |             |
| `StockNumber`              | varchar  | ✓        |             |
| `BackCost`                 | float    | ✓        |             |
| `BackGross`                | float    | ✓        |             |
| `BackSale`                 | float    | ✓        |             |
| `Chargebacks`              | float    | ✓        |             |
| `ChargebacksOver90`        | float    | ✓        |             |
| `ChargebacksUnder90`       | float    | ✓        |             |
| `Control2`                 | varchar  | ✓        |             |
| `COSAdjustment`            | float    | ✓        |             |
| `DingDentChargeback`       | float    | ✓        |             |
| `DingDentCost`             | float    | ✓        |             |
| `DingDentCount`            | numeric  | ✓        |             |
| `DingDentSale`             | float    | ✓        |             |
| `DocFee`                   | float    | ✓        |             |
| `FactoryBonus`             | float    | ✓        |             |
| `FINet`                    | float    | ✓        |             |
| `FIPack`                   | float    | ✓        |             |
| `FinanceReserveChargeback` | float    | ✓        |             |
| `FinanceReserveCount`      | numeric  | ✓        |             |
| `FinanceReserve`           | float    | ✓        |             |
| `FrontCost`                | float    | ✓        |             |
| `FrontGross`               | float    | ✓        |             |
| `FrontGrossPackDocFactory` | float    | ✓        |             |
| `FrontSale`                | float    | ✓        |             |
| `FrontWeowes`              | numeric  | ✓        |             |
| `fimgrkey`                 | int      | ✓        |             |
| `SalesPerson1Key`          | int      | ✓        |             |
| `SalesPerson2Key`          | int      | ✓        |             |
| `GapChargeback`            | float    | ✓        |             |
| `GapCost`                  | float    | ✓        |             |
| `GapCount`                 | numeric  | ✓        |             |
| `GapSale`                  | float    | ✓        |             |
| `Incentives`               | float    | ✓        |             |
| `LenderKey`                | int      | ✓        |             |
| `OtherAdjustment`          | float    | ✓        |             |
| `Pack`                     | float    | ✓        |             |
| `PenetrationCount`         | numeric  | ✓        |             |
| `PermaPlateChargeback`     | float    | ✓        |             |
| `PermaPlateCost`           | float    | ✓        |             |
| `PermaPlateCount`          | numeric  | ✓        |             |
| `PermaPlateSale`           | float    | ✓        |             |
| `ProductCount`             | numeric  | ✓        |             |
| `Recon`                    | float    | ✓        |             |
| `SaleType`                 | varchar  | ✓        |             |
| `StatCount`                | numeric  | ✓        |             |
| `TradeAllowance`           | numeric  | ✓        |             |
| `TotalGross`               | float    | ✓        |             |
| `VSAChargeback`            | float    | ✓        |             |
| `VSACost`                  | float    | ✓        |             |
| `VSACount`                 | numeric  | ✓        |             |
| `VSASale`                  | float    | ✓        |             |
| `VehicleKey`               | int      | ✓        |             |
| `KeyChargeback`            | float    | ✓        |             |
| `KeyCost`                  | float    | ✓        |             |
| `KeyCount`                 | numeric  | ✓        |             |
| `KeySale`                  | float    | ✓        |             |
| `OtherChargeback`          | float    | ✓        |             |
| `OtherCost`                | float    | ✓        |             |
| `OtherCount`               | numeric  | ✓        |             |
| `OtherSale`                | float    | ✓        |             |
| `InsuranceChargeback`      | float    | ✓        |             |
| `InsuranceCost`            | float    | ✓        |             |
| `InsuranceCount`           | numeric  | ✓        |             |
| `InsuranceSale`            | float    | ✓        |             |
| `LeaseWearTearChargeback`  | float    | ✓        |             |
| `LeaseWearTearCost`        | float    | ✓        |             |
| `LeaseWearTearCount`       | numeric  | ✓        |             |
| `LeaseWearTearSale`        | float    | ✓        |             |
| `PhantomChargeback`        | float    | ✓        |             |
| `PhantomCost`              | float    | ✓        |             |
| `PhantomCount`             | numeric  | ✓        |             |
| `PhantomSale`              | float    | ✓        |             |
| `MaintenanceChargeback`    | float    | ✓        |             |
| `MaintenanceCost`          | float    | ✓        |             |
| `MaintenanceCount`         | numeric  | ✓        |             |
| `MaintenanceSale`          | float    | ✓        |             |
| `RoadstarChargeback`       | float    | ✓        |             |
| `RoadstarCost`             | float    | ✓        |             |
| `RoadstarCount`            | numeric  | ✓        |             |
| `RoadstarSale`             | float    | ✓        |             |
| `TireWheelChargeback`      | float    | ✓        |             |
| `TireWheelCost`            | float    | ✓        |             |
| `TireWheelCount`           | numeric  | ✓        |             |
| `TireWheelSale`            | float    | ✓        |             |
| `SecurityChargeback`       | float    | ✓        |             |
| `SecurityCost`             | float    | ✓        |             |
| `SecurityCount`            | numeric  | ✓        |             |
| `SecuritySale`             | float    | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vwFireSummaryDetailSonic
AS
SELECT        row_number() OVER (ORDER BY e.EntADPCompanyID, f.StockNo, ad.FullDate, e.EntAccountingPrefix) AS ID, ad.FullDate AS AccountingDate, f.accountingdatekey, f.postingdate/*--Added 03/27/20 DMD*/ , MAX(f.VehicleMileage)
VehicleMileage/*Raj add 20220802 ASM*/ , CASE WHEN f.dealno = '-1' THEN 0 ELSE 1 END AS AssignedFlag, MAX(ISNULL(f.CertifiedFlag, 'N')) AS CertifiedFlag, MAX(cd.FullDate) AS ContractDate, f.dealno AS DealNumber,
f.fiwipstatuscode AS DealStatus, e.EntAccountingPrefix, e.EntADPCompanyID, Isnull(e.EntCora_Account_ID, - 1) AS EntCoraAccountID, f.EntityKey, e.EntLineOfBusiness, MAX(d .DealTypeCode) AS DealTypeFI/*NEW COLUMN*/ ,
CASE WHEN a.FIAccount IN (9088) THEN 'Used' ELSE a.FIAccountClassification END AS FIAccountClassification/*only works for EP, 9088 excluded from Sonic			    */ , f.StockNo AS StockNumber, SUM(CASE WHEN a.FIAccountType = 'C' AND
a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS BackCost, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END)
- SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS BackGross, SUM(CASE WHEN a.FIAccountType = 'S' AND
a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS BackSale, SUM(CASE WHEN a.FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS Chargebacks,
SUM(CASE WHEN a.FIAccountCategory = 'Chargeback' AND NOT (a.FIAccountDesc LIKE '%under 90%' OR
a.FIAccount IN (5485, 5995)) THEN ISNULL(F.Amount, 0) ELSE 0 END) AS ChargebacksOver90, SUM(CASE WHEN a.FIAccountCategory = 'Chargeback' AND (a.FIAccountDesc LIKE '%under 90%' OR
a.FIAccount IN (5485, 5995)) THEN ISNULL(F.Amount, 0) ELSE 0 END) AS ChargebacksUnder90, MAX(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN f.control2 ELSE NULL END)
AS Control2/*-to be used in the future to match on dealno*/ , SUM(CASE WHEN a.FIAccount IN (6298, 6399) THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END) AS COSAdjustment, SUM(CASE WHEN a.FIGLProductCategoryKey = 14 AND
a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS DingDentChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 14 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS DingDentCost,
SUM(CASE WHEN a.FIGLProductCategoryKey = 14 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS DingDentCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 14 AND
a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS DingDentSale, SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Doc Fees') THEN (ISNULL(F.Amount, 0) * - 1)
ELSE 0 END) AS DocFee, SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Factory $') THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END) AS FactoryBonus,
SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0)
ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END)
AS FINet/*-subtracts chargebacks - this is what FIRE shows as F&I metric and is used for PRU calc in the application*/ , SUM(CASE WHEN a.FIAccount IN (9088) THEN (ISNULL(f.Amount, 0)) ELSE 0 END) AS FIPack,
SUM(CASE WHEN a.FIGLProductCategoryKey = 1 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS FinanceReserveChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 1 AND
a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS FinanceReserveCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 1 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS FinanceReserve,
SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS FrontCost, SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0)
ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS FrontGross, SUM(CASE WHEN a.FIAccountType = 'S' AND
a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END)
+ SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END) AS FrontGrossPackDocFactory, SUM(CASE WHEN a.FIAccountType = 'S' AND
a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS FrontSale, SUM(ISNULL(f.frontweowes, 0)) AS FrontWeowes, max(f.fimgrkey) AS fimgrkey/* New columns*/ , max(f.SalesPerson1Key)
AS SalesPerson1Key/* New columns*/ , max(SalesPerson2Key) AS SalesPerson2Key/* New columns*/ , SUM(CASE WHEN a.FIGLProductCategoryKey = 9 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END)
AS GapChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 9 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS GapCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 9 AND p.ProductCountFlag = 'Y' AND
a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS GapCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 9 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS GapSale,
SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Incentives') THEN ISNULL(F.Amount, 0) ELSE 0 END) AS Incentives/*Included in frontcost*/ , MAX(f.LenderKey)
AS LenderKey/*add lender name*/ , SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Other') AND a.FIAccount NOT IN (6298, 6399) THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END)
AS OtherAdjustment, SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Pack') THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END) AS Pack,
SUM(CASE WHEN p.PenetrationCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS PenetrationCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 2 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount,
 0) ELSE 0 END) AS PermaPlateChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 2 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS PermaPlateCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 2 AND
p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS PermaPlateCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 2 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END)
AS PermaPlateSale, SUM(CASE WHEN p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN f.statcount ELSE 0 END) AS ProductCount, SUM(CASE WHEN (a.FIAccountType = 'C' AND SUBSTRING(CONVERT(VARCHAR(4), a.FIAccount), 4,
1) IN ('1', '3', '5', '7', '9') AND a.FIAccount BETWEEN 6301 AND 6347) THEN Amount ELSE 0 END) AS Recon, Cast(replace(MAX(f.PurchaseType), '(Buy)', '') AS varchar(20)) AS SaleType,
SUM(CASE WHEN a.FIGLProductCategory = 'FrontGross' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS StatCount/*Units that tie to FIRE and DailyDOC		*/ , SUM(ISNULL(f.totaltradesover, 0)) AS TradeAllowance,
SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount, 0) ELSE 0 END)
 + SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 THEN (ISNULL(F.Amount, 0) * - 1) ELSE 0 END) + SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0)
ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) - SUM(CASE WHEN a.FIAccountType = 'B' AND
a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount, 0) ELSE 0 END) AS TotalGross/*,SUM(ISNULL(f.Amount,0)) AS TotalGross --doesn't calc right in this query*/ , SUM(CASE WHEN a.FIGLProductCategoryKey = 12 AND
a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS VSAChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 12 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS VSACost,
SUM(CASE WHEN a.FIGLProductCategoryKey = 12 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS VSACount, SUM(CASE WHEN a.FIGLProductCategoryKey = 12 AND
a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS VSASale, MAX(f.VehicleKey) AS VehicleKey/*new columns to bring in all additional Sonic products --added 11/11/19*/ , SUM(CASE WHEN a.FIGLProductCategoryKey = 3 AND
a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS KeyChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 3 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS KeyCost,
SUM(CASE WHEN a.FIGLProductCategoryKey = 3 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS KeyCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 3 AND
a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS KeySale, SUM(CASE WHEN a.FIGLProductCategoryKey = 4 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS OtherChargeback,
SUM(CASE WHEN a.FIGLProductCategoryKey = 4 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS OtherCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 4 AND p.ProductCountFlag = 'Y' AND
a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS OtherCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 4 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS OtherSale,
SUM(CASE WHEN a.FIGLProductCategoryKey = 5 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS InsuranceChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 5 AND
a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS InsuranceCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 5 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END)
AS InsuranceCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 5 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS InsuranceSale, SUM(CASE WHEN a.FIGLProductCategoryKey = 6 AND
a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS LeaseWearTearChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 6 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS LeaseWearTearCost,
SUM(CASE WHEN a.FIGLProductCategoryKey = 6 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS LeaseWearTearCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 6 AND
a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS LeaseWearTearSale, SUM(CASE WHEN a.FIGLProductCategoryKey = 7 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS PhantomChargeback,
SUM(CASE WHEN a.FIGLProductCategoryKey = 7 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS PhantomCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 7 AND p.ProductCountFlag = 'Y' AND
a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS PhantomCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 7 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS PhantomSale,
SUM(CASE WHEN a.FIGLProductCategoryKey = 8 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS MaintenanceChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 8 AND
a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS MaintenanceCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 8 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END)
AS MaintenanceCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 8 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS MaintenanceSale, SUM(CASE WHEN a.FIGLProductCategoryKey = 10 AND
a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS RoadstarChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 10 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS RoadstarCost,
SUM(CASE WHEN a.FIGLProductCategoryKey = 10 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS RoadstarCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 10 AND
a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS RoadstarSale, SUM(CASE WHEN a.FIGLProductCategoryKey = 11 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS TireWheelChargeback,
SUM(CASE WHEN a.FIGLProductCategoryKey = 11 AND a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS TireWheelCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 11 AND p.ProductCountFlag = 'Y' AND
a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END) AS TireWheelCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 11 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS TireWheelSale,
SUM(CASE WHEN a.FIGLProductCategoryKey = 13 AND a.FIAccountType = 'B' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS SecurityChargeback, SUM(CASE WHEN a.FIGLProductCategoryKey = 13 AND
a.FIAccountType = 'C' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS SecurityCost, SUM(CASE WHEN a.FIGLProductCategoryKey = 13 AND p.ProductCountFlag = 'Y' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount, 0) ELSE 0 END)
AS SecurityCount, SUM(CASE WHEN a.FIGLProductCategoryKey = 13 AND a.FIAccountType = 'S' THEN ISNULL(f.Amount, 0) ELSE 0 END) AS SecuritySale
FROM            [dbo].[factFIRE](NOLOCK) f INNER JOIN
                         dbo.dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN
                         dbo.dim_FIGLProductCategory p ON a.FIGLProductCategoryKey = p.FIGLProductCategoryKey INNER JOIN
                         dbo.dim_DealType d ON f.DealTypeKey = d .DealTypeKey INNER JOIN
                         dbo.dim_entity e ON e.EntityKey = f.EntityKey INNER JOIN
                         dbo.Dim_Date ad ON f.accountingdatekey = ad.datekey INNER JOIN
                         dbo.Dim_Date cd ON f.ContractDateKey = cd.datekey
WHERE        ad.FullDate BETWEEN DateAdd(m, - 1, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)) AND eomonth(getdate()) /*--    ad.FullDate >= '2014-01-01'		*/ AND FIAccount NOT IN (9030, 9032, 9088)
                         /*Excludes DealerTrade Gain/Loss, FOR EP Only-include FI Pack 9088*/ AND (e.EntLineOfBusiness = 'Sonic' OR
                         e.EntityKey IN (519, 564)) AND e.EntEntityType = 'Dealership' AND e.EntActive = 'active' AND f.IsRetail = 'IsRetail'
/*-FYI - aftermarket should come through FIRE as retail*/ GROUP BY f.EntityKey, e.EntCora_Account_ID, e.EntADPCompanyID, e.EntAccountingPrefix, e.EntLineOfBusiness, CASE WHEN a.FIAccount IN (9088)
                         THEN 'Used' ELSE a.FIAccountClassification END, f.fiwipstatuscode, f.StockNo, ad.FullDate/*,cd.FullDate*/ , f.accountingdatekey, f.postingdate/*--Added 03/27/20 DMD*/ , f.dealno

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
