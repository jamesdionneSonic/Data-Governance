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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
