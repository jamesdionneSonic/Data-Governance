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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
