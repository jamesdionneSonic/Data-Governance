---
name: vw_HFM_Account_MGMT_Dim
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - HFM_Account_MGMT_Dim
dependency_count: 1
column_count: 18
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.HFM_Account_MGMT_Dim** (U )

## Columns

| Name          | Type     | Nullable | Description |
| ------------- | -------- | -------- | ----------- |
| `ParentID`    | int      | ✓        |             |
| `ID`          | int      | ✓        |             |
| `a_Level1`    | varchar  | ✓        |             |
| `a_Level2`    | varchar  | ✓        |             |
| `a_Level3`    | varchar  | ✓        |             |
| `a_Level4`    | varchar  | ✓        |             |
| `a_Level5`    | varchar  | ✓        |             |
| `a_Level6`    | varchar  | ✓        |             |
| `a_Level7`    | varchar  | ✓        |             |
| `a_Level8`    | varchar  | ✓        |             |
| `a_Level9`    | varchar  | ✓        |             |
| `a_Level10`   | varchar  | ✓        |             |
| `a_Level11`   | varchar  | ✓        |             |
| `a_Level0`    | varchar  | ✓        |             |
| `Label`       | nvarchar | ✓        |             |
| `ParentLabel` | nvarchar | ✓        |             |
| `Description` | nvarchar | ✓        |             |
| `AccountType` | nvarchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_HFM_Account_MGMT_Dim
AS
SELECT     ParentID, ID, Level1 AS a_Level1, Level2 AS a_Level2, Level3 AS a_Level3, Level4 AS a_Level4, Level5 AS a_Level5, Level6 AS a_Level6,
                      Level7 AS a_Level7, Level8 AS a_Level8, Level9 AS a_Level9, Level10 AS a_Level10, Level11 AS a_Level11, Level0 AS a_Level0, Label, ParentLabel,
                      Description, AccountType
FROM         dbo.HFM_Account_MGMT_Dim AS HFM_Account_MGMT_Dim_1

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
