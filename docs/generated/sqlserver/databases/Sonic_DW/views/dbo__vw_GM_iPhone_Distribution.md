---
name: vw_GM_iPhone_Distribution
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
CREATE VIEW dbo.vw_GM_iPhone_Distribution
AS
SELECT        TXNL.MicroStrategyLogin, TXNL.EntityKey, MSA.OBJECT_ID AS MSTRMetadataUserID
FROM            dbo.Doc_TXN_Login AS TXNL INNER JOIN
                         USTRAT.MSMetaData.dbo.DSSMDUSRACCT AS MSA ON TXNL.MicroStrategyLogin = MSA.LOGIN
WHERE        (TXNL.ReviewerFlag = 1)

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
