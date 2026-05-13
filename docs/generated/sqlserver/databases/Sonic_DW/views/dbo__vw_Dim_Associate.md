---
name: vw_Dim_Associate
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

2- **Type**: View

- **Schema**: dbo

## Definition

```sql





CREATE VIEW [dbo].[vw_Dim_Associate]
AS
SELECT a.AssociateKey, a.AsoLocation, a.AsoDMS4Digit, a.AsoEmployeeNumber, a.AsoTimeClockID, a.AsoDepartmentCode, a.AsoDepartment, a.AsoDMSGLCode, a.AsoFirstName, a.AsoMiddleName, a.AsoLastName,
a.AsoOriginalHireDateKey, a.AsoSeniorityDateKey, a.AsoTerminationDateKey, a.AsoLastHireDateKey, a.AsoEmployeeStatus, a.AsoEmplStatusStartDateKey AS AsoEmplStatusStartDate, a.AsoFullOrPartTime, a.AsoDateInJobKey,
a.AsoJobCode, a.AsoJobGroupCode, a.AsoJobFamily, a.AsoecJobtitle, a.AsoSalaryOrHourly, a.AsoSupervisorID, a.AsoSupervisorName, a.AsoActionReason, a.AsoActionReasonDescription, a.AsoTermReason,
a.AsoTermReasonDescription, a.AsoChangeReason, a.AsoChangeReasonDescription, a.AsoWorkEmailAddress, a.AsoSystemUpdatedDateTime, a.AsoIsManager, a.AsoWCState, a.AsoTechClass, a.AsoTechDepartment,
a.AsoTechLicenseNumber, a.AsoTechTeamLeader, a.AsoTechTeamNumber, a.AsoTechHourlyRate, a.Meta_LoadDate, a.Meta_SrcSysID, a.Meta_SourceSystemName, a.Meta_RowEffectiveDate, a.Meta_RowExpiredDate,
a.Meta_RowIsCurrent, a.Meta_RowLastChangedDate, a.Meta_AuditKey, a.Meta_AuditScore, a.Meta_Checksum_Type1, a.Meta_Checksum_Type2, a.User_ID, a.Meta_ComputerName, a.Meta_SourceFileName,
a.Meta_NaturalKey, a.ETLExecution_ID, e.EntityKey, 1 AS AsoWorkMobileNumber, 1 AS AsoWorkCellAreaCode, 1 AS AsoWorkCellPhone, a.AsoLineOfBusiness, a.AsoBonusType, a.AsoDeptName, a.AsoOrgName,
a.AsoRegionCode, a.AsoRegionName, a.AsoAssignNo, a.AsoLMSID, a.AsoBirthDate
FROM dbo.DimAssociate AS a LEFT OUTER JOIN
(SELECT MAX(EntityKey) AS EntityKey, CONCAT(EntADPCompanyID, (CASE WHEN EntAccountingPrefix = 99 THEN 0 ELSE EntAccountingPrefix END)) AS AsoDMS4Digit
FROM dbo.Dim_Entity
WHERE (EntityKey NOT IN (-1, 401)
--AND EntDefaultDlrshpLvl1 = 1
)
GROUP BY EntADPCompanyID, EntAccountingPrefix) AS e ON (CASE a.AsoDMS4Digit WHEN 8001 THEN 8000 WHEN 8041 THEN 8040 WHEN 2451 THEN 2552 WHEN 2452 THEN 2552 WHEN 2523 THEN 2537 ELSE a.AsoDMS4Digit END) = e.AsoDMS4Digit

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
