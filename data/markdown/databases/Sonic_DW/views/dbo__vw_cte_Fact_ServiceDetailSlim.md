---
name: vw_cte_Fact_ServiceDetailSlim
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_DMSEmployee
  - Dim_LaborType
  - Dim_OpCode
  - Dim_PricingGrid
dependency_count: 4
column_count: 57
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DMSEmployee** (U )
- **dbo.Dim_LaborType** (U )
- **dbo.Dim_OpCode** (U )
- **dbo.Dim_PricingGrid** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `EntityKey`               | int      | ✓        |             |
| `CustomerKey`             | int      |          |             |
| `TechnicianKey`           | int      | ✓        |             |
| `OpCodeKey`               | int      | ✓        |             |
| `LaborTypeKey`            | int      | ✓        |             |
| `LbrGridID`               | varchar  | ✓        |             |
| `PricingGridKey`          | int      | ✓        |             |
| `GridSaleDollars`         | money    | ✓        |             |
| `ServiceType`             | varchar  | ✓        |             |
| `LineItemType`            | varchar  | ✓        |             |
| `RONumber`                | varchar  | ✓        |             |
| `LineCode_Original`       | varchar  | ✓        |             |
| `LineCode`                | varchar  | ✓        |             |
| `LineNumber`              | int      | ✓        |             |
| `LaborSale`               | money    | ✓        |             |
| `LaborCost`               | money    | ✓        |             |
| `PartsSale`               | money    | ✓        |             |
| `PartsCost`               | money    | ✓        |             |
| `MiscSale`                | money    | ✓        |             |
| `MiscCost`                | money    | ✓        |             |
| `SoldHours`               | numeric  | ✓        |             |
| `ActualHours`             | numeric  | ✓        |             |
| `TimeCardHours`           | numeric  | ✓        |             |
| `GridableFlag`            | int      |          |             |
| `FDCILineNo`              | int      | ✓        |             |
| `UpsellFlag`              | int      |          |             |
| `OffGridFlag`             | int      | ✓        |             |
| `Complaint`               | varchar  | ✓        |             |
| `Cause`                   | varchar  | ✓        |             |
| `Correction`              | varchar  | ✓        |             |
| `LineItemCount`           | int      | ✓        |             |
| `CustomerPayCount`        | int      | ✓        |             |
| `InternalCount`           | int      | ✓        |             |
| `WarrantyCount`           | int      | ✓        |             |
| `cora_acct_id_service`    | int      | ✓        |             |
| `cora_acct_id_accounting` | int      | ✓        |             |
| `vehid`                   | varchar  | ✓        |             |
| `techno`                  | varchar  | ✓        |             |
| `opcode`                  | varchar  | ✓        |             |
| `labortype`               | varchar  | ✓        |             |
| `laborsalecompany`        | varchar  | ✓        |             |
| `laborsaleaccount`        | varchar  | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `Meta_SourceSystemName`   | varchar  | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `Meta_AuditKey`           | int      | ✓        |             |
| `Meta_NaturalKey`         | varchar  | ✓        |             |
| `MenuALC`                 | int      | ✓        |             |
| `MenuIPad`                | int      | ✓        |             |
| `originappl`              | varchar  |          |             |
| `origincode`              | varchar  |          |             |
| `ServiceKey`              | int      |          |             |
| `shopsuppliessales`       | numeric  | ✓        |             |
| `shopsuppliescost`        | numeric  | ✓        |             |
| `closedate`               | datetime | ✓        |             |
| `PricingGridPreference`   | bigint   | ✓        |             |

## Definition

```sql







-- Insert records from staging
--
-- ========================================================================
/*	Modified: 2017-03-28	Author: Jo Carter	US:1834		Change: change to use XrfServiceCora from TL_Staging.wrk.xrfCoraCompanyPrefix		*/
-- Author:		Roger Williams
-- Updated: CDE 03/22/2012 put into view
-- Description:	Updated R Williams Source
-- to include Ranking to elimiante dupes
-- updated LbrGridID, GridSaleDollarsActual, PricingGridKey CDE 04/25/2012
-- Updated 06/22/2012 CDE added shopsupplies cost and sales columns
-- Updated 20120816 ODMCPEAK - AND pg.PgrCalcType <> 'H' --  - Added this filter to the PricingGrid join.  Picking these up in the next step.
-- Updated 20141212 NCARPENDER modified code to remove duplicated generated from multiple pricing grid rows and from the xref table. The preference is created to prefer records with entitykeys and closest to the closeddate but before it.
-- UPDATE 08/05/2019 DMD: Change JOIN to Meta date columns to fix GridSaleDollars  being calculated incorrectly due to inaccuracy of meta date columns in relation to closed date key column
-- UPDATE 11/27/2019 DMD: if Labor Sale or Sold Hours <= $0  then GridableFlag = 0

-- ========================================================================
CREATE VIEW [dbo].[vw_cte_Fact_ServiceDetailSlim]
AS


WITH cte_FactServiceDetail
AS	(
		SELECT	COALESCE(xsc.EntityKey, -1)		AS EntityKey,
				--COALESCE(d.DimCustomerID, -1) AS CustomerKey,
				-1								as CustomerKey,
				--	coalesce(FF.DMSCustomerKey,-1)	as DMSCustomerKey,
				--	COALESCE(e.VehicleKey, -1)		AS VehicleKey,
				--	COALESCE(f.AssociateKey, -1)	AS ServiceAdvisorKey,
				--	COALESCE(g.DateKey, 19000101)	AS OpenDateKey,
				--	COALESCE(h.DateKey, 19000101)	AS CloseDateKey,
				COALESCE(i.AssociateKey, -1)	AS TechnicianKey,
				COALESCE(j.OpCodeKey, -1)		AS OpCodeKey,
				COALESCE(k.LaborTypeKey, -1)	AS LaborTypeKey,
				COALESCE(k.LbrGridID, '-1')		AS LbrGridID,  -- CDE 04/25/2012
				COALESCE(pg.PricingGridKey, -1) AS PricingGridKey,  -- CDE 04/25/2012
				COALESCE(pg.PgrGridDollarsActual, -1)	AS GridSaleDollars, --CDE 04/25/2012
				CONVERT(varchar(50), a.lineitemtype)	AS ServiceType, --rdw 11/09/2011
				CONVERT(varchar(50), a.lineitemtype)	AS LineItemType, --rdw 11/09/2011
				CONVERT(varchar(12), a.ronumber)		AS RONumber,
				--CONVERT(int,a.mileage)				AS Mileage,
				CONVERT(varchar(3), a.linecode_original) AS LineCode_Original,
				CONVERT(varchar(3), a.linecode) AS LineCode,
				CONVERT(int, a.linenumber)	AS LineNumber,
				CONVERT(money, a.laborsale) AS LaborSale,
				CONVERT(money, a.laborcost) AS LaborCost,
				CONVERT(money, a.partssale) AS PartsSale,
				CONVERT(money, a.partscost) AS PartsCost,
				--CONVERT(money, a.shopsuppliescost) AS ShopSuppliesCost,
				--CONVERT(money, a.shopsuppliessales) AS ShopSuppliesSales,
				CONVERT(money, a.miscsale) AS MiscSale,
				CONVERT(money, a.misccost) AS MiscCost,
				CONVERT(numeric(10, 2), a.soldhours) AS SoldHours,
				CONVERT(numeric(10, 2), a.actualhours) AS ActualHours,
				CONVERT(numeric(10, 2), a.timecardhours) AS TimeCardHours,
				--CONVERT(int, CASE WHEN k.LbrOffGridFlag = 0 THEN 1 ELSE 0 END) AS GridableFlag, --rdw 11/09/2011
				CASE WHEN  lineitemtype = 'CP' and a.offgrid = 0 AND k.LBRGridID IS NOT NULL AND (a.soldhours > 0 AND a.laborsale > 0) THEN 1			---- 11/27/19 DMD Updated: AND (a.soldhours > 0 AND a.laborsale > 0)
					ELSE 0
					END AS GridableFlag, -- Added CDE and R. Hanks to adjust GridableFlag 06/27/2012
				CASE WHEN j.OpcOther = 'FDCI'
					THEN a.linenumber
					ELSE 0
				END AS FDCILineNo,  -- CDE to identify linenumber on which the FDCI OpcOther appeared 06/27/2012
				0 AS UpsellFlag,
				CONVERT(int, CASE WHEN a.offgrid = 1 OR j.OpcOther = 'Off Grid' THEN 1 ELSE 0 END) AS OffGridFlag, --rdw 11/09/2011
				CONVERT(varchar(255), a.servicerequest) AS Complaint,
				CONVERT(varchar(255), a.causes) AS Cause,
				CONVERT(varchar(255), a.opcodedescription) AS Correction,
				CONVERT(int, COALESCE(a.opcodecountcustomerpay, 0) + COALESCE(a.opcodecountinternal, 0) + COALESCE(a.opcodecountwarranty, 0)) AS LineItemCount,
				CONVERT(int, COALESCE(a.opcodecountcustomerpay, 0)) AS CustomerPayCount,
				CONVERT(int, COALESCE(a.opcodecountinternal, 0)) AS InternalCount,
				CONVERT(int, COALESCE(a.opcodecountwarranty, 0)) AS WarrantyCount,
				CONVERT(int, a.cora_acct_id) AS cora_acct_id_service,
				CONVERT(int, xsc.Cora_Acct_ID) AS cora_acct_id_accounting,
				--CONVERT(varchar(50), a.custno) AS custno,
				CONVERT(varchar(17), a.vehid) AS vehid,
				--CONVERT(varchar(50), a.vin) AS vin,
				--	CONVERT(varchar(50), a.stockno) AS stockno,
				--CONVERT(varchar(17), a.serviceadvisor) AS serviceadvisor,
				--CONVERT(datetime, a.opendate) AS opendate,
				--CONVERT(datetime, a.closedate) AS closedate,
				CONVERT(varchar(17), a.techno) AS techno,
				CONVERT(varchar(20), a.opcode) AS opcode,
				CONVERT(varchar(5), a.labortype) AS labortype,
				CONVERT(varchar(50), a.laborsalecompany) AS laborsalecompany,
				CONVERT(varchar(50), a.laborsaleaccount) AS laborsaleaccount,
				CONVERT(int, a.ETLExecution_ID) AS ETLExecution_ID,
				CONVERT(int, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID,
				CONVERT(varchar(20), a.Meta_SourceSystemName) AS Meta_SourceSystemName,
				CONVERT(datetime, a.Meta_RowLastChangedDate) AS Meta_RowLastChangedDate,
				CONVERT(int, a.Meta_AuditKey) AS Meta_AuditKey,
				CONVERT(varchar(255), a.Meta_NaturalKey) AS Meta_NaturalKey,
				--  ROW_NUMBER() OVER(ORDER BY a.Cora_Acct_ID, a.linecode, a.vehid, a.ronumber, a.custno) AS RowNum, -- added by CDE to check for dupes
				-- RANK() OVER(ORDER BY a.Cora_Acct_ID, a.linecode, a.vehid, a.ronumber, a.custno) AS RowRank, -- added by CDE to check for dupes
				--ROStatus ,
				a.MenuALC,
				a.MenuIPad,
				ISNULL(a.originappl,'Unknown') as originappl,
				ISNULL(a.origincode,'Unknown') as origincode,
				ISNULL(FS.ServiceKey,-1) as ServiceKey,
				a.shopsuppliessales,
				a.shopsuppliescost,
				a.closedate,
				row_number() over (partition by a.cora_acct_id, a.ronumber, a.VehID, a.linecode, a.linecode_original, a.LineNumber
									order by pg.Meta_RowLastChangedDate DESC , case when xsc.entitykey <> -1 then 1 else 2 end) as PricingGridPreference
				/*NWC 20141212 the Grid records are creating duplicates. This should allow us to select the record where the grid record and the close date are closest.
					The join to the grid table should prevent records that occured after the close date.*/
	FROM	ETL_Staging.wrk.DMS_servicesalesdetailsslimclosed_staging AS a WITH (NOLOCK)

			left join [Sonic_DW].dbo.Fact_Service FS
				on a.cora_acct_id = FS.cora_acct_id_service
				and a.ronumber = FS.RONumber
				and a.vehid = FS.vehid

			LEFT OUTER JOIN ETL_Staging.wrk.XrefServiceCora xsc
				ON	a.Cora_Acct_id = xsc.Cora_Serv_ID
				--AND a.closedate BETWEEN xsc.Meta_RowEffectiveDate AND xsc.Meta_RowExpiredDate

			LEFT OUTER JOIN dbo.Dim_DMSEmployee i
				ON xsc.Cora_Acct_ID = i.cora_acct_id
				AND a.techno = i.custno AND i.EMPNameCode = 8

			LEFT OUTER JOIN dbo.Dim_OpCode AS j WITH (NOLOCK)
				ON a.cora_acct_id = j.OpcCoraAcctID
				AND a.opcode = j.OpcOpCode

			LEFT OUTER JOIN dbo.Dim_LaborType AS k WITH (NOLOCK)
				ON a.cora_acct_id = k.LbrCoraAcctID
				AND a.labortype = k.LbrLaborType
				--AND a.closedate between k.Meta_RowEffectiveDate and k.Meta_RowExpiredDate

			LEFT OUTER JOIN dbo.Dim_PricingGrid AS pg  -- Added  04/26/2012 CDE, R Hanks to get GridSaleDollars and PricingGridKey
				ON pg.PgrHdrcora_acct_id = a.cora_acct_id--.CoraAcctID_Service
				AND pg.PgrGridName = k.LbrGridID
				AND pg.PgrCalcType <> 'H' -- 20120816 ODMCPEAK - Added this filter to the join.  Picking these up in the next step.
				AND a.soldhours BETWEEN pg.PgrBeginHours AND pg.PgrEndHours
				--AND a.closedate between pg.Meta_RowEffectiveDate and pg.Meta_RowExpiredDate
				--AND a.closedate >= pg.Meta_RowLastChangedDate /*NWC 20141212 added to restrict results to only records that had a gridrecord at the time the ro was closed.*/


				/*	replaced 2017-03-28 jo carter US1834: change to use XrfServiceCora */
				-- Added 20130313 odmcpeak to use xrfCoraCompanyPrefix
				/* left outer join ETL_Staging.wrk.xrfCoraCompanyPrefix b (nolock) on a.cora_acct_id = b.cora_acct_id */
				/* LEFT outer join Dim_Entity c on b.Companyid = c.EntADPCompanyID AND b.Prefix = c.EntAccountingPrefix AND b.related_acctg_cora_acct_id = c.EntCora_Account_ID */

				--Temporarily removed by odmcpeak per RHanks and DExxum 20131104.  Set to -1 above
				/*-- Added 20130313 odmcpeak to use xrfCoraCompanyPrefix
				LEFT OUTER JOIN dbo.CustomerXREF_KeyLU AS d
					on c.EntCora_Account_ID = d.cora_acct_id
					and a.custno = d.custno and
					a.custno is not null
				*/

				/*-- Added 20131104 odmcpeak to pick up DMSCustomerKey and immediately removed it when I found out that there are 37,500 dups in dim_DMSCustomer
				LEFT outer join Dim_DMSCustomer FF
					on c.EntCora_Account_ID = FF.DMSCstCoraAcct
					and a.custno = FF.DMSCstCustNo
				*/

				-- Then added this back to eliminate the dups -- 20140101 odm moved to header
				/*
				LEFT outer join (select	max(DMSCustomerKey) as DMSCustomerKey,DMSCstCoraAcct,DMSCstCustNo
								from	dim_DMSCustomer group by DMSCstCoraAcct,DMSCstCustNo
								) FF
					on c.EntCora_Account_ID = FF.DMSCstCoraAcct
					and a.custno = FF.DMSCstCustNo
				*/

				/*
				LEFT join etl_staging.wrk.xrfCoraCompanyPrefix b ON a.cora_acct_id = b.CoraAcctID_Service
				LEFT JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS b WITH (NOLOCK)	ON a.cora_acct_id = b.CoraAcctID_Service
				LEFT JOIN dbo.Dim_Entity AS c WITH (NOLOCK)
					ON a.laborsalecompany = c.EntADPCompanyID
					and b.coraacctid_accounting = c.EntCora_Account_ID
					b.related_acctg_cora_acct_id = c.EntCora_Account_ID
					and b.prefix = c.EntAccountingPrefix
					AND CASE WHEN LEN(a.laborsaleaccount) = 4 THEN '0' ELSE LEFT(a.laborsaleaccount, 1) END = c.EntAccountingPrefix

				LEFT JOIN (	SELECT	x.*,	y.CoraAcctID_Service
							FROM	dbo.CustomerXREF_KeyLU AS x WITH (NOLOCK)
									INNER JOIN ETL_Staging.wrk.DMS_cora_acct_id_XLAT_Service AS y WITH (NOLOCK)
										ON x.cora_acct_id = y.CoraAcctID_Accounting
							WHERE	x.CustomerXREFID = (SELECT	MIN(z.CustomerXREFID)
														FROM	dbo.CustomerXREF_KeyLU AS z WITH (NOLOCK)
														WHERE	z.cora_acct_id = x.cora_acct_id AND z.custno = x.custno
														)
							) AS d
					ON a.cora_acct_id = d.CoraAcctID_Service
					AND a.custno = d.custno
				*/

				/* 20140101 Vin moved to header
				LEFT OUTER JOIN dbo.Dim_Vehicle AS e WITH (NOLOCK) ON a.vin = e.VehVIN
				*/

				/* 20140101 moved to header odm
				LEFT OUTER JOIN dbo.Dim_DMSEmployee AS f WITH (NOLOCK)
					ON b.CoraAcctID_Accounting = f.cora_acct_id
					ON c.EntCora_Account_ID  = f.cora_acct_id
					AND a.serviceadvisor = f.custno
					AND f.EMPNameCode = 8 -- added CDE 06/26/2012 to match up correct Service Advisor


				--LEFT OUTER JOIN dbo.Dim_Associate AS f
					--	ON a.serviceadvisor = f.AsoTimeClockID
					--	AND b.CompanyID = f.AsoLocation
					--	AND f.Meta_RowIsCurrent = 'Y' --for now!
					--	AND a.closedate BETWEEN f.Meta_RowEffectiveDate AND f.Meta_RowExpiredDate --for later!

				LEFT OUTER JOIN dbo.Dim_Date AS g WITH (NOLOCK)
					ON a.opendate = g.FullDate

				LEFT OUTER JOIN dbo.Dim_Date AS h WITH (NOLOCK)
					ON a.closedate = h.FullDate
				*/

				--LEFT OUTER JOIN dbo.Dim_Associate AS i WITH (NOLOCK)
					--	ON a.techno = i.AsoTimeClockID
					--	AND b.CompanyID = i.AsoLocation
					--	AND i.Meta_RowIsCurrent = 'Y' --for now!
					--	AND a.closedate BETWEEN i.Meta_RowEffectiveDate AND i.Meta_RowExpiredDate --for later!


	WHERE	a.ronumber IS NOT NULL
)
SELECT	fsd. *
FROM	cte_FactServiceDetail AS fsd
WHERE	PricingGridPreference = 1
;








```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
