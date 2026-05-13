---
name: vwFactFIRESummaryReport
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 159
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `EntLineOfBusiness`        | varchar  | ✓        |             |
| `EntBrand`                 | varchar  | ✓        |             |
| `EntRegion`                | varchar  | ✓        |             |
| `EntityKey`                | int      |          |             |
| `EntADPCompanyID`          | varchar  | ✓        |             |
| `Dealership`               | varchar  | ✓        |             |
| `FiscalMonthKey`           | int      | ✓        |             |
| `DealType`                 | varchar  |          |             |
| `SaleType`                 | varchar  |          |             |
| `DealStatus`               | varchar  |          |             |
| `StockNumber`              | varchar  |          |             |
| `DealNumber`               | varchar  |          |             |
| `AssignedFlag`             | bit      |          |             |
| `SalesPerson1`             | varchar  |          |             |
| `Salesperson1Name`         | varchar  |          |             |
| `SalesPerson2`             | varchar  |          |             |
| `Salesperson2Name`         | varchar  |          |             |
| `SalesPercent`             | decimal  | ✓        |             |
| `FinanceManager`           | varchar  |          |             |
| `FinanceManagerName`       | varchar  |          |             |
| `SalesManager`             | varchar  |          |             |
| `SalesMangerName`          | varchar  |          |             |
| `ClosingManager`           | varchar  |          |             |
| `ClosingMangerName`        | varchar  |          |             |
| `AccountingDate`           | date     |          |             |
| `ContractDate_FI`          | date     |          |             |
| `BookedDate_FI`            | date     |          |             |
| `OriginalSaleDate_unwind`  | date     | ✓        |             |
| `StatCount`                | int      |          |             |
| `FrontSale`                | numeric  |          |             |
| `FrontCost`                | numeric  |          |             |
| `FrontGross`               | numeric  |          |             |
| `Pack`                     | numeric  |          |             |
| `DocFee`                   | numeric  |          |             |
| `FactoryBonus`             | numeric  |          |             |
| `CostofSaleAdjustment`     | numeric  |          |             |
| `OtherAdjustment`          | numeric  |          |             |
| `FrontGrossPackDocFactory` | numeric  |          |             |
| `FIPack`                   | numeric  |          |             |
| `BackSale`                 | numeric  |          |             |
| `BackCost`                 | numeric  |          |             |
| `BackGross`                | numeric  |          |             |
| `Chargebacks`              | numeric  |          |             |
| `ChargebacksUnder90`       | numeric  |          |             |
| `ChargebacksOver90`        | numeric  |          |             |
| `FINet`                    | numeric  |          |             |
| `Recon_Accounting`         | numeric  |          |             |
| `FrontWeOwes`              | numeric  |          |             |
| `HardWeoweGross`           | numeric  | ✓        |             |
| `Incentives`               | numeric  |          |             |
| `ProductOnlyFlag`          | bit      |          |             |
| `PenetrationCount`         | int      |          |             |
| `ProductCount`             | int      |          |             |
| `FinanceReserveCount`      | int      |          |             |
| `FinanceReserve`           | numeric  |          |             |
| `FinanceReserveChargeback` | numeric  |          |             |
| `VSACount`                 | int      |          |             |
| `VSASale`                  | numeric  |          |             |
| `VSACost`                  | numeric  |          |             |
| `VSAChargeback`            | numeric  |          |             |
| `GapCount`                 | int      |          |             |
| `GapSale`                  | numeric  |          |             |
| `GapCost`                  | numeric  |          |             |
| `GapChargeback`            | numeric  |          |             |
| `DingDentCount`            | int      |          |             |
| `DingDentSale`             | numeric  |          |             |
| `DingDentCost`             | numeric  |          |             |
| `DingDentChargeback`       | numeric  |          |             |
| `PermaPlateCount`          | int      |          |             |
| `PermaPlateSale`           | numeric  |          |             |
| `PermaPlateCost`           | numeric  |          |             |
| `PermaPlateChargeback`     | numeric  |          |             |
| `MaintenanceCount`         | numeric  |          |             |
| `MaintenanceSale`          | int      |          |             |
| `MaintenanceCost`          | int      |          |             |
| `MaintenanceChargeback`    | int      |          |             |
| `PhantomCount`             | numeric  |          |             |
| `PhantomSale`              | int      |          |             |
| `PhantomCost`              | int      |          |             |
| `PhantomChargeback`        | int      |          |             |
| `InsuranceCount`           | numeric  |          |             |
| `InsuranceSale`            | int      |          |             |
| `InsuranceCost`            | int      |          |             |
| `InsuranceChargeback`      | int      |          |             |
| `LeaseWearTearCount`       | numeric  |          |             |
| `LeaseWearTearSale`        | int      |          |             |
| `LeaseWearTearCost`        | int      |          |             |
| `LeaseWearTearChargeback`  | int      |          |             |
| `TireWheelCount`           | numeric  |          |             |
| `TireWheelSale`            | int      |          |             |
| `TireWheelCost`            | int      |          |             |
| `TireWheelChargeback`      | int      |          |             |
| `RoadstarCount`            | numeric  |          |             |
| `RoadstarSale`             | int      |          |             |
| `RoadstarCost`             | int      |          |             |
| `RoadstarChargeback`       | int      |          |             |
| `SecurityCount`            | numeric  |          |             |
| `SecuritySale`             | int      |          |             |
| `SecurityCost`             | int      |          |             |
| `SecurityChargeback`       | int      |          |             |
| `KeyCount`                 | numeric  |          |             |
| `KeySale`                  | int      |          |             |
| `KeyCost`                  | int      |          |             |
| `KeyChargeback`            | int      |          |             |
| `OtherProductCount`        | numeric  |          |             |
| `OtherProductSale`         | int      |          |             |
| `OtherProductCost`         | int      |          |             |
| `OtherProductChargeback`   | int      |          |             |
| `CustomerNumber`           | varchar  |          |             |
| `CustomerName`             | varchar  | ✓        |             |
| `CustomerAddressLine1`     | varchar  | ✓        |             |
| `CustomerAddressLine2`     | varchar  | ✓        |             |
| `CustomerCity`             | varchar  | ✓        |             |
| `CustomerState`            | varchar  | ✓        |             |
| `CustomerZip`              | varchar  | ✓        |             |
| `VIN`                      | varchar  |          |             |
| `CertifiedFlag`            | char     |          |             |
| `Age`                      | int      |          |             |
| `MakeName`                 | varchar  |          |             |
| `ModelName`                | varchar  |          |             |
| `ModelYear`                | int      |          |             |
| `TradeAllowance`           | numeric  |          |             |
| `Trade1Stockno`            | varchar  |          |             |
| `Trade1ACV`                | numeric  |          |             |
| `Trade1Gross`              | numeric  |          |             |
| `Trade1VIN`                | varchar  |          |             |
| `Trade2Stockno`            | varchar  |          |             |
| `Trade2ACV`                | numeric  |          |             |
| `Trade2Gross`              | numeric  |          |             |
| `Trade2VIN`                | varchar  |          |             |
| `FICora`                   | int      |          |             |
| `FIStockNumber`            | varchar  |          |             |
| `CashDown`                 | numeric  |          |             |
| `BankFee`                  | int      |          |             |
| `FinanceCompany`           | varchar  |          |             |
| `FinanceAmount`            | numeric  |          |             |
| `FinanceCharge`            | numeric  |          |             |
| `BuyRate`                  | numeric  |          |             |
| `APR`                      | numeric  |          |             |
| `PointsHeld`               | numeric  |          |             |
| `FinanceReserve_FI`        | numeric  |          |             |
| `Term`                     | int      |          |             |
| `Payment`                  | numeric  |          |             |
| `CashInBankDate`           | date     |          |             |
| `FundedDate`               | varchar  |          |             |
| `DealEvent6`               | varchar  |          |             |
| `dealevent6date`           | date     |          |             |
| `dealevent7`               | varchar  |          |             |
| `dealevent7date`           | date     |          |             |
| `dealevent8`               | varchar  |          |             |
| `dealevent8date`           | date     |          |             |
| `dealevent9`               | varchar  |          |             |
| `dealevent9date`           | date     |          |             |
| `dealevent10`              | varchar  |          |             |
| `dealevent10date`          | date     |          |             |
| `MatchType`                | varchar  |          |             |
| `Dealno_RN`                | bigint   | ✓        |             |
| `Dupe_RN`                  | bigint   | ✓        |             |
| `Meta_LoadDate`            | datetime |          |             |

## Definition

```sql





/************************************************************************************************************************************************/
/*	Change Log								*/
/*	05/05/20:  DMD - Added Dupe_RN column to get rid of true dupes in source query in package																																			*/
/************************************************************************************************************************************************/
 CREATE VIEW [dbo].[vwFactFIRESummaryReport]
AS

select e.EntLineOfBusiness
,e.EntBrand
,e.EntRegion
,f.EntityKey
,e.EntADPCompanyID
,e.entdealerlvl1 as Dealership
,ad.FiscalMonthKey as FiscalMonthKey
,f.DealType
,f.SaleType
,f.DealStatus
,f.StockNumber
,f.DealNumber
,f.AssignedFlag
,f.SalesPerson1
,isnull(s1.EMPName1,'Unknown') as Salesperson1Name
,f.SalesPerson2
,isnull(s2.EMPName1,'Unknown') as Salesperson2Name
,case when isnull(f.SalesPercent,1) = 0 then 1 else isnull(f.SalesPercent,1) end as SalesPercent
,f.FinanceManager
,isnull(fim.EMPName1,'Unknown') as FinanceManagerName
,f.SalesManager
,isnull(sm.EMPName1,'Unknown') as SalesMangerName
,f.ClosingManager
,isnull(cm.EMPName1,'Unknown') as ClosingMangerName
,ad.fulldate as AccountingDate
,cd.fulldate as ContractDate_FI
,bd.FullDate as BookedDate_FI
,convert(date,f.OriginalAccountingDate) as OriginalSaleDate_unwind
,f.StatCount
,f.FrontSale
,f.FrontCost
,f.FrontGross
,f.Pack
,f.DocFee
,f.FactoryBonus
,f.COSAdj as CostofSaleAdjustment
,f.OtherAdjustment
,f.FrontGrossAllIn as FrontGrossPackDocFactory --rename in fact??
,f.FIPack
,f.BackSale
,f.BackCost
,f.BackGross
,f.Chargebacks
,f.ChargebacksUnder90
,f.ChargebacksOver90
,f.FINet
--,f.TotalGross --remove. not calculating correctly. this should be calculated based on other columns
,f.Recon as Recon_Accounting
,f.FrontWeOwes
,f.HardWeoweGross
,f.Incentives
,f.ProductOnlyFlag
,f.PenetrationCount
,f.ProductCount
,f.FinanceReserveCount
,f.FinanceReserve
,f.FinanceReserveChargeback
,f.VSACount
,f.VSASale
,f.VSACost
,f.VSAChargeback
,f.GapCount
,f.GapSale
,f.GapCost
,f.GapChargeback
,f.DingDentCount
,f.DingDentSale
,f.DingDentCost
,f.DingDentChargeback
,f.PermaPlateCount
,f.PermaPlateSale
,f.PermaPlateCost
,f.PermaPlateChargeback
--sonic products
,f.MaintenanceCount
,f.MaintenanceSale
,f.MaintenanceCost
,f.MaintenanceChargeback
,f.PhantomCount
,f.PhantomSale
,f.PhantomCost
,f.PhantomChargeback
,f.InsuranceCount
,f.InsuranceSale
,f.InsuranceCost
,f.InsuranceChargeback
,f.LeaseWearTearCount
,f.LeaseWearTearSale
,f.LeaseWearTearCost
,f.LeaseWearTearChargeback
,f.TireWheelCount
,f.TireWheelSale
,f.TireWheelCost
,f.TireWheelChargeback
,f.RoadstarCount
,f.RoadstarSale
,f.RoadstarCost
,f.RoadstarChargeback
,f.SecurityCount
,f.SecuritySale
,f.SecurityCost
,f.SecurityChargeback
,f.KeyCount
,f.KeySale
,f.KeyCost
,f.KeyChargeback
,f.OtherCount as OtherProductCount
,f.OtherSale as OtherProductSale
,f.OtherCost as OtherProductCost ---fix fact column name
,f.OtherChargeback as OtherProductChargeback
,f.CustomerNumber
,c.DMSCstFullName as CustomerName
,c.DMSCstAddressLine1 as CustomerAddressLine1
,c.DMSCstAddressLine2 as CustomerAddressLine2
,c.DMSCstAddressCity as CustomerCity
,c.DMSCstAddressState as CustomerState
,c.DMSCstAddressZipCode as CustomerZip
,f.VIN
,f.CertifiedFlag
,f.Age
,f.MakeName
,f.ModelName
,f.ModelYear
,f.TradeAllowance
,f.TradeStockNumber as Trade1Stockno
,f.TradeACV as Trade1ACV
,f.TradeGross as Trade1Gross
,f.TradeVIN as Trade1VIN
,f.Trade2StockNumber as Trade2Stockno
,f.Trade2ACV
,f.Trade2Gross
,f.Trade2VIN
,f.FICora
,f.FIStockNumber
,f.CashDown
,f.BankFee
,f.FinanceCompany
--,f.LenderKey --future
--,l.Lender --future
,f.FinanceAmount
,f.FinanceCharge
,f.BuyRate
,f.APR
,f.PointsHeld
,f.FIIncome as FinanceReserve_FI
,f.Term
,f.Payment
,cibd.FullDate as CashInBankDate
,f.FundedDate
,f.DealEvent6
,f.dealevent6date
,f.dealevent7
,f.dealevent7date
,f.dealevent8
,f.dealevent8date
,f.dealevent9
,f.dealevent9date
,f.dealevent10
,f.dealevent10date
,f.MatchType
,case when assignedflag = 1 then ROW_NUMBER() OVER(PARTITION BY e.EntADPCompanyID, ad.fiscalmonthkey, f.stocknumber, f.dealnumber ORDER BY statcount desc, ad.fulldate desc, f.Meta_LoadDate desc)
         else 1 end as Dealno_RN ---will need this to summarize on the Sonic side
,case when assignedflag = 1 then ROW_NUMBER() OVER(PARTITION BY e.EntADPCompanyID, ad.fiscalmonthkey, f.stocknumber, f.dealnumber,  f.FrontSale, f.FrontCost, f.FrontGross, f.FrontGrossAllIn, f.BackSale, f.BackCost, f.BackGross, f.FINet, f.FrontWeOwes, f.FinanceReserve ORDER BY statcount desc, ad.fulldate desc,f.Meta_LoadDate desc)
         else 1 end as Dupe_RN ---Added 05/05/20 for dupes
,f.Meta_LoadDate
--from sonic_dw.dbo.factfiresummary_history f
from sonic_dw.dbo.factfiresummary f
join sonic_dw.dbo.dim_date ad
on f.accountingdatekey = ad.datekey
and ad.FullDate between DateAdd(m, -1, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)) and eomonth(getdate())
join sonic_dw.dbo.dim_date cd
on f.contractdatekey = cd.datekey
join sonic_dw.dbo.dim_date bd
on f.bookeddatekey = bd.datekey
join sonic_dw.dbo.dim_date cibd
on f.cashinbankdatekey = cibd.datekey
join sonic_Dw.dbo.dim_entity e
on f.entitykey = e.entitykey
--5495
---eventually update to use dimension keys from fact. need to do prod testing for completeness first.
left join sonic_dw.dbo.Dim_DMSEmployee s1
on e.EntCora_Account_ID = s1.cora_acct_id
and f.SalesPerson1 = s1.custno
and s1.EMPNameCode = 7
left join sonic_dw.dbo.Dim_DMSEmployee s2
on e.EntCora_Account_ID = s2.cora_acct_id
and f.SalesPerson2 = s2.custno
and s2.EMPNameCode = 7
left join sonic_dw.dbo.Dim_DMSEmployee sm
on e.EntCora_Account_ID = sm.cora_acct_id
and f.SalesManager = sm.custno
and sm.EMPNameCode = 7
left join sonic_dw.dbo.Dim_DMSEmployee cm
on e.EntCora_Account_ID = cm.cora_acct_id
and f.ClosingManager = cm.custno
and cm.EMPNameCode = 7
left join sonic_dw.dbo.Dim_DMSEmployee fim
on e.EntCora_Account_ID = fim.cora_acct_id
and f.FinanceManager = fim.custno
and fim.EMPNameCode = 7
left join sonic_dw.dbo.dim_dmscustomer c
on e.EntCora_Account_ID = c.DMSCstCoraAcct
and f.CustomerNumber = c.DMSCstCustNo
--RAJ - add in current and prior month filter






```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
