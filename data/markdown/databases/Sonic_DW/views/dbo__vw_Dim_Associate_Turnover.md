---
name: vw_Dim_Associate_Turnover
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - vw_Dim_Associate
  - vw_Dim_TurnoverGroup
dependency_count: 2
column_count: 65
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_Dim_Associate** (V )
- **dbo.vw_Dim_TurnoverGroup** (V )

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
| `TurnoverGroupKey`           | int       | ✓        |             |
| `ReportNumber`               | int       | ✓        |             |
| `Company`                    | nvarchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Associate_Turnover
AS
SELECT        a1.AssociateKey, a1.AsoLocation, a1.AsoDMS4Digit, a1.AsoEmployeeNumber, a1.AsoTimeClockID, a1.AsoDepartmentCode, a1.AsoDepartment, a1.AsoDMSGLCode, a1.AsoFirstName, a1.AsoMiddleName, a1.AsoLastName,
                         a1.AsoOriginalHireDateKey, a1.AsoSeniorityDateKey, a1.AsoTerminationDateKey, a1.AsoLastHireDateKey, a1.AsoEmployeeStatus, a1.AsoEmplStatusStartDate, a1.AsoFullOrPartTime, a1.AsoDateInJobKey, a1.AsoJobCode,
                         a1.AsoJobGroupCode, a1.AsoJobFamily, a1.AsoecJobtitle, a1.AsoSalaryOrHourly, a1.AsoSupervisorID, a1.AsoSupervisorName, a1.AsoActionReason, a1.AsoActionReasonDescription, a1.AsoTermReason,
                         a1.AsoTermReasonDescription, a1.AsoChangeReason, a1.AsoChangeReasonDescription, a1.AsoWorkEmailAddress, a1.AsoSystemUpdatedDateTime, a1.AsoIsManager, a1.AsoWCState, a1.AsoTechClass,
                         a1.AsoTechDepartment, a1.AsoTechLicenseNumber, a1.AsoTechTeamLeader, a1.AsoTechTeamNumber, a1.AsoTechHourlyRate, a1.Meta_LoadDate, a1.Meta_SrcSysID, a1.Meta_SourceSystemName, a1.Meta_RowEffectiveDate,
                         a1.Meta_RowExpiredDate, a1.Meta_RowIsCurrent, a1.Meta_RowLastChangedDate, a1.Meta_AuditKey, a1.Meta_AuditScore, a1.Meta_Checksum_Type1, a1.Meta_Checksum_Type2, a1.User_ID, a1.Meta_ComputerName,
                         a1.Meta_SourceFileName, a1.Meta_NaturalKey, a1.ETLExecution_ID, a1.EntityKey, a1.AsoWorkMobileNumber, a1.AsoWorkCellAreaCode, a1.AsoWorkCellPhone, HR.TurnoverGroupKey, HR.ReportNumber, HR.Company
FROM            dbo.vw_Dim_Associate AS a1 LEFT OUTER JOIN
                         dbo.vw_Dim_TurnoverGroup AS HR ON a1.AsoJobCode = HR.JobCode

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
