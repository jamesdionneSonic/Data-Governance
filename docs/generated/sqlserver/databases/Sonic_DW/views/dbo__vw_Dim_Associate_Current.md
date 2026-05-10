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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_Associate_Current]
AS
SELECT        a.AssociateKey, a.AsoLocation, a.AsoDMS4Digit, a.AsoEmployeeNumber, a.AsoTimeClockID, a.AsoDepartmentCode, a.AsoDepartment, a.AsoDMSGLCode, a.AsoFirstName, a.AsoMiddleName, a.AsoLastName, 
                         a.AsoOriginalHireDateKey, a.AsoSeniorityDateKey, CASE WHEN a.AsoTerminationDateKey = 99991231 THEN 19000101 ELSE a.AsoTerminationDateKey END AS AsoTerminationDateKey, a.AsoLastHireDateKey, 
                         a.A
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
