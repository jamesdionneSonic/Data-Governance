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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
