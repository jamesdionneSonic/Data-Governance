---
name: vw_DimLaborType
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_LaborType
dependency_count: 1
column_count: 42
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_LaborType** (U )

## Columns

| Name                               | Type     | Nullable | Description |
| ---------------------------------- | -------- | -------- | ----------- |
| `LbrCoraAcctId`                    | int      | ✓        |             |
| `LbrLaborType`                     | varchar  | ✓        |             |
| `LbrLaborTypeDescription_Original` | varchar  | ✓        |             |
| `LbrLaborTypeDescription`          | varchar  | ✓        |             |
| `LbrLaborTypeCategory`             | int      | ✓        |             |
| `LbrLaborRate`                     | numeric  | ✓        |             |
| `LbrLaborPricingCode`              | int      | ✓        |             |
| `LbrLaborPricingCodeDescription`   | varchar  | ✓        |             |
| `LbrHostDB`                        | varchar  | ✓        |             |
| `LbrGridID`                        | varchar  | ✓        |             |
| `LbrGridName`                      | varchar  | ✓        |             |
| `LbrOffGridFlag`                   | int      |          |             |
| `LbrGridAccountingFlag`            | varchar  | ✓        |             |
| `LbrCompany`                       | varchar  | ✓        |             |
| `LbrJournalSource`                 | varchar  | ✓        |             |
| `LbrJournalSourceCompany`          | varchar  | ✓        |             |
| `LbrLaborSaleCompany`              | varchar  | ✓        |             |
| `LbrLaborSaleAccount`              | varchar  | ✓        |             |
| `LbrLaborTypeDebitAccount`         | varchar  | ✓        |             |
| `LbrLubeSaleCompany`               | varchar  | ✓        |             |
| `LbrLubeSaleAccount`               | varchar  | ✓        |             |
| `LbrMiscSaleCompany`               | varchar  | ✓        |             |
| `LbrMiscSaleAccount`               | varchar  | ✓        |             |
| `LbrPartsSaleCompany`              | varchar  | ✓        |             |
| `LbrPartsSaleAccount`              | varchar  | ✓        |             |
| `LbrShopChargeFlag`                | varchar  | ✓        |             |
| `LbrSubletSaleCompany`             | varchar  | ✓        |             |
| `LbrSubletLaborAccount`            | varchar  | ✓        |             |
| `LbrSubletPartsAccount`            | varchar  | ✓        |             |
| `LbrSubletSaleAccount`             | varchar  | ✓        |             |
| `LbrSubletSaleMarkup`              | varchar  | ✓        |             |
| `LbrAccountPrefix`                 | char     | ✓        |             |
| `ETLExecution_ID`                  | int      | ✓        |             |
| `Meta_Src_Sys_ID`                  | int      | ✓        |             |
| `Meta_SourceSystemName`            | varchar  | ✓        |             |
| `Meta_RowEffectiveDate`            | datetime | ✓        |             |
| `Meta_RowExpiredDate`              | datetime | ✓        |             |
| `Meta_RowIsCurrent`                | char     | ✓        |             |
| `Meta_RowLastChangedDate`          | datetime | ✓        |             |
| `Meta_AuditKey`                    | int      | ✓        |             |
| `Meta_NaturalKey`                  | varchar  | ✓        |             |
| `Meta_Checksum`                    | int      | ✓        |             |

## Definition

```sql
/***********************************************************************
* - History
* -------------------------------------------------------
* - Created by Roger Williams
* - Updated CDE 06/26/2012
* - Added view and CASE stmt for LbrOffGridFlag
* -------------------------------------------------------
* - Date   : 2 Jul 2014
* - Author : Akanksha Goyal
* - Search tag : Additional Columns
* - Comment : Requested to add 17 columns in [DIM_LaborType] table
* -------------------------------------------------------
************************************************************************/
--
-- Insert NEW records from staging
--
--SELECT * FROM ETL_Staging.load.DMS_labortype_staging
--SELECT * FROM Sonic_DW.dbo.Dim_LaborType


CREATE VIEW  [dbo].[vw_DimLaborType]
AS


SELECT
	CONVERT(int, a.cora_acct_id) AS LbrCoraAcctId,
	CONVERT(varchar(20), LTRIM(RTRIM(a.hostitemid))) AS LbrLaborType,
	CONVERT(varchar(255), a.labortypedescription) AS LbrLaborTypeDescription_Original,
	CONVERT(varchar(255),
		CASE
			WHEN LEN(NULLIF(LTRIM(RTRIM(REPLACE(a.labortypedescription, CHAR(34), ''))), '')) = 1 THEN 'Unknown'
			ELSE COALESCE(NULLIF(LTRIM(RTRIM(REPLACE(a.labortypedescription, CHAR(34), ''))), ''), 'Unknown')
		END) AS LbrLaborTypeDescription,
	NULL AS LbrLaborTypeCategory,
	CONVERT(numeric(10, 2), a.laborrate) AS LbrLaborRate,
	CONVERT(int, a.laborpricingcode) AS LbrLaborPricingCode,
	CONVERT(varchar(50), a.laborpricingcodedesc) AS LbrLaborPricingCodeDescription,
	CONVERT(varchar(50), a.hostdb) AS LbrHostDB,
	CONVERT(varchar(50), a.gridid) AS LbrGridID,
	CONVERT(varchar(50), a.gridname) AS LbrGridName,
		CASE
		WHEN LEFT(a.hostitemid, 1) = 'C' AND a.gridid IS NOT NULL  -- Added CDE 06/26/2012 for OffGridFlag
		THEN 1
		ELSE 0
	END AS LbrOffGridFlag,
	CONVERT(varchar(50), a.gridaccountingflag) AS LbrGridAccountingFlag,
	--NULL AS LbrOffGridFlag,
	CONVERT(varchar(10), a.laborsalecompany) AS LbrCompany,

	-- Additional Columns [START]

	CONVERT(varchar(50), a.journalsource) AS LbrJournalSource,
	CONVERT(varchar(50), a.journalsourcecompany) AS LbrJournalSourceCompany,
	CONVERT(varchar(50), a.laborsalecompany) AS LbrLaborSaleCompany,
	CONVERT(varchar(50), a.laborsaleaccount) AS LbrLaborSaleAccount,
	CONVERT(varchar(50), a.labortypedebitaccount) AS LbrLaborTypeDebitAccount,
	CONVERT(varchar(50), a.lubesalecompany) AS LbrLubeSaleCompany,
	CONVERT(varchar(50), a.lubesaleaccount) AS LbrLubeSaleAccount,
	CONVERT(varchar(50), a.miscsalecompany) AS LbrMiscSaleCompany,
	CONVERT(varchar(50), a.miscsaleaccount) AS LbrMiscSaleAccount,
	CONVERT(varchar(50), a.partssalecompany) AS LbrPartsSaleCompany,
	CONVERT(varchar(50), a.partssaleaccount) AS LbrPartsSaleAccount,
	CONVERT(varchar(50), a.shopchargeflag) AS LbrShopChargeFlag,
	CONVERT(varchar(50), a.subletsalecompany) AS LbrSubletSaleCompany,
	CONVERT(varchar(50), a.subletlaboraccount) AS LbrSubletLaborAccount,
	CONVERT(varchar(50), a.subletpartsaccount) AS LbrSubletPartsAccount,
	CONVERT(varchar(50), a.subletsaleaccount) AS LbrSubletSaleAccount,
	CONVERT(varchar(50), a.subletsalemarkup) AS LbrSubletSaleMarkup,

	-- Additional Columns [END]

CONVERT(char(1), CASE WHEN LEN(LTRIM(RTRIM(a.laborsaleaccount))) = 4 THEN 0 ELSE LEFT(LTRIM(RTRIM(a.laborsaleaccount)), 1) END) AS LbrAccountPrefix,
	CONVERT(int, a.ETLExecution_ID) AS ETLExecution_ID,
	CONVERT(int, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID,
	CONVERT(varchar(20), a.Meta_SourceSystemName) AS Meta_SourceSystemName,
	CONVERT(datetime, a.Meta_RowEffectiveDate) AS Meta_RowEffectiveDate,
	CONVERT(datetime, a.Meta_RowExpiredDate) AS Meta_RowExpiredDate,
	CONVERT(char(1), a.Meta_RowIsCurrent) AS Meta_RowIsCurrent,
	CONVERT(datetime, a.Meta_RowLastChangedDate) AS Meta_RowLastChangedDate,
	CONVERT(int, a.Meta_AuditKey) AS Meta_AuditKey,
	CONVERT(varchar(255), a.Meta_NaturalKey) AS Meta_NaturalKey,
	CONVERT(int, a.Meta_Checksum) AS Meta_Checksum
FROM ETL_Staging.wrk.DMS_labortype_staging a WITH (NOLOCK)
	LEFT JOIN dbo.Dim_LaborType b WITH (NOLOCK)
		ON a.cora_acct_id = b.LbrCoraAcctId --natural key
		AND a.hostitemid = b.LbrLaborType   --natural key
WHERE b.LbrLaborType IS NULL --NOT IN
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
