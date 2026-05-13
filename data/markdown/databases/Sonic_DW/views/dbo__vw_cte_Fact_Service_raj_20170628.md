---
name: vw_cte_Fact_Service_raj_20170628
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - CustomerXREF_KeyLU
  - Dim_Date
  - Dim_DMSCustomer
  - Dim_DMSEmployee
  - Dim_Entity
  - Dim_Vehicle
dependency_count: 6
column_count: 50
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.CustomerXREF_KeyLU** (U )
- **dbo.Dim_Date** (U )
- **dbo.Dim_DMSCustomer** (U )
- **dbo.Dim_DMSEmployee** (U )
- **dbo.Dim_Entity** (U )
- **dbo.Dim_Vehicle** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `EntityKey`               | int      | ✓        |             |
| `CustomerKey`             | int      | ✓        |             |
| `DMSCustomerKey`          | int      | ✓        |             |
| `VehicleKey`              | int      | ✓        |             |
| `ServiceAdvisorKey`       | int      | ✓        |             |
| `OpenDateKey`             | int      | ✓        |             |
| `CloseDateKey`            | int      | ✓        |             |
| `VoidDateKey`             | int      | ✓        |             |
| `LastServiceDateKey`      | int      | ✓        |             |
| `ServiceType`             | varchar  | ✓        |             |
| `RONumber`                | varchar  | ✓        |             |
| `Mileage`                 | int      | ✓        |             |
| `LaborSale`               | money    | ✓        |             |
| `LaborCost`               | money    | ✓        |             |
| `PartsSale`               | money    | ✓        |             |
| `PartsCost`               | money    | ✓        |             |
| `ShopSuppliesCost`        | money    | ✓        |             |
| `ShopSuppliesSales`       | money    | ✓        |             |
| `MiscSale`                | money    | ✓        |             |
| `MiscCost`                | money    | ✓        |             |
| `SoldHours`               | numeric  | ✓        |             |
| `ActualHours`             | numeric  | ✓        |             |
| `TimeCardHours`           | numeric  | ✓        |             |
| `cora_acct_id_service`    | int      | ✓        |             |
| `cora_acct_id_accounting` | int      | ✓        |             |
| `custno`                  | varchar  | ✓        |             |
| `vehid`                   | varchar  | ✓        |             |
| `vin`                     | varchar  | ✓        |             |
| `stockno`                 | varchar  | ✓        |             |
| `serviceadvisor`          | varchar  | ✓        |             |
| `opendate`                | datetime | ✓        |             |
| `closedate`               | datetime | ✓        |             |
| `voiddate`                | datetime | ✓        |             |
| `lastservicedate`         | datetime | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `Meta_SourceSystemName`   | varchar  | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `Meta_AuditKey`           | int      | ✓        |             |
| `Meta_NaturalKey`         | varchar  | ✓        |             |
| `RowNum`                  | bigint   | ✓        |             |
| `RowRank`                 | bigint   | ✓        |             |
| `ROStatus`                | tinyint  | ✓        |             |
| `CompanyID`               | char     | ✓        |             |
| `rosubletsalecp`          | money    | ✓        |             |
| `rosubletsaleip`          | money    | ✓        |             |
| `rosubletsalewp`          | money    | ✓        |             |
| `rosubletcostcp`          | money    | ✓        |             |
| `rosubletcostip`          | money    | ✓        |             |
| `rosubletcostwp`          | money    | ✓        |             |

## Definition

```sql



CREATE VIEW [dbo].[vw_cte_Fact_Service_raj_20170628]
AS


WITH cte_vw_FactService
AS
(

-- Insert records from staging
--
SELECT
	COALESCE(c.EntityKey, -1) AS EntityKey,
	COALESCE(d.DimCustomerID, -1) AS CustomerKey,
	coalesce(FF.DMSCustomerKey,-1) as DMSCustomerKey,
	COALESCE(e.VehicleKey, -1) AS VehicleKey,
	COALESCE(f.AssociateKey, -1) AS ServiceAdvisorKey,
	COALESCE(g.DateKey, 19000101) AS OpenDateKey,
	COALESCE(h.DateKey, 19000101) AS CloseDateKey,
	COALESCE(i.DateKey, 19000101) AS VoidDateKey,
	COALESCE(j.DateKey, 19000101) AS LastServiceDateKey,
	CONVERT(varchar(50), a.servicetype) AS ServiceType,
	CONVERT(varchar(12), a.ronumber) AS RONumber,
	CONVERT(int, a.mileage) AS Mileage,
	CONVERT(money, a.laborsale) AS LaborSale,
	CONVERT(money, a.laborcost) AS LaborCost,
	CONVERT(money, a.partssale) AS PartsSale,
	CONVERT(money, a.partscost) AS PartsCost,
	CONVERT(money, a.shopsuppliescost) AS ShopSuppliesCost,
	CONVERT(money, a.shopsuppliessales) AS ShopSuppliesSales,
	CONVERT(money, a.miscsale) AS MiscSale,
	CONVERT(money, a.misccost) AS MiscCost,
	CONVERT(numeric(10, 2), a.soldhours) AS SoldHours,
	CONVERT(numeric(10, 2), a.actualhours) AS ActualHours,
	CONVERT(numeric(10, 2), a.timecardhours) AS TimeCardHours,
	CONVERT(int, a.cora_acct_id) AS cora_acct_id_service,
	CONVERT(int, c.EntCora_Account_ID) AS cora_acct_id_accounting,
	CONVERT(varchar(50), a.custno) AS custno,
	CONVERT(varchar(17), a.vehid) AS vehid,
	CONVERT(varchar(50), a.vin) AS vin,
	CONVERT(varchar(50), a.stockno) AS stockno,
	CONVERT(varchar(17), a.serviceadvisor) AS serviceadvisor,
	CONVERT(datetime, a.opendate) AS opendate,
	CONVERT(datetime, a.closedate) AS closedate,
	CONVERT(datetime, a.voiddate) AS voiddate,
	CONVERT(datetime, a.lastservicedate) AS lastservicedate,
	CONVERT(int, a.ETLExecution_ID) AS ETLExecution_ID,
	CONVERT(int, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID,
	CONVERT(varchar(20), a.Meta_SourceSystemName) AS Meta_SourceSystemName,
	CONVERT(datetime, a.Meta_RowLastChangedDate) AS Meta_RowLastChangedDate,
	CONVERT(int, a.Meta_AuditKey) AS Meta_AuditKey,
	CONVERT(varchar(255), a.Meta_NaturalKey) AS Meta_NaturalKey,
	ROW_NUMBER() OVER(ORDER BY a.cora_acct_id, a.vehid, a.ronumber,a.custno) AS RowNum,
    RANK() OVER(ORDER BY a.cora_acct_id, a.vehid, a.ronumber, a.custno) AS RowRank,
   ROStatus,
   b.CompanyID,
	CONVERT(money, a.[rosubletsalecp]) AS [rosubletsalecp],
	CONVERT(money, a.[rosubletsaleip]) AS [rosubletsaleip],
	CONVERT(money, a.[rosubletsalewp]) AS [rosubletsalewp],
	CONVERT(money, a.[rosubletcostcp]) AS [rosubletcostcp],
	CONVERT(money, a.[rosubletcostip]) AS [rosubletcostip],
	CONVERT(money, a.[rosubletcostwp]) AS [rosubletcostwp]
FROM ETL_Staging.wrk.DMS_servicesalesclosed_staging AS a WITH (NOLOCK)

--Removed 20130313 odmcpeak and replaced with xrfCoraCompanyPrefix lookup
--	LEFT OUTER JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS b WITH (NOLOCK)
--		ON a.cora_acct_id = b.CoraAcctID_Service
--	LEFT OUTER JOIN dbo.Dim_Entity AS c WITH (NOLOCK)
--		ON b.CompanyID = c.EntADPCompanyID
--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	--324
--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	WHERE EntDefaultDlrshpLvl1 = 1 --111
--		--SELECT * FROM Sonic_DW.dbo.Dim_Entity	WHERE COALESCE(EntDefaultDlrshpLvl1, 0) <> COALESCE(EntDefaultDlrshpLvl2, 0) --4
--		AND c.EntAccountingPrefix = (SELECT MIN(x.EntAccountingPrefix) FROM dbo.Dim_Entity x WHERE x.EntADPCompanyID = c.EntADPCompanyID AND x.EntDefaultDlrshpLvl1 = 1)
--------------------------------------------------------------
-- Added 20130313 odmcpeak to use xrfCoraCompanyPrefix
left outer join ETL_Staging.wrk.xrfCoraCompanyPrefix b (nolock)
	on a.cora_acct_id = b.cora_acct_id
LEFT outer join Dim_Entity c
	on b.Companyid = c.EntADPCompanyID and
	b.Prefix = c.EntAccountingPrefix
--------------------------------------------------------------

--------------------------------------------------------------
-- Added 20130313 odmcpeak to use xrfCoraCompanyPrefix

	LEFT OUTER JOIN
		dbo.CustomerXREF_KeyLU AS d
		on c.EntCora_Account_ID = d.cora_acct_id  and
		a.custno = d.custno and
		a.custno is not null

----------------------------------------------------------------------
--Removed 20130313 odmcpeak and replaced with xrfCoraCompanyPrefix lookup
/*

	LEFT OUTER JOIN
	(
	SELECT
		x.*,
		y.CoraAcctID_Service
	FROM dbo.CustomerXREF_KeyLU AS x WITH (NOLOCK)
		INNER JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS y WITH (NOLOCK)
			ON x.cora_acct_id = y.CoraAcctID_Accounting
	--WHERE x.CustomerXREFID = (SELECT MIN(z.CustomerXREFID) FROM dbo.CustomerXREF_KeyLU z WITH (NOLOCK) WHERE z.cora_acct_id = x.cora_acct_id AND z.custno = x.custno)
	) AS d
		ON a.cora_acct_id = d.CoraAcctID_Service
		AND a.custno = d.custno
		AND d.custno IS NOT NULL
*/
	-- Added 20131104 odmcpeak to pick up DMSCustomerKey and immediately removed it when I found out that there are 37,500 dups in dim_DMSCustomer
	-- replaced with max(DMSCustomerKey)
	LEFT outer join (select max(DMSCustomerKey) as DMSCustomerKey,DMSCstCoraAcct,DMSCstCustNo from Dim_DMSCustomer  group by DMSCstCoraAcct,DMSCstCustNo) FF
	on c.EntCora_Account_ID = FF.DMSCstCoraAcct and
	a.custno = FF.DMSCstCustNo

	LEFT OUTER JOIN dbo.Dim_Vehicle e WITH (NOLOCK)
		ON a.vin = e.VehVIN
	LEFT OUTER JOIN dbo.Dim_DMSEmployee f WITH (NOLOCK)
		ON c.EntCora_Account_ID = f.cora_acct_id
		AND a.serviceadvisor = f.custno AND f.EMPNameCode = 8
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
WHERE a.ronumber IS NOT NULL
AND (a.closedate = (SELECT MAX(x.closedate) FROM ETL_Staging.wrk.DMS_servicesalesclosed_staging AS x WITH (NOLOCK)
WHERE x.cora_acct_id = a.cora_acct_id AND x.ronumber = a.ronumber AND x.vehid = a.vehid) and ROStatus = 1) OR ROStatus = 0
)

SELECT *
FROM cte_vw_FactService AS fs
WHERE fs.RowNum = fs.RowRank




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
