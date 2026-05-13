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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
