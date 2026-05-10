---
name: vw_Dim_SECRollup
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
CREATE VIEW dbo.vw_Dim_SECRollup
AS
SELECT        sec.SECRollupKey, sec.AccountType, sec.SECLevel1, sec.SECLevel2, sec.SECLevel3, sec.SECLevel4, sec.SECLevel5, sec.SECLevel6, sec.SECLevel7, sec.SECLevel8, sec.SECLevel9, sec.SECLevel10, sec.SECLevel11, 
                         sec.SECLevel0, sec.SECLevel0_Desc, sec.ReportType, sec.ETLExecution_ID, sec.Meta_Src_Sys_ID, sec.User_ID, sec.Meta_LoadDate, sec.Meta_RowIsCurrent, sec.Meta_RowLastChangedDate, sec.Meta_NaturalKey, 
                   
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
