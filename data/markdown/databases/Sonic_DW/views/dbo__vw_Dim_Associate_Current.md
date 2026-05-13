---
name: vw_Dim_Associate_Current
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
  - DimAssociate
dependency_count: 2
column_count: 74
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimAssociate** (U )

## Columns

| Name                         | Type      | Nullable | Description |
| ---------------------------- | --------- | -------- | ----------- |
| `AssociateKey`               | int       |          |             |
| `AsoLocation`                | int       |          |             |
| `AsoDMS4Digit`               | int       |          |             |
| `AsoEmployeeNumber`          | int       |          |             |
| `AsoTimeClockID`             | varchar   |          |             |
| `AsoDepartmentCode`          | varchar   |          |             |
| `AsoDepartment`              | varchar   |          |             |
| `AsoDMSGLCode`               | varchar   |          |             |
| `AsoFirstName`               | varchar   |          |             |
| `AsoMiddleName`              | varchar   |          |             |
| `AsoLastName`                | varchar   |          |             |
| `AsoOriginalHireDateKey`     | int       |          |             |
| `AsoSeniorityDateKey`        | int       |          |             |
| `AsoTerminationDateKey`      | int       |          |             |
| `AsoLastHireDateKey`         | int       |          |             |
| `AsoEmployeeStatus`          | varchar   | ✓        |             |
| `AsoEmplStatusStartDate`     | int       |          |             |
| `AsoFullOrPartTime`          | varchar   | ✓        |             |
| `AsoDateInJobKey`            | int       |          |             |
| `AsoJobCode`                 | varchar   | ✓        |             |
| `AsoJobGroupCode`            | varchar   |          |             |
| `AsoJobFamily`               | varchar   |          |             |
| `AsoecJobtitle`              | varchar   |          |             |
| `AsoSalaryOrHourly`          | char      |          |             |
| `AsoSupervisorID`            | int       |          |             |
| `AsoSupervisorName`          | varchar   |          |             |
| `AsoActionReason`            | varchar   |          |             |
| `AsoActionReasonDescription` | varchar   |          |             |
| `AsoTermReason`              | varchar   |          |             |
| `AsoTermReasonDescription`   | varchar   |          |             |
| `AsoChangeReason`            | varchar   |          |             |
| `AsoChangeReasonDescription` | varchar   |          |             |
| `AsoWorkEmailAddress`        | varchar   |          |             |
| `AsoSystemUpdatedDateTime`   | datetime2 |          |             |
| `AsoIsManager`               | char      |          |             |
| `AsoWCState`                 | char      |          |             |
| `AsoTechClass`               | char      |          |             |
| `AsoTechDepartment`          | varchar   |          |             |
| `AsoTechLicenseNumber`       | varchar   |          |             |
| `AsoTechTeamLeader`          | char      |          |             |
| `AsoTechTeamNumber`          | char      |          |             |
| `AsoTechHourlyRate`          | numeric   |          |             |
| `Meta_LoadDate`              | datetime  |          |             |
| `Meta_SrcSysID`              | int       |          |             |
| `Meta_SourceSystemName`      | varchar   | ✓        |             |
| `Meta_RowEffectiveDate`      | datetime  |          |             |
| `Meta_RowExpiredDate`        | datetime  | ✓        |             |
| `Meta_RowIsCurrent`          | char      |          |             |
| `Meta_RowLastChangedDate`    | datetime  |          |             |
| `Meta_AuditKey`              | int       | ✓        |             |
| `Meta_AuditScore`            | int       | ✓        |             |
| `Meta_Checksum_Type1`        | int       | ✓        |             |
| `Meta_Checksum_Type2`        | int       | ✓        |             |
| `User_ID`                    | varchar   |          |             |
| `Meta_ComputerName`          | varchar   |          |             |
| `Meta_SourceFileName`        | varchar   | ✓        |             |
| `Meta_NaturalKey`            | varchar   |          |             |
| `ETLExecution_ID`            | int       |          |             |
| `EntityKey`                  | int       | ✓        |             |
| `AsoWorkMobileNumber`        | int       |          |             |
| `AsoWorkCellAreaCode`        | int       |          |             |
| `AsoWorkCellPhone`           | int       |          |             |
| `AsoLineOfBusiness`          | varchar   | ✓        |             |
| `AsoBonusType`               | varchar   | ✓        |             |
| `AsoDeptName`                | varchar   | ✓        |             |
| `AsoOrgName`                 | varchar   | ✓        |             |
| `AsoRegionCode`              | varchar   | ✓        |             |
| `AsoRegionName`              | varchar   | ✓        |             |
| `AsoAssignNo`                | varchar   | ✓        |             |
| `AsoLMSID`                   | bigint    | ✓        |             |
| `AsoResidenceState`          | varchar   | ✓        |             |
| `AsoBirthDate`               | varchar   | ✓        |             |
| `AsoLocationFull`            | int       | ✓        |             |
| `Generation`                 | varchar   | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_Associate_Current]
AS
SELECT        a.AssociateKey, a.AsoLocation, a.AsoDMS4Digit, a.AsoEmployeeNumber, a.AsoTimeClockID, a.AsoDepartmentCode, a.AsoDepartment, a.AsoDMSGLCode, a.AsoFirstName, a.AsoMiddleName, a.AsoLastName,
                         a.AsoOriginalHireDateKey, a.AsoSeniorityDateKey, CASE WHEN a.AsoTerminationDateKey = 99991231 THEN 19000101 ELSE a.AsoTerminationDateKey END AS AsoTerminationDateKey, a.AsoLastHireDateKey,
                         a.AsoEmployeeStatus, a.AsoEmplStatusStartDateKey AS AsoEmplStatusStartDate, a.AsoFullOrPartTime, a.AsoDateInJobKey, a.AsoJobCode, a.AsoJobGroupCode, a.AsoJobFamily, a.AsoecJobtitle, a.AsoSalaryOrHourly,
                         a.AsoSupervisorID, a.AsoSupervisorName, a.AsoActionReason, a.AsoActionReasonDescription, a.AsoTermReason, a.AsoTermReasonDescription, a.AsoChangeReason, a.AsoChangeReasonDescription,
                         a.AsoWorkEmailAddress, a.AsoSystemUpdatedDateTime, a.AsoIsManager, a.AsoWCState, a.AsoTechClass, a.AsoTechDepartment, a.AsoTechLicenseNumber, a.AsoTechTeamLeader, a.AsoTechTeamNumber,
                         a.AsoTechHourlyRate, a.Meta_LoadDate, a.Meta_SrcSysID, a.Meta_SourceSystemName, a.Meta_RowEffectiveDate, a.Meta_RowExpiredDate, a.Meta_RowIsCurrent, a.Meta_RowLastChangedDate, a.Meta_AuditKey,
                         a.Meta_AuditScore, a.Meta_Checksum_Type1, a.Meta_Checksum_Type2, a.User_ID, a.Meta_ComputerName, a.Meta_SourceFileName, a.Meta_NaturalKey, a.ETLExecution_ID, e.EntityKey, 1 AS AsoWorkMobileNumber,
                         1 AS AsoWorkCellAreaCode, 1 AS AsoWorkCellPhone, a.AsoLineOfBusiness, a.AsoBonusType, a.AsoDeptName, a.AsoOrgName, a.AsoRegionCode, a.AsoRegionName, a.AsoAssignNo, a.AsoLMSID, a.AsoResidenceState,
                         a.AsoBirthDate, a.AsoLocationFull,a.Generation
FROM            dbo.DimAssociate AS a LEFT OUTER JOIN
                             (SELECT        MAX(EntityKey) AS EntityKey, { fn CONCAT(EntADPCompanyID, EntAccountingPrefix) } AS AsoDMS4Digit
                               FROM            dbo.Dim_Entity
                               WHERE        (EntityKey <> - 1)
                               GROUP BY EntADPCompanyID, EntAccountingPrefix) AS e ON (CASE a.AsoDMS4Digit WHEN 8001 THEN 8000 WHEN 8041 THEN 8040 ELSE a.AsoDMS4Digit END) = e.AsoDMS4Digit
WHERE        (a.Meta_RowIsCurrent = 'Y')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
