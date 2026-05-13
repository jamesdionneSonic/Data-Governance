---
name: vw_PlayBookSummary_All_Diffwtd
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - tbl_PlayBookSummary_All_Diffwtd
dependency_count: 1
column_count: 12
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.tbl_PlayBookSummary_All_Diffwtd** (U )

## Columns

| Name             | Type     | Nullable | Description |
| ---------------- | -------- | -------- | ----------- |
| `pbyear`         | nvarchar | ✓        |             |
| `Playbook`       | nvarchar | ✓        |             |
| `InspectionDate` | datetime | ✓        |             |
| `Dealership`     | nvarchar | ✓        |             |
| `TotalScore`     | float    | ✓        |             |
| `TotalPoints`    | float    | ✓        |             |
| `TotalPossible`  | float    | ✓        |             |
| `Region`         | nvarchar | ✓        |             |
| `uvdregion`      | nvarchar | ✓        |             |
| `fodregion`      | nvarchar | ✓        |             |
| `fidregion`      | nvarchar | ✓        |             |
| `entitykey`      | int      | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_PlayBookSummary_All_Diffwtd
AS
SELECT     a.pbyear, a.Playbook, a.InspectionDate, a.Dealership, a.TotalScore, a.TotalPoints, a.TotalPossible, a.Region, a.uvdregion, a.fodregion, a.fidregion, a.entitykey
FROM         dbo.tbl_PlayBookSummary_All_Diffwtd AS a INNER JOIN
                          (SELECT     pbyear, Playbook, Dealership, MAX(InspectionDate) AS MaxDate
                            FROM          dbo.tbl_PlayBookSummary_All_Diffwtd AS b
                            GROUP BY pbyear, Playbook, Dealership) AS c ON c.pbyear = a.pbyear AND c.Playbook = a.Playbook AND c.Dealership = a.Dealership AND
                      c.MaxDate = a.InspectionDate
WHERE     (a.pbyear <> N'Diff')

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
