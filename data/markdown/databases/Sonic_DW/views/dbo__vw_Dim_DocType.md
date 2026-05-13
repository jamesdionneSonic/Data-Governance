---
name: vw_Dim_DocType
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_DocType
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DocType** (U )

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `DimDocTypeID`       | int      |          |             |
| `DocTypeCode`        | smallint |          |             |
| `DocTypeDescription` | varchar  | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Dim_DocType
AS
SELECT     DimDocTypeID, DocTypeCode, DocTypeDescription
FROM         dbo.Dim_DocType

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
