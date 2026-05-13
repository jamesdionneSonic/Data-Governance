---
name: vw_Dim_Acct_Insert
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Account
  - fn_ProperCase
dependency_count: 2
column_count: 51
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )
- **dbo.fn_ProperCase** (FN)

## Columns

| Name                           | Type     | Nullable | Description |
| ------------------------------ | -------- | -------- | ----------- |
| `AccCoraAcctId`                | int      | ✓        |             |
| `AccCompanyId`                 | int      | ✓        |             |
| `AccDeptId`                    | varchar  | ✓        |             |
| `AccAccountNumber`             | varchar  | ✓        |             |
| `AccAccountDesc`               | varchar  | ✓        |             |
| `AccAccountType`               | char     | ✓        |             |
| `AccAccountTypeDesc`           | varchar  | ✓        |             |
| `AccAccountSubType`            | char     | ✓        |             |
| `AccAccountSubTypeDesc`        | varchar  | ✓        |             |
| `AccAccountUpdateDate`         | datetime | ✓        |             |
| `AccControlType`               | int      | ✓        |             |
| `AccControlTypeDesc`           | varchar  | ✓        |             |
| `AccControl2Type`              | int      | ✓        |             |
| `AccControl2TypeDesc`          | varchar  | ✓        |             |
| `AccIncomeBalanceGroup`        | varchar  | ✓        |             |
| `AccIncomeBalanceGroupDesc`    | varchar  | ✓        |             |
| `AccIncomeBalanceSubGroup`     | varchar  | ✓        |             |
| `AccIncomeBalanceSubGroupDesc` | varchar  | ✓        |             |
| `AccProductionType`            | int      | ✓        |             |
| `AccProductionTypeDesc`        | varchar  | ✓        |             |
| `AccReportGroup`               | varchar  | ✓        |             |
| `AccReportGroupDesc`           | varchar  | ✓        |             |
| `AccUNAGroup`                  | varchar  | ✓        |             |
| `AccUNAGroupDesc`              | varchar  | ✓        |             |
| `AccEntityType`                | varchar  | ✓        |             |
| `AccCOAType`                   | varchar  | ✓        |             |
| `AccActiveFlag`                | bit      | ✓        |             |
| `AccPrefix`                    | varchar  | ✓        |             |
| `AccAccount`                   | varchar  | ✓        |             |
| `AccDepartmentLookup`          | varchar  | ✓        |             |
| `AccDepartment`                | varchar  | ✓        |             |
| `AccDepartmentName`            | varchar  | ✓        |             |
| `AccAccountCategory`           | varchar  | ✓        |             |
| `AccExcludeFlag`               | bit      | ✓        |             |
| `AccHFMAccount`                | varchar  | ✓        |             |
| `AccHFMDepartment`             | varchar  | ✓        |             |
| `ETLExecution_ID`              | int      | ✓        |             |
| `Meta_Src_Sys_ID`              | int      | ✓        |             |
| `User_ID`                      | varchar  | ✓        |             |
| `Meta_ComputerName`            | varchar  | ✓        |             |
| `Meta_SourceSystemName`        | varchar  | ✓        |             |
| `Meta_RowEffectiveDate`        | datetime | ✓        |             |
| `Meta_RowExpiredDate`          | datetime | ✓        |             |
| `Meta_RowIsCurrent`            | char     | ✓        |             |
| `Meta_RowLastChangedDate`      | datetime | ✓        |             |
| `Meta_AuditKey`                | int      | ✓        |             |
| `Meta_NaturalKey`              | varchar  | ✓        |             |
| `Meta_Checksum`                | int      | ✓        |             |
| `AccBeginDate`                 | datetime | ✓        |             |
| `AccEndDate`                   | datetime | ✓        |             |
| `AccFixedAssetCategory`        | varchar  | ✓        |             |

## Definition

```sql

/*****************************************************************************
--
-- Created By Roger Williams
-- Put into view by CDE 08/29/2012
-- Added NOT EXIST Predicate to accurately check for accounts not
-- previously loaded into Dim_Account. Replaced IS NULL accountnumber from
-- Dim_Account
-- Updated CDE 08/31/2012 to remove cora 3732 from being loaded
-- NWC 20140708 Added BeginDate and EndDate columns
-- NWC 20140805 Added FixedAssetCategory column
*******************************************************************************/

CREATE VIEW [dbo].[vw_Dim_Acct_Insert]
AS

SELECT  CONVERT(INT, a.cora_acct_id) AS AccCoraAcctId
       ,CONVERT(INT, a.companyid) AS AccCompanyId
       ,CONVERT(VARCHAR(3), a.deptid) AS AccDeptId
       ,CONVERT(VARCHAR(7), a.accountnumber) AS AccAccountNumber
       ,CONVERT(VARCHAR(50), NULLIF(LTRIM(RTRIM(a.accountdescription)), '')) AS AccAccountDesc
       ,CONVERT(CHAR(1), NULLIF(LTRIM(RTRIM(a.accounttype)), '')) AS AccAccountType
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.accounttypedesc)), '')) AS AccAccountTypeDesc
       ,CONVERT(CHAR(2), NULLIF(LTRIM(RTRIM(a.acctsubtype)), '')) AS AccAccountSubType
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.acctsubtypedesc)), '')) AS AccAccountSubTypeDesc
       ,CONVERT(DATETIME, a.acctupddate) AS AccAccountUpdateDate
       ,CONVERT(INT, a.cntltype) AS AccControlType
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.cntltypedesc)), '')) AS AccControlTypeDesc
       ,CONVERT(INT, a.cntl2type) AS AccControl2Type
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.cntl2typedesc)), '')) AS AccControl2TypeDesc
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.incbalgrp)), '')) AS AccIncomeBalanceGroup
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.incbalgrpdesc)), '')) AS AccIncomeBalanceGroupDesc
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.incbalsubgrp)), '')) AS AccIncomeBalanceSubGroup
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.incbalsubgrpdesc)), '')) AS AccIncomeBalanceSubGroupDesc
       ,CONVERT(INT, a.prodtype) AS AccProductionType
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.prodtypedesc)), '')) AS AccProductionTypeDesc
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.rptgrp)), '')) AS AccReportGroup
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.rptgrpdesc)), '')) AS AccReportGroupDesc
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.unagrp)), '')) AS AccUNAGroup
       ,CONVERT(VARCHAR(30), NULLIF(LTRIM(RTRIM(a.unagrpdesc)), '')) AS AccUNAGroupDesc
       ,CONVERT(VARCHAR(30), a.EntityType) AS AccEntityType
       ,CONVERT(VARCHAR(30), a.COAType) AS AccCOAType
       ,CONVERT(BIT, a.CompanyActiveFlag) AS AccActiveFlag
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.Prefix)), '')) AS AccPrefix
       ,CONVERT(VARCHAR(10), NULLIF(LTRIM(RTRIM(a.Account)), '')) AS AccAccount
       ,CONVERT(VARCHAR(10), NULLIF(LTRIM(RTRIM(a.DepartmentLookup)), '')) AS AccDepartmentLookup
       ,CONVERT(VARCHAR(3), NULLIF(LTRIM(RTRIM(a.Department)), '')) AS AccDepartment
       ,CONVERT(VARCHAR(255), dbo.fn_ProperCase(a.DepartmentName)) AS AccDepartmentName
       ,CONVERT(VARCHAR(25), NULLIF(LTRIM(RTRIM(a.SSISPath)), '')) AS AccAccountCategory
       ,CONVERT(BIT, a.ExcludeFlag) AS AccExcludeFlag
       ,CONVERT(VARCHAR(10), COALESCE(NULLIF(LTRIM(RTRIM(a.HFMAccount)), ''),
                                      '-1')) AS AccHFMAccount
       ,CASE WHEN CONVERT(VARCHAR(10), COALESCE(NULLIF(LTRIM(RTRIM(a.HFMAccount)),
                                                       ''), '-1')) = '-1'
             THEN '-1'
             ELSE CONVERT(VARCHAR(50), COALESCE(NULLIF(LTRIM(RTRIM(a.HFMDepartment)),
                                                       ''), '-1'))
        END AS AccHFMDepartment
       ,CONVERT(INT, a.ETLExecution_ID) AS ETLExecution_ID
       ,CONVERT(INT, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID
       ,CONVERT(VARCHAR(20), a.User_ID) AS User_ID
       ,CONVERT(VARCHAR(20), a.Meta_ComputerName) AS Meta_ComputerName
       ,CONVERT(VARCHAR(20), a.Meta_SourceSystemName) AS Meta_SourceSystemName
       ,CONVERT(DATETIME, a.Meta_RowEffectiveDate) AS Meta_RowEffectiveDate
       ,CONVERT(DATETIME, a.Meta_RowExpiredDate) AS Meta_RowExpiredDate
       ,CONVERT(CHAR(1), a.Meta_RowIsCurrent) AS Meta_RowIsCurrent
       ,CONVERT(DATETIME, a.Meta_RowLastChangedDate) AS Meta_RowLastChangedDate
       ,CONVERT(INT, a.Meta_AuditKey) AS Meta_AuditKey
       ,CONVERT(VARCHAR(255), a.Meta_NaturalKey) AS Meta_NaturalKey
       ,CONVERT(INT, a.Meta_Checksum) AS Meta_Checksum

	   , a.BeginDate AS AccBeginDate				/*	NWC	20140708	Added new field	*/
	   , a.EndDate AS AccEndDate					/*	NWC	20140708	Added new field	*/
	   , CONVERT(VARCHAR(1),a.FixedAssetCategory) AS AccFixedAssetCategory /*	NWC	20140805	Added new field	*/

       --,ROW_NUMBER() OVER(ORDER BY a.cora_acct_id, a.companyid, a.accountnumber ) AS RowNum
      -- ,RANK() OVER(ORDER BY a.cora_acct_id, a.companyid, a.accountnumber) AS RowRank
FROM ETL_Staging.wrk.DMS_glcoa_x_staging AS a
WHERE NOT EXISTS(
					SELECT
						  AccCoraAcctId
						, AccCompanyID
						, AccAccountNumber
					FROM dbo.Dim_Account AS b -- added CDE 08/29/2012 to check for new Dim_Acct records
					WHERE a.cora_acct_id = b.AccCoraAcctId
						AND CAST(a.companyid AS INT) = b.AccCompanyId
						AND CONVERT(VARCHAR(7),a.accountnumber) = b.AccAccountNumber
				)
	AND a.cora_acct_id <> 3732  -- added CDE 08/31/2012 to keep out cora 3732 dummy records


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
