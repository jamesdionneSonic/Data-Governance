---
name: vwFireDetail_Callidus
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



CREATE view [dbo].[vwFireDetail_Callidus] AS
/************************************************************************************************************************************/
/* Author: Lindsay DePree		Date: 2019-10-01	Comments: Creation																*/
/* Modified: Rajamani Bandi 	Date: 2019-10-08	Comments: change columns														*/
/* Modified: Keveana Carter		Date: 2020-04-16	Comments: Add Columns															*/
/* Modified: Keveana Carter		Date: 2020-04-17	Comments: Float datatype causes values to vary betweeen runs - changed to money */
/************************************************************************************************************************************/

SELECT  row_number() over (order by e.EntADPCompanyID,f.StockNo,ad.FullDate,e.EntAccountingPrefix) as ID
		,ad.FullDate as AccountingDate
		,f.AccountingDateKey
		,MAX(isnull(f.age,0)) as Age
        ,case when f.dealno = -1 then 0
              when ( MAX(f.SalesPerson1Key) = -1 and MAX(f.SalesPerson2Key) = -1) then 0
              else 1 end as AssignedFlag --updated 12/12 to account for FIRE records that have dealno but no sales associate.
		,case when f.dealno = -1 then 0 else 1 end as AssignedFlag_old
		,SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS BackCostAmount
		,SUM(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END)
			- SUM(CASE WHEN FIAccountType = 'C'  AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS BackGross ---this is what should be used for F&I number in salesperson comp until any decisions are made to incorporate chargebacks
		,SUM(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS BackSale
		,ad.CalendarYearMonth
		,MAX(f.CertifiedFlag) as CertifiedFlag
		,SUM(CASE WHEN FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS Chargebacks
		,SUM(case when FIAccountCategory = 'Chargeback' and not (FIAccountDesc LIKE '%under 90%' or FIAccount IN ('5485','5995')) then Amount else 0 end) AS Chargebacks_Over90
		,SUM(case when FIAccountCategory = 'Chargeback' and (FIAccountDesc LIKE '%under 90%' or FIAccount IN ('5485','5995')) then Amount else 0 end) AS Chargebacks_Under90
		,cd.FullDate as ContractDate
		,MAX(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Control2 ELSE null END) AS Control2 ---to be used in the future to match on dealno
		,SUM(CASE WHEN FIAccount IN ('6298','6399')	THEN Amount * -1 ELSE 0 END) AS COS_Adj
		,MAX(f.DMSCustomerKey) as CustomerKey
		,e.EntDealerLvl1 as Dealership
		,f.dealno as dealno
		,f.fiwipstatuscode as DealStatus
		,MAX(d.DealTypeCode) as DealTypeFI
		,SUM(CASE WHEN FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Doc Fees' THEN Amount * -1 ELSE 0 END) AS DocFee
		,e.EntAccountingPrefix
		,e.EntADPCompanyID
		,e.EntBrand
		,e.EntCora_Account_ID
		,SUM(CASE WHEN FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Factory $' THEN Amount * -1 ELSE 0 END) AS FactoryBonus
		,a.FIAccountClassification
		,SUM(CASE WHEN FIAccountType = 'S'  AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END)
			- SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END)
			- SUM(CASE WHEN FIAccountType = 'B' AND a.FIGLProductCategoryKey <> 15 THEN Amount ELSE 0 END) AS FI_Net ---subtracts chargebacks - this is what FIRE shows as F&I metric and is used for PRU calc in the application
		,SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0  END) AS FrontCostAmount
		,SUM(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15  THEN Amount ELSE 0 END)
			-SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontGross
		,SUM(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END)
			- SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 THEN Amount  ELSE 0  END)
			+ SUM(CASE WHEN FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 THEN Amount * -1 ELSE 0 END) AS FrontGross_PackDocFactory
		,SUM(CASE WHEN FIAccountType = 'S' AND a.FIGLProductCategoryKey = 15 THEN Amount ELSE 0 END) AS FrontSaleAmount
		,MAX(f.lenderkey) as LenderKey
		,SUM(ISNULL(f.frontweowes,0)) as memo_frontweowesnet
		,SUM(CASE WHEN FIAccountType = 'C' AND a.FIGLProductCategoryKey = 15 and FIAccountCategory IN ( 'Incentives' )THEN Amount ELSE 0  END) AS Memo_Incentives --Included in frontcost
		,SUM(ISNULL(f.totaltradesover,0)) as memo_totaltradesover
		,SUM(CASE WHEN FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Other' and FIAccount NOT IN ('6298','6399') THEN Amount * -1 ELSE 0 END) AS OtherAdj
		,SUM(CASE WHEN FIAccountType = 'D' AND a.FIGLProductCategoryKey = 15 AND FIAccountCategory = 'Pack' THEN Amount * -1 ELSE 0 END) AS Pack
		,SUM(CASE WHEN p.PenetrationCountFlag = 'Y' and a.FIAccountType = 'S'then f.statcount else 0 end) AS PenetrationCount
		,MAX(f.postingdate) as PostingDate
		,SUM(CASE WHEN p.ProductCountFlag = 'Y' and a.FIAccountType = 'S' then f.statcount else 0 end) AS ProductCount
		,MAX(case when f.SalesPerson1Key = -1 then null else s1.custno end) as Salesperson1
        ,MAX(case when f.SalesPerson2Key = -1 then null else s2.custno end) as Salesperson2
		--,case when f.SalesPerson3Key = -1 then null else s3.custno end as Salesperson3 --removed per business
		,SUM(CASE WHEN a.FIGLProductCategory = 'FrontGross' AND FIAccountType = 'S' THEN f.statcount ELSE 0 END) AS StatCount
		,f.StockNo
		,MAX(f.VehicleKey) as VehicleKey
FROM	(
		select	AccountingDateKey, StockNo, FIGLProductKey, EntityKey, DealTypeKey, ContractDateKey, LenderKey, SalesPerson1Key, SalesPerson2Key
				, IsRetail, fiwipstatuscode, frontweowes, totaltradesover, postingdate, statcount, VehicleKey, Dealno, age, CertifiedFlag, Control2, DMSCustomerKey
				, convert(money,Amount) as Amount
		from	[dbo].[factFIRE] (NOLOCK) f
				INNER JOIN (
					Select	 convert(int,convert(varchar(8),DATEADD(DAY, 1, EOMONTH(convert(varchar,DocRolloverDate,112), -1)),112)) as StartDate
							, convert(int,convert(varchar(8),EOMONTH(convert(date,convert(varchar,DocRolloverDate),112)),112)) as EndDate
					From	dbo.Dim_Date
					Where	datekey = convert(int,convert(char(8),dateadd(dd,-1,getdate()), 112))
					) as dt on f.AccountingDateKey between dt.StartDate and dt.EndDate
		) as f
        INNER JOIN dbo.dim_FIGLAccounts a ON f.FIGLProductKey = a.FIGLProductKey
		INNER JOIN dbo.dim_FIGLProductCategory p ON a.FIGLProductCategoryKey = p.FIGLProductCategoryKey
        INNER JOIN dbo.dim_entity e ON e.EntityKey = f.EntityKey
		INNER JOIN dbo.dim_DealType d ON f.DealTypeKey = d.DealTypeKey
		INNER JOIN dbo.Dim_Date ad ON f.accountingdatekey = ad.datekey
		INNER JOIN dbo.Dim_Date cd ON f.ContractDateKey = cd.datekey
		INNER JOIN dbo.Dim_Lender l ON f.LenderKey = l.LenderKey
		LEFT JOIN dbo.Dim_DMSEmployee s1 ON f.SalesPerson1Key = s1.AssociateKey
		LEFT JOIN dbo.Dim_DMSEmployee s2 ON f.SalesPerson2Key = s2.AssociateKey
		--LEFT JOIN dbo.Dim_DMSEmployee s3 ON f.SalesPerson3Key = s3.AssociateKey
WHERE	f.IsRetail = 'IsRetail' ---FYI - aftermarket should come through FIRE as retail
		and f.fiwipstatuscode = 'F'
		and FIAccount NOT IN (9088,9030,9032) --F&I Pack, DealerTrade Gain/Loss. Exclude per Matt O.
		--and e.entadpcompanyid IN ('402','413','427','301','126','434') --6 pilot stores
        and e.EntBrand IN ('BMW','MINI','Mercedes','Honda','Toyota','Lexus') --All pilot brands---  added 'Toyota','Lexus' 07/23/2020
		and e.EntEntityType = 'Dealership'
		and e.EntActive = 'active'
GROUP BY
		e.EntADPCompanyID
		,f.StockNo
		,ad.FullDate
		,e.EntAccountingPrefix
		,f.AccountingDateKey
		,f.dealno
		,ad.CalendarYearMonth
		,cd.FullDate
		,e.EntDealerLvl1
		,f.fiwipstatuscode
		,e.EntBrand
		,e.EntCora_Account_ID
		,a.FIAccountClassification
		,s1.custno
		,s2.custno
		,salesperson1key, salesperson2key
;





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
