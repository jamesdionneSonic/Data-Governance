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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
FROM            (SELECT        COALESCE (CAST(EmployeeID AS Varchar(50)), '-1') AS EmployeeID, ADName, ADEmail, Title, StatusID, CASE WHEN u.IsActive = - 1 THEN 1 ELSE u.IsActive END AS IsActive, whenChanged, whenCreated,
                                                    LastLogonDate, AccountExpiresDate, UpdatedAt
                          FROM            dbo.Dim_ADUsers AS u
                          UNION ALL
                          SELECT        CAST(EmployeeID AS Varchar(50)) AS EmployeeID, ADName, ADEmail, '' AS Title, - 1 AS StatusID, 1 AS IsActive, GETDATE() AS whenChanged, GETDATE() AS whenCreated, GETDATE() AS LastLogonDate, GETDATE()
                                                   AS AccountExpiresDate, GETDATE() AS UpdatedAt
                          FROM            dbo.Dim_ADUsers_Manual AS um) AS ADUsers LEFT OUTER JOIN
                             (SELECT        ADName, MAX(CoupaTerminationDate) AS CoupaTerminationDate
                               FROM            dbo.vw_CoupaForm_AccessTermations
                               WHERE        (ADName IS NOT NULL)
                               GROUP BY ADName) AS CoupaUsers ON ADUsers.ADName = CoupaUsers.ADName

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
