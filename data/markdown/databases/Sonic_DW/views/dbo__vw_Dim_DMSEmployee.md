---
name: vw_Dim_DMSEmployee
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
  - DimAssociate
dependency_count: 2
column_count: 39
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DMSEmployee** (U )
- **dbo.DimAssociate** (U )

## Columns

| Name                      | Type     | Nullable | Description |
| ------------------------- | -------- | -------- | ----------- |
| `AssociateKey`            | int      |          |             |
| `cora_acct_id`            | int      |          |             |
| `hostitemid`              | varchar  | ✓        |             |
| `accountingaccount`       | varchar  |          |             |
| `custno`                  | varchar  |          |             |
| `AsoNameFirst`            | varchar  | ✓        |             |
| `AsoNameLast`             | varchar  | ✓        |             |
| `EMPMiddleName`           | varchar  | ✓        |             |
| `EMPName1`                | varchar  | ✓        |             |
| `EMPAddress`              | varchar  | ✓        |             |
| `EMPAddress2`             | varchar  | ✓        |             |
| `EMPCity`                 | varchar  | ✓        |             |
| `EMPState`                | char     | ✓        |             |
| `EMPZipPostal`            | varchar  | ✓        |             |
| `EMPNameCode`             | varchar  | ✓        |             |
| `AsoTechClass`            | char     | ✓        |             |
| `AsoTechDepartment`       | varchar  | ✓        |             |
| `AsoTechLicenseNumber`    | varchar  | ✓        |             |
| `AsoTechTeamLeader`       | char     | ✓        |             |
| `AsoTechTeamNumber`       | char     | ✓        |             |
| `AsoTechHourlyRate`       | numeric  | ✓        |             |
| `CreatedDate`             | int      | ✓        |             |
| `UpdatedDate`             | int      | ✓        |             |
| `ETLExecution_ID`         | int      | ✓        |             |
| `User_ID`                 | varchar  | ✓        |             |
| `Meta_ComputerName`       | varchar  | ✓        |             |
| `Meta_Src_Sys_ID`         | int      | ✓        |             |
| `Meta_SourceSystemName`   | varchar  | ✓        |             |
| `Meta_LoadDate`           | datetime | ✓        |             |
| `Meta_RowEffectiveDate`   | datetime | ✓        |             |
| `Meta_RowExpiredDate`     | datetime | ✓        |             |
| `Meta_RowIsCurrent`       | char     | ✓        |             |
| `Meta_RowLastChangedDate` | datetime | ✓        |             |
| `Meta_AuditKey`           | int      | ✓        |             |
| `Meta_NaturalKey`         | varchar  | ✓        |             |
| `MetaNaturalKeyU`         | nvarchar | ✓        |             |
| `Meta_Checksum`           | int      | ✓        |             |
| `EmployeeName`            | varchar  | ✓        |             |
| `AsoJobCode`              | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_DMSEmployee
AS
SELECT        dmse.AssociateKey, dmse.cora_acct_id, dmse.hostitemid, dmse.accountingaccount, dmse.custno, dmse.AsoNameFirst, dmse.AsoNameLast, dmse.EMPMiddleName, dmse.EMPName1, dmse.EMPAddress, dmse.EMPAddress2,
                         dmse.EMPCity, dmse.EMPState, dmse.EMPZipPostal, dmse.EMPNameCode, dmse.AsoTechClass, dmse.AsoTechDepartment, dmse.AsoTechLicenseNumber, dmse.AsoTechTeamLeader, dmse.AsoTechTeamNumber,
                         dmse.AsoTechHourlyRate, dmse.CreatedDate, dmse.UpdatedDate, dmse.ETLExecution_ID, dmse.User_ID, dmse.Meta_ComputerName, dmse.Meta_Src_Sys_ID, dmse.Meta_SourceSystemName, dmse.Meta_LoadDate,
                         dmse.Meta_RowEffectiveDate, dmse.Meta_RowExpiredDate, dmse.Meta_RowIsCurrent, dmse.Meta_RowLastChangedDate, dmse.Meta_AuditKey, dmse.Meta_NaturalKey, dmse.MetaNaturalKeyU, dmse.Meta_Checksum,
                         dmse.EmployeeName, a.AsoJobCode
FROM            dbo.Dim_DMSEmployee AS dmse LEFT OUTER JOIN
                             (SELECT        AsoTimeClockID, AsoJobCode
                               FROM            dbo.DimAssociate
                               WHERE        (Meta_RowIsCurrent = 'Y')) AS a ON dmse.custno = a.AsoTimeClockID

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
