---
name: vw_Dim_HRTurnoverGroup
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_HRTurnoverGroup]
AS
SELECT        TurnoverGroupKey, TurnoverGroupID, TurnoverGroupDesc, JobCode, JobCodeDesc, ReportCategory, ReportLevel, JobSort
FROM            dbo.Dim_HRTurnoverGroups

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
