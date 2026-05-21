---
name: vw_Doc_AccountGroupingPS
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
CREATE VIEW dbo.vw_Doc_AccountGroupingPS
AS
SELECT        AccAccount + '-' + CAST(COALESCE (DepartmentID, 0) AS Varchar(2)) AS AccountID, AccAccount, COALESCE (DepartmentID, 0) AS DepartmentID, GroupElementSort
FROM            dbo.Doc_AccountGroupingPS

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
