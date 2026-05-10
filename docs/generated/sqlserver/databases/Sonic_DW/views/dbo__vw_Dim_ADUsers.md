---
name: vw_Dim_ADUsers
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
CREATE VIEW dbo.vw_Dim_ADUsers
AS
SELECT        ADUsers.EmployeeID, ADUsers.ADName, ADUsers.ADEmail, ADUsers.Title, ADUsers.StatusID, ADUsers.IsActive, ADUsers.whenChanged, ADUsers.whenCreated, ADUsers.LastLogonDate, ADUsers.AccountExpiresDate, 
                         ADUsers.UpdatedAt, CoupaUsers.CoupaTerminationDate
FROM            (SELECT        COALESCE (CAST(EmployeeID AS Varchar(50)), '-1') AS EmployeeID, ADName, ADEmail, Title, StatusID, CASE WHEN u.IsActive = - 1 THEN 1 ELSE u.IsAc
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
