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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                      dbo.Fact_DQValidation.Cora_Acct_ID, dbo.Fact_DQValidation.ImpactDateKey, dbo.Fact_DQValidation.AccountKey, dbo.Fact_DQValidation.RowID,
                      dbo.Fact_DQValidation.ETLExecution_ID, dbo.Fact_DQValidation.ETLSequenceID, dbo.Fact_DQValidation.ErrorCount, dbo.Fact_DQValidation.Variance,
                      dbo.Fact_DQValidation.ExpectedValue, dbo.Fact_DQValidation.User_ID, dbo.Fact_DQValidation.Meta_ComputerName, dbo.Fact_DQValidation.Meta_LoadDate,
                      dbo.vw_Dim_Status.Is_DataLoad_Err, dbo.vw_Dim_Status.Is_Val_Err
FROM         dbo.Fact_DQValidation INNER JOIN
                      dbo.vw_Dim_Status ON dbo.Fact_DQValidation.StatusKey = dbo.vw_Dim_Status.StatusKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
