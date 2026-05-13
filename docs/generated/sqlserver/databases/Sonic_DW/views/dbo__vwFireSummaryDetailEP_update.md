---
name: vwFireSummaryDetailEP_update
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



/********************************************************************************************/
/* Author: Lindsay DePree		Date: 2019-10-01	Comments: Creation						*/
/* Modified: Keveana Carter		Date: 2019-10-08	Comments: change columns				*/
/* Modified: Keveana Carter		Date: 2019-10-15	Comments: remove some columns 			*/
/* Modified: Derrick Davis		Date: 2019-11-13	Comments: Add Sonic F&I product columns	*/
/* Modified: Derrick Davis		Date: 2020-03-27	Comments: Add PostingDate column from FactFire for #Unwind_Reversal0 logic	*/
/* Modified: Derrick Davis		Date: 2020-04-01	Comments: Updated TotalGross calc logic	*/
/********************************************************************************************/
CREATE view [dbo].[vwFireSummaryDetailEP_update] AS
SELECT  row_number() over (order by e.EntADPCompanyID,f.StockNo,ad.FullDate,e.EntAccountingPrefix) as ID
		,ad.FullDate as AccountingDate
		,f.accountingdatekey
		,f.PostingDate						----Added 03/27/20 DMD
		,case when f.dealno = '-1' then 0 else 1 end as AssignedFlag
		--removed 2019-10-15,ad.CalendarYearMonth
		,ISNULL(f.CertifiedFlag,0) as CertifiedFlag
		,cd.FullDate as ContractDate
		--removed 2019-10-15,e.EntDealerLvl1 as Dealership
		,f.dealno as DealNumber
		,f.fiwipstatuscode as DealStatus
		,e.EntAccountingPrefix
		,e.EntADPCompanyID
		--removed 2019-10-15,e.EntBrand
		,Isnull(e.EntCora_Account_ID,-1) as EntCoraAccountID
		,f.EntityKey
		,e.EntLineOfBusiness
		--removed 2019-10-15,e.EntRegion
		,MAX(d.DealTypeCode) as DealTypeFI --NEW COLUMN
		,case when a.FIAccount IN (9088) then 'Used' else a.FIAccountClassification end as FIAccountClassification --only works for EP
		,f.StockNo as StockNumber
		,SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS BackCost
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
			- SUM(CASE WHEN a.FIAccountType = 'C'  AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS BackGross
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS BackSale
		,SUM(CASE WHEN a.FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS Chargebacks
		,SUM(case when a.FIAccountCategory = 'Chargeback' and not (a.FIAccountDesc LIKE '%under 90%' or a.FIAccount IN (5485,5995)) then ISNULL(F.Amount,0) else 0 end) AS ChargebacksOver90
		,SUM(case when a.FIAccountCategory = 'Chargeback' and (a.FIAccountDesc LIKE '%under 90%' or a.FIAccount IN (5485,5995)) then ISNULL(F.Amount,0) else 0 end) AS ChargebacksUnder90
		,MAX(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN f.control2 ELSE null END) AS Control2 ---to be used in the future to match on dealno
        ,SUM(CASE WHEN a.FIAccount IN (6298,6399) THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END) AS COSAdjustment
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 14 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS DingDentChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 14 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS DingDentCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 14 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS DingDentCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 14 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS DingDentSale
		,SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Doc Fees') THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END) AS DocFee
		,SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Factory $') THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END) AS FactoryBonus
		,SUM(CASE WHEN a.FIAccountType = 'S'  AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
			- SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
			- SUM(CASE WHEN a.FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS FINet ---subtracts chargebacks - this is what FIRE shows as F&I metric and is used for PRU calc in the application
		,SUM(CASE WHEN a.FIAccount IN (9088) THEN (ISNULL(f.Amount,0)) ELSE 0 END) AS FIPack
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 1 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end)	AS FinanceReserveChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 1 and  a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end)	AS FinanceReserveCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 1 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end)	AS FinanceReserve
		,SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0  END) AS FrontCost
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15  THEN ISNULL(F.Amount,0) ELSE 0 END)
			- SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0 END) AS FrontGross
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
			- SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
			+ SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END)
			--rename 2019-10-08 to FrontGrossPackDocFactory			AS FrontGrossAllIn
			AS FrontGrossPackDocFactory
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0  END) AS FrontSale
		,SUM(ISNULL(f.frontweowes,0)) AS FrontWeowes
		,max(f.fimgrkey) as fimgrkey -- New columns
        ,max(f.SalesPerson1Key) as SalesPerson1Key -- New columns
        ,max(SalesPerson2Key) as SalesPerson2Key -- New columns
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 9 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS GapChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 9 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS GapCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 9 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS GapCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 9 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS GapSale
		,SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 and a.FIAccountCategory IN ('Incentives') THEN ISNULL(F.Amount,0) ELSE 0  END) AS Incentives --Included in frontcost
		,MAX(f.LenderKey) as LenderKey --add lender name
		,SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Other') and a.FIAccount NOT IN (6298,6399) THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END) AS OtherAdjustment
		,SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND a.FIAccountCategory IN ('Pack') THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END) AS Pack
		,SUM(CASE WHEN p.PenetrationCountFlag = 'Y' and a.FIAccountType = 'S'then ISNULL(f.statcount,0) else 0 end) AS PenetrationCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 2 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end)	AS PermaPlateChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 2 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end)	AS PermaPlateCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 2 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS PermaPlateCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 2 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS PermaPlateSale
		--removed 2019-10-08 ,SUM(CASE WHEN (p.ProductCountFlag = 'Y' or a.FIGLProductCategoryKey = 1) and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS ProductCountEP --EP includes finance reserve in product counts
		,SUM(CASE WHEN p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then f.statcount else 0 end)
		--2019-10-08 rename to ProductCount		 AS ProductCountSonic
			AS ProductCount
		,SUM(CASE WHEN (a.FIAccountType = 'C' AND SUBSTRING(CONVERT(VARCHAR(4), a.FIAccount),4, 1) IN ('1','3','5','7','9') AND a.FIAccount BETWEEN 6301 AND 6347) THEN Amount ELSE 0 END) AS Recon
        ,Cast(replace(MAX(f.PurchaseType),'(Buy)','') as varchar(20)) as SaleType
		,SUM(CASE WHEN a.FIGLProductCategory = 'FrontGross' AND a.FIAccountType = 'S' THEN ISNULL(f.statcount,0) ELSE 0 END) AS StatCount  --Units that tie to FIRE and DailyDOC
		,SUM(ISNULL(f.totaltradesover,0)) AS TradeAllowance
		,SUM(CASE WHEN a.FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
                     - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
                     + SUM(CASE WHEN a.FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 THEN (ISNULL(F.Amount,0)*-1) ELSE 0 END)
                     + SUM(CASE WHEN a.FIAccountType = 'S'  AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
                     - SUM(CASE WHEN a.FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END)
                     - SUM(CASE WHEN a.FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN ISNULL(F.Amount,0) ELSE 0 END) as TotalGross
        --,SUM(ISNULL(f.Amount,0)) AS TotalGross --doesn't calc right in this query
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 12 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS VSAChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 12 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS VSACost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 12 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS VSACount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 12 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS VSASale
		,MAX(f.VehicleKey) as VehicleKey
		--new columns to bring in all additional Sonic products --added 11/11/19
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 3 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS KeyChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 3 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS KeyCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 3 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS KeyCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 3 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS KeySale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 4 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS OtherChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 4 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS OtherCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 4 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS OtherCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 4 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS OtherSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 5 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS InsuranceChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 5 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS InsuranceCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 5 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS InsuranceCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 5 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS InsuranceSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 6 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS LeaseWearTearChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 6 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS LeaseWearTearCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 6 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS LeaseWearTearCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 6 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS LeaseWearTearSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 7 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS PhantomChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 7 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS PhantomCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 7 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS PhantomCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 7 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS PhantomSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 8 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS MaintenanceChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 8 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS MaintenanceCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 8 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS MaintenanceCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 8 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS MaintenanceSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 10 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS RoadstarChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 10 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS RoadstarCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 10 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS RoadstarCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 10 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS RoadstarSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 11 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS TireWheelChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 11 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS TireWheelCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 11 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS TireWheelCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 11 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS TireWheelSale
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 13 and a.FIAccountType = 'B' then ISNULL(f.Amount,0) else 0 end) AS SecurityChargeback
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 13 and a.FIAccountType = 'C' then ISNULL(f.Amount,0) else 0 end) AS SecurityCost
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 13 and p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then ISNULL(f.statcount,0) else 0 end) AS SecurityCount
		,SUM(CASE WHEN a.FIGLProductCategoryKey = 13 and a.FIAccountType = 'S' then ISNULL(f.Amount,0) else 0 end) AS SecuritySale
FROM	[dbo].[factFIRE] (NOLOCK) f
        INNER JOIN dbo.dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
		INNER JOIN dbo.dim_FIGLProductCategory p ON a.FIGLProductCategoryKey = p.FIGLProductCategoryKey
		INNER JOIN dbo.dim_DealType d ON f.DealTypeKey = d.DealTypeKey
        INNER JOIN dbo.dim_entity e ON e.EntityKey = f.EntityKey
		INNER JOIN dbo.Dim_Date ad ON f.accountingdatekey = ad.datekey
		INNER JOIN dbo.Dim_Date cd ON f.ContractDateKey = cd.datekey
WHERE
--ad.FullDate between DateAdd(m, -1, DATEADD(m, DATEDIFF(m, 0, GETDATE()), 0)) and eomonth(getdate())
		ad.FullDate >= '2021-01-01'																						-------For 1 time Historical Load
		and FIAccount NOT IN (9030,9032) --Excludes DealerTrade Gain/Loss, FOR EP Only-include FI Pack 9088
		and e.EntLineOfBusiness = 'EchoPark'
		and e.EntEntityType = 'Dealership'
		and e.EntActive = 'active'
		and f.IsRetail = 'IsRetail' ---FYI - aftermarket should come through FIRE as retail
GROUP BY f.EntityKey
		,e.EntCora_Account_ID
        ,e.EntADPCompanyID
		,e.EntAccountingPrefix
		--,e.EntDealerLvl1
		--,e.EntBrand
		,e.EntLineOfBusiness
		--,e.EntRegion
		--,ad.CalendarYearMonth
		,case when a.FIAccount IN (9088) then 'Used' else a.FIAccountClassification end
		,f.fiwipstatuscode
		,f.StockNo
		,ad.FullDate
		,cd.FullDate
		,f.accountingdatekey
		,f.postingdate						----Added 03/27/20 DMD
		,f.dealno
		,f.CertifiedFlag
;











```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
