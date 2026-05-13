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
depends_on:
  - Doc_TXN_Login
dependency_count: 1
column_count: 3
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Doc_TXN_Login** (U )

## Columns

| Name                 | Type             | Nullable | Description |
| -------------------- | ---------------- | -------- | ----------- |
| `MicroStrategyLogin` | nvarchar         |          |             |
| `EntityKey`          | int              | ✓        |             |
| `MSTRMetadataUserID` | uniqueidentifier |          |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
