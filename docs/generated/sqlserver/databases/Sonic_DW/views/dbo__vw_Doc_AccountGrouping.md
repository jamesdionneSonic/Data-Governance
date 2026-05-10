---
name: vw_Doc_AccountGrouping
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
CREATE VIEW dbo.vw_DocAccountGrouping
AS
SELECT        TOP (100) PERCENT m.GroupElementSort, m.GroupElement, m.GroupSubElement, ag.AccAccount
FROM            dbo.Doc_AccountGrouping AS ag RIGHT OUTER JOIN
                         dbo.Dim_DOCMetrics AS m ON ag.GroupElementSort = m.GroupElementSort
ORDER BY m.GroupElementSort

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
