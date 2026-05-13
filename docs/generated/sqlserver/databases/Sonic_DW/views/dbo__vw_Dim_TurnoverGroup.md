---
name: vw_Dim_TurnoverGroup
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
CREATE VIEW dbo.vw_Dim_TurnoverGroup
AS
SELECT        TurnoverGroupKey, ReportNumber, ReportCategoryID, ReportCategory, ReportGroupID, ReportGroup, JobCode, JobCodeDesc, Company, JobSort, CONVERT(varchar(100), ReportNumber) + '.' + CONVERT(varchar(100),
                         ReportCategoryID) AS ReportCategoryNaturalKey, CONVERT(varchar(100), ReportNumber) + '.' + CONVERT(varchar(100), ReportCategoryID) + '.' + CONVERT(varchar(100), ReportGroupID) AS ReportGroupNaturalKey
FROM            dbo.Dim_TurnoverGroup

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
