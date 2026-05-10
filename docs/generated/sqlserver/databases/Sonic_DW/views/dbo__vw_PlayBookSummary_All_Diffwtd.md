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
extracted_at: 2026-05-09T12:34:14.349Z
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
                         
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
