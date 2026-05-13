---
name: vw_CoupaForm_AccessTermations
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Coupa_Access_Terminations
  - Dim_ADUsers
dependency_count: 2
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Coupa_Access_Terminations** (U )
- **dbo.Dim_ADUsers** (U )

## Columns

| Name                    | Type      | Nullable | Description |
| ----------------------- | --------- | -------- | ----------- |
| `easy_form_response_id` | int       |          |             |
| `first_name`            | varchar   | ✓        |             |
| `middle_initial`        | varchar   | ✓        |             |
| `last_name`             | varchar   | ✓        |             |
| `EmployeeID`            | int       | ✓        |             |
| `ADName`                | nvarchar  | ✓        |             |
| `ADEmail`               | nvarchar  | ✓        |             |
| `Title`                 | nvarchar  | ✓        |             |
| `IsActive`              | int       | ✓        |             |
| `StatusID`              | bigint    | ✓        |             |
| `whenCreated`           | datetime2 | ✓        |             |
| `whenChanged`           | datetime2 | ✓        |             |
| `LastLogonDate`         | datetime2 | ✓        |             |
| `AccountExpiresDate`    | datetime2 | ✓        |             |
| `CoupaTerminationDate`  | date      | ✓        |             |
| `UpdatedAt`             | datetime2 | ✓        |             |
| `MatchType`             | varchar   |          |             |

## Definition

```sql
CREATE VIEW dbo.vw_CoupaForm_AccessTermations
AS
WITH CoupaNames AS (SELECT        easy_form_response_id, first_name, last_name, middle_initial, access_termination_date, LTRIM(RTRIM(first_name + '.' + ISNULL(NULLIF (middle_initial, '') + '.', '') + last_name)) AS Pattern_FullDot,
                                                                             LTRIM(RTRIM(first_name + '.' + last_name)) AS Pattern_NoMI, LTRIM(RTRIM(first_name + ISNULL(middle_initial, '') + last_name)) AS Pattern_Concat,
                                                                             LTRIM(RTRIM(first_name + ' ' + ISNULL(NULLIF (middle_initial, '') + ' ', '') + last_name)) AS Pattern_Spaced, LTRIM(RTRIM(first_name + ' ' + last_name)) AS Pattern_Spaced_NoMI
                                                    FROM            dbo.Coupa_Access_Terminations)
    SELECT        c.easy_form_response_id, c.first_name, c.middle_initial, c.last_name, COALESCE (ad.EmployeeID, - 1) AS EmployeeID, ad.ADName, ad.ADEmail, ad.Title, ad.IsActive, ad.StatusID, ad.whenCreated, ad.whenChanged,
                              ad.LastLogonDate, ad.AccountExpiresDate, c.access_termination_date AS CoupaTerminationDate, ad.UpdatedAt,
                              CASE WHEN ad.ADName = c.Pattern_FullDot THEN 'Exact Full (FN.MI.LN)' WHEN ad.ADName = c.Pattern_NoMI THEN 'Exact No-MI (FN.LN)' WHEN ad.ADName = c.Pattern_Concat THEN 'Concat (FNMI.LN)' WHEN ad.ADName =
                               c.Pattern_Spaced THEN 'Spaced Full (FN MI LN)' WHEN ad.ADName = c.Pattern_Spaced_NoMI THEN 'Spaced No-MI (FN LN)' ELSE 'None' END AS MatchType
     FROM            CoupaNames AS c LEFT OUTER JOIN
                              dbo.Dim_ADUsers AS ad ON ad.ADName IN (c.Pattern_FullDot, c.Pattern_NoMI, c.Pattern_Concat, c.Pattern_Spaced, c.Pattern_Spaced_NoMI)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
