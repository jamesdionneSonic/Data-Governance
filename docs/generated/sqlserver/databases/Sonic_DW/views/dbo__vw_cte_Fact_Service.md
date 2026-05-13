---
name: vw_cte_Fact_Service
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
/*	Modified: 2017-03-28	Author: Jo Carter	US:1834		Change: change to use XrfServiceCora from TL_Staging.wrk.xrfCoraCompanyPrefix		*/
/*	Modified: 2024-08-21	Author: Derrick Davis			Change: Add VehicleKey from newer DimVehicle table									*/
/*																																				*/
/*																																				*/
/************************************************************************************************************************************************/

CREATE VIEW [dbo].[vw_cte_Fact_Service]
AS

WITH cte_vw_FactService
AS
(
-- Insert records from staging	--
	SELECT	COALESCE(xsc.EntityKey, -1) AS EntityKey
			,COALESCE(d.DimCustomerID, -1) AS CustomerKey
			,COALESCE(FF.DMSCustomerKey, -1) AS DMSCustomerKey
			,COALESCE(e.VehicleKey, -1) AS VehicleKey
			,ISNULL(k.VehicleKey, -1) AS NewVehicleKey
			,COALESCE(f.AssociateKey, -1) AS ServiceAdvisorKey
			,COALESCE(g.DateKey, 19000101) AS OpenDateKey
			,COALESCE(h.DateKey, 19000101) AS CloseDateKey
			,COALESCE(i.DateKey, 19000101) AS VoidDateKey
			,COALESCE(j.DateKey, 19000101) AS LastServiceDateKey
			,CONVERT(VARCHAR(50), a.ServiceType) AS ServiceType
			,CONVERT(VARCHAR(12), a.RONumber) AS RONumber
			,CONVERT(INT, a.Mileage) AS Mileage
			,CONVERT(MONEY, a.LaborSale) AS LaborSale
			,CONVERT(MONEY, a.LaborCost) AS LaborCost
			,CONVERT(MONEY, a.PartsSale) AS PartsSale
			,CONVERT(MONEY, a.PartsCost) AS PartsCost
			,CONVERT(MONEY, a.ShopSuppliesCost) AS ShopSuppliesCost
			,CONVERT(MONEY, a.ShopSuppliesSales) AS ShopSuppliesSales
			,CONVERT(MONEY, a.MiscSale) AS MiscSale
			,CONVERT(MONEY, a.MiscCost) AS MiscCost
			,CONVERT(NUMERIC(10, 2), a.SoldHours) AS SoldHours
			,CONVERT(NUMERIC(10, 2), a.ActualHours) AS ActualHours
			,CONVERT(NUMERIC(10, 2), a.TimeCardHours) AS TimeCardHours
			,CONVERT(INT, a.cora_acct_id) AS cora_acct_id_service
			,CONVERT(INT, xsc.Cora_Acct_ID) AS cora_acct_id_accounting
			,CONVERT(VARCHAR(50), a.custno) AS custno
			,CONVERT(VARCHAR(17), a.vehid) AS vehid
			,CONVERT(VARCHAR(50), a.vin) AS vin
			,CONVERT(VARCHAR(50), a.stockno) AS stockno
			,CONVERT(VARCHAR(17), a.serviceadvisor) AS serviceadvisor
			,CONVERT(DATETIME, a.opendate) AS opendate
			,CONVERT(DATETIME, a.closedate) AS closedate
			,CONVERT(DATETIME, a.voiddate) AS voiddate
			,CONVERT(DATETIME, a.lastservicedate) AS lastservicedate
			,CONVERT(INT, a.ETLExecution_ID) AS ETLExecution_ID
			,CONVERT(INT, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID
			,CONVERT(VARCHAR(20), a.Meta_SourceSystemName) AS Meta_SourceSystemName
			,CONVERT(DATETIME, a.Meta_RowLastChangedDate) AS Meta_RowLastChangedDate
			,CONVERT(INT, a.Meta_AuditKey) AS Meta_AuditKey
			,CONVERT(VARCHAR(255), a.Meta_NaturalKey) AS Meta_NaturalKey
			,ROW_NUMBER() OVER (ORDER BY a.cora_acct_id, a.vehid, a.RONumber, a.custno) AS RowNum
			,RANK() OVER (ORDER BY a.cora_acct_id, a.vehid, a.RONumber, a.custno) AS RowRank
			,ROStatus
			,xsc.Companyid
			,CONVERT(MONEY, a.[rosubletsalecp]) AS [rosubletsalecp]
			,CONVERT(MONEY, a.[rosubletsaleip]) AS [rosubletsaleip]
			,CONVERT(MONEY, a.[rosubletsalewp]) AS [rosubletsalewp]
			,CONVERT(MONEY, a.[rosubletcostcp]) AS [rosubletcostcp]
			,CONVERT(MONEY, a.[rosubletcostip]) AS [rosubletcostip]
			,CONVERT(MONEY, a.[rosubletcostwp]) AS [rosubletcostwp]
	FROM	ETL_Staging.wrk.DMS_servicesalesclosed_staging AS a WITH (NOLOCK)

			--Removed 20130313 odmcpeak and replaced with xrfCoraCompanyPrefix lookup
			--	LEFT OUTER JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS b WITH (NOLOCK)
			--		ON a.cora_acct_id = b.CoraAcctID_Service
			--	LEFT OUTER JOIN dbo.Dim_Entity AS c WITH (NOLOCK)
			--		ON b.CompanyID = c.EntADPCompanyID
			--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	--324
			--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	WHERE EntDefaultDlrshpLvl1 = 1 --111
			--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	WHERE COALESCE(EntDefaultDlrshpLvl1, 0) <> COALESCE(EntDefaultDlrshpLvl2, 0) --4
			--		AND c.EntAccountingPrefix = (SELECT MIN(x.EntAccountingPrefix) FROM dbo.Dim_Entity x WHERE x.EntADPCompanyID = c.EntADPCompanyID AND x.EntDefaultDlrshpLvl1 = 1)
			-- Added 20130313 odmcpeak to use xrfCoraCompanyPrefix
			/*	replaced 2017-03-28 jo carter US1834: change to use XrfServiceCora */
			/*LEFT OUTER JOIN ETL_Staging.wrk.xrfCoraCompanyPrefix b (NOLOCK) ON a.cora_acct_id = b.cora_acct_id */
			left OUTER JOIN ETL_Staging.wrk.XrefServiceCora xsc
				ON	a.Cora_Acct_id = xsc.Cora_Serv_ID
				AND isnull(a.closedate,a.opendate) BETWEEN xsc.Meta_RowEffectiveDate AND xsc.Meta_RowExpiredDate

			/* LEFT OUTER JOIN Dim_Entity c ON b.Companyid = c.EntADPCompanyID	AND b.Prefix = c.EntAccountingPrefix  */

			LEFT OUTER JOIN dbo.CustomerXREF_KeyLU AS d
				ON xsc.Cora_Acct_ID = d.cora_acct_id
				AND a.custno = d.custno
				AND a.custno IS NOT NULL

			--Removed 20130313 odmcpeak and replaced with xrfCoraCompanyPrefix lookup
			/*	LEFT OUTER JOIN (SELECT	x.*,y.CoraAcctID_Service
								FROM	dbo.CustomerXREF_KeyLU AS x WITH (NOLOCK)
										INNER JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS y WITH (NOLOCK)
											ON x.cora_acct_id = y.CoraAcctID_Accounting
								WHERE x.CustomerXREFID = (SELECT MIN(z.CustomerXREFID)
															FROM dbo.CustomerXREF_KeyLU z WITH (NOLOCK)
															WHERE z.cora_acct_id = x.cora_acct_id
																AND z.custno = x.custno
														)
								) AS d
				ON a.cora_acct_id = d.CoraAcctID_Service
				AND a.custno = d.custno
				AND d.custno IS NOT NULL */

			-- Added 20131104 odmcpeak to pick up DMSCustomerKey and immediately removed it when I found out that there are 37,500 dups in dim_DMSCustomer
			-- replaced with max(DMSCustomerKey)
			LEFT OUTER JOIN (SELECT	MAX(DMSCustomerKey) AS DMSCustomerKey
									,DMSCstCoraAcct
									,DMSCstCustNo
							FROM	Dim_DMSCustomer
							GROUP BY	DMSCstCoraAcct,DMSCstCustNo
							) FF --ON c.EntCora_Account_ID = FF.DMSCstCoraAcct
				ON xsc.Cora_Acct_ID = FF.DMSCstCoraAcct
				AND a.custno = FF.DMSCstCustNo

			LEFT OUTER JOIN dbo.Dim_Vehicle e WITH (NOLOCK)
				ON a.vin = e.VehVIN

			LEFT OUTER JOIN (SELECT v.[VehicleKey]
								  ,vn.[Vin]
								  ,vn.[IsActiveVin]
							  FROM [Sonic_DW].[dbo].[DimVehicle] v WITH (NOLOCK)
							  JOIN [Sonic_DW].[dbo].[DimVin] vn WITH (NOLOCK)
								ON v.VehicleKey = vn.VehicleKey
							) k
				ON a.vin = k.VIN

			LEFT OUTER JOIN dbo.Dim_DMSEmployee f WITH (NOLOCK) --ON c.EntCora_Account_ID = f.cora_acct_id
				ON xsc.Cora_Acct_ID = f.cora_acct_id
				AND	a.serviceadvisor = f.custno
				AND f.EMPNameCode = 8

			--LEFT OUTER JOIN dbo.Dim_Associate f WITH (NOLOCK)
			--	ON a.serviceadvisor = f.AsoTimeClockID
			--	AND b.CompanyID = f.AsoLocation
			--	AND f.Meta_RowIsCurrent = 'Y' --for now!
			--		AND a.closedate BETWEEN f.Meta_RowEffectiveDate AND f.Meta_RowExpiredDate --for later!

			LEFT OUTER JOIN dbo.Dim_Date g WITH (NOLOCK)
				ON a.opendate = g.FullDate

			LEFT OUTER JOIN dbo.Dim_Date h WITH (NOLOCK)
				ON a.closedate = h.FullDate

			LEFT OUTER JOIN dbo.Dim_Date i WITH (NOLOCK)
				ON a.voiddate = i.FullDate

			LEFT OUTER JOIN dbo.Dim_Date j WITH (NOLOCK)
				ON a.lastservicedate = j.FullDate

	WHERE	a.RONumber IS NOT NULL
			AND (
					a.closedate = (SELECT	MAX(x.closedate)
									FROM	ETL_Staging.wrk.DMS_servicesalesclosed_staging AS x WITH (NOLOCK)
									WHERE	x.cora_acct_id = a.cora_acct_id
											AND x.RONumber = a.RONumber
											AND x.vehid = a.vehid
									)
					AND ROStatus = 1
				)
			OR ROStatus = 0
)
SELECT	*
FROM	cte_vw_FactService AS fs
WHERE	fs.RowNum = fs.RowRank







```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
