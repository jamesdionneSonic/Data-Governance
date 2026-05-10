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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Associate_Turnover
AS
SELECT        a1.AssociateKey, a1.AsoLocation, a1.AsoDMS4Digit, a1.AsoEmployeeNumber, a1.AsoTimeClockID, a1.AsoDepartmentCode, a1.AsoDepartment, a1.AsoDMSGLCode, a1.AsoFirstName, a1.AsoMiddleName, a1.AsoLastName, 
                         a1.AsoOriginalHireDateKey, a1.AsoSeniorityDateKey, a1.AsoTerminationDateKey, a1.AsoLastHireDateKey, a1.AsoEmployeeStatus, a1.AsoEmplStatusStartDate, a1.AsoFullOrPartTime, a1.AsoDateInJobKey, a1.AsoJobCode, 
     
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
