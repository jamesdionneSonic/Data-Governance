---
name: vw_Fact_DQValidation
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
CREATE VIEW [dbo].[vw_Fact_DQValidation]
AS
SELECT     dbo.Fact_DQValidation.SourceKey, dbo.Fact_DQValidation.StepKey, dbo.Fact_DQValidation.TargetKey, dbo.Fact_DQValidation.StatusKey, 
                      dbo.Fact_DQValidation.ValidationKey, dbo.Fact_DQValidation.EntityKey, dbo.Fact_DQValidation.DateKey, dbo.Fact_DQValidation.HostItemID, 
                      dbo.Fact_DQValidation.Cora_Acct_ID, dbo.Fact_DQValidation.ImpactDateKey, dbo.Fact_DQValidation.AccountKey, dbo.Fact_DQValidation.R
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
