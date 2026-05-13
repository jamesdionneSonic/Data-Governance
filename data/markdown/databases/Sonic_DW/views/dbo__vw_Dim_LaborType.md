---
name: vw_Dim_LaborType
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - Dim_LaborType
  - Dim_LaborType_Transact
  - xrfCoraCompanyPrefix
dependency_count: 4
column_count: 31
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.Dim_LaborType** (U )
- **dbo.Dim_LaborType_Transact** (U )
- **dbo.xrfCoraCompanyPrefix** (U )

## Columns

| Name                               | Type     | Nullable | Description |
| ---------------------------------- | -------- | -------- | ----------- |
| `LaborTypeKey`                     | int      | ✓        |             |
| `LbrCoraAcctId`                    | int      | ✓        |             |
| `LbrLaborType`                     | varchar  | ✓        |             |
| `LbrLaborTypeDescription_Original` | varchar  | ✓        |             |
| `LbrLaborTypeDescription`          | varchar  | ✓        |             |
| `LbrLaborTypeCategory`             | varchar  | ✓        |             |
| `LbrLaborRate`                     | numeric  | ✓        |             |
| `LbrLaborPricingCode`              | int      | ✓        |             |
| `LbrLaborPricingCodeDescription`   | varchar  | ✓        |             |
| `LbrHostDB`                        | varchar  | ✓        |             |
| `LbrGridID`                        | varchar  | ✓        |             |
| `LbrGridName`                      | varchar  | ✓        |             |
| `LbrGridAccountingFlag`            | varchar  | ✓        |             |
| `LbrOffGridFlag`                   | bit      | ✓        |             |
| `LbrCompany`                       | varchar  | ✓        |             |
| `LbrAccountPrefix`                 | char     | ✓        |             |
| `ETLExecution_ID`                  | int      | ✓        |             |
| `MetaSrc_Sys_ID`                   | int      | ✓        |             |
| `MetaSourceSystemName`             | varchar  | ✓        |             |
| `MetaRowEffectiveDate`             | datetime | ✓        |             |
| `MetaRowExpiredDate`               | datetime | ✓        |             |
| `MetaRowIsCurrent`                 | char     | ✓        |             |
| `MetaRowLastChangedDate`           | datetime | ✓        |             |
| `MetaUserName`                     | varchar  | ✓        |             |
| `MetaAuditKey`                     | int      | ✓        |             |
| `MetaNaturalKey`                   | varchar  | ✓        |             |
| `MetaChecksum`                     | int      | ✓        |             |
| `MetaComputerName`                 | varchar  | ✓        |             |
| `EntityKey`                        | int      | ✓        |             |
| `EntHFMDealershipName`             | varchar  | ✓        |             |
| `HasGrid`                          | int      |          |             |

## Definition

```sql


/***********************************************************************
* - Updated by Jonathan Henin
* - Updated 02/18/2014
* - Used by MicroStrategy
*
*
***********************************************************************
SELECT * FROM dbo.Dim_LaborType --3329*/
CREATE VIEW [dbo].[vw_Dim_LaborType]
AS
SELECT        a.LaborTypeKey, a.LbrCoraAcctId, a.LbrLaborType, a.LbrLaborTypeDescription_Original, a.LbrLaborTypeDescription, c.LbrLaborTypeCategory, a.LbrLaborRate, a.LbrLaborPricingCode, a.LbrLaborPricingCodeDescription,
                         a.LbrHostDB, a.LbrGridID, a.LbrGridName, a.LbrGridAccountingFlag, a.LbrOffGridFlag, a.LbrCompany, a.LbrAccountPrefix, a.ETLExecution_ID, a.Meta_Src_Sys_ID AS MetaSrc_Sys_ID,
                         a.Meta_SourceSystemName AS MetaSourceSystemName, a.Meta_RowEffectiveDate AS MetaRowEffectiveDate, a.Meta_RowExpiredDate AS MetaRowExpiredDate, a.Meta_RowIsCurrent AS MetaRowIsCurrent,
                         a.Meta_RowLastChangedDate AS MetaRowLastChangedDate, a.User_ID AS MetaUserName, a.Meta_AuditKey AS MetaAuditKey, a.Meta_NaturalKey AS MetaNaturalKey, a.Meta_Checksum AS MetaChecksum,
                         a.Meta_ComputerName AS MetaComputerName, b.EntityKey, b.EntHFMDealershipName, CASE WHEN LbrGridID IS NULL THEN 0 ELSE 1 END AS HasGrid
FROM            dbo.Dim_LaborType_Transact AS c RIGHT OUTER JOIN
                         dbo.Dim_LaborType AS a WITH (NOLOCK) ON c.LbrCoraAcctId = a.LbrCoraAcctId AND c.LbrLaborType = a.LbrLaborType FULL OUTER JOIN
                         dbo.Dim_Entity AS b WITH (NOLOCK) INNER JOIN
                         [xrfCoraCompanyPrefix] AS CCP ON b.EntADPCompanyID = CCP.Companyid AND b.EntAccountingPrefix = CCP.Prefix AND b.EntCora_Account_ID = CCP.related_acctg_cora_acct_id ON
                         a.LbrCoraAcctId = CCP.cora_acct_id
WHERE        (a.LaborTypeKey IS NOT NULL)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
