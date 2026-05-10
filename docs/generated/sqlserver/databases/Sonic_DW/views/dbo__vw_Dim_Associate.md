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
extracted_at: 2026-05-09T12:34:14.349Z
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
a.AsoJobCode, a.AsoJobGroupCode, a.AsoJ
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
