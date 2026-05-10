---
name: vw_Fact_GLSchedule_bk_04022015
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



CREATE VIEW [dbo].[vw_Fact_GLSchedule_bk_04022015]
AS
SELECT     dbo.Fact_GLSchedule.*, dbo.dim_GLSchedule_degen.Control, dbo.dim_GLSchedule_degen.refer, dbo.dim_GLSchedule_degen.ControlDesc
FROM         dbo.Fact_GLSchedule INNER JOIN
                      dbo.dim_GLSchedule_degen ON dbo.Fact_GLSchedule.GLSchedDegenKey = dbo.dim_GLSchedule_degen.GLSchedDegenKey




```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
