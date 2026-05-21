---
name: vw_Dim_StepSource
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW [dbo].[vw_Dim_StepSource]
AS
SELECT     SourceKey, LOWER(SourceName) AS SourceName, SourceType, SourceLocation, SequenceName, SourceStepName, SourceSystem, IsPrimarySourceFlag,
                      Meta_Src_Sys_ID, Meta_SourceSystemName, Meta_RowEffectiveDate, Meta_RowExpiredDate, Meta_RowIsCurrent, Meta_RowLastChangedDate, ETLExecution_ID,
                      User_ID, Meta_ComputerName, Meta_LoadDate
FROM         dbo.Dim_StepSource

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
