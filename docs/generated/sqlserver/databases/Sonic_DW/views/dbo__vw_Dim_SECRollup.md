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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         sec.BillingFlag, sec.OneTimeFlag, sec.SECRollUp, sec.Budget_Sign, sec.CorporateVarianceRollup, sec.Actual_Sign, COALESCE (secsort.secrollupsortid, 99) AS SECRollupSortID
FROM            dbo.Dim_SECRollup AS sec LEFT OUTER JOIN
                         dbo.Dim_SECRollupSort AS secsort ON sec.SECRollUp = secsort.secrollup

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
