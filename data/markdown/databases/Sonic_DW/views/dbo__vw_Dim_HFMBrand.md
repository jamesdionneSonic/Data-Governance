---
name: vw_Dim_HFMBrand
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_HFMBrand
dependency_count: 1
column_count: 31
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_HFMBrand** (U )

## Columns

| Name                     | Type     | Nullable | Description |
| ------------------------ | -------- | -------- | ----------- |
| `HFMBrandKey`            | int      |          |             |
| `BrandID`                | int      | ✓        |             |
| `FinalBrand`             | varchar  | ✓        |             |
| `HFMBrandLevel1`         | varchar  | ✓        |             |
| `HFMBrandLevel2`         | varchar  | ✓        |             |
| `HFMBrandLevel3`         | varchar  | ✓        |             |
| `HFMBrandLevel4`         | varchar  | ✓        |             |
| `HFMBrandLevel5`         | varchar  | ✓        |             |
| `HFMBrandLevel6`         | varchar  | ✓        |             |
| `HFMBrandLevel7`         | varchar  | ✓        |             |
| `HFMBrandLevel8`         | varchar  | ✓        |             |
| `HFMBrandLevel9`         | varchar  | ✓        |             |
| `HFMBrandLevel10`        | varchar  | ✓        |             |
| `HFMBrandLevel11`        | varchar  | ✓        |             |
| `HFMBrandLevel0`         | varchar  | ✓        |             |
| `HFMBrandDescription`    | varchar  | ✓        |             |
| `HFMMainBrand`           | varchar  | ✓        |             |
| `Meta_SrcSysID`          | int      | ✓        |             |
| `Meta_ComputerName`      | varchar  | ✓        |             |
| `User_ID`                | varchar  | ✓        |             |
| `Meta_SourceSystemName`  | varchar  | ✓        |             |
| `Meta_LoadDate`          | datetime | ✓        |             |
| `Meta_RowEffectiveDate`  | datetime | ✓        |             |
| `Meta_RowExpiredDate`    | datetime | ✓        |             |
| `Meta_RowIsCurrent`      | varchar  | ✓        |             |
| `Meta_RowLastChangeDate` | datetime | ✓        |             |
| `Meta_AuditKey`          | int      | ✓        |             |
| `Meta_AuditScore`        | int      | ✓        |             |
| `Meta_NaturalKey`        | varchar  | ✓        |             |
| `Meta_CheckSum`          | int      | ✓        |             |
| `ETLExecution_ID`        | int      | ✓        |             |

## Definition

```sql

CREATE VIEW [dbo].[vw_Dim_HFMBrand]
AS
SELECT     dbo.Dim_HFMBrand.*
FROM         dbo.Dim_HFMBrand


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
