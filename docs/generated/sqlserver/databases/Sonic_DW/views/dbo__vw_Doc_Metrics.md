---
name: vw_Doc_Metrics
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
CREATE VIEW dbo.vw_DOC_Metrics
AS
SELECT        dbo.Doc_AccountGrouping.GroupID, dbo.Doc_AccountGrouping.AccAccount, dbo.Doc_AccountGrouping.GroupElementSort, dbo.Dim_DOCMetrics.GroupElement, dbo.Dim_DOCMetrics.TXNMetric,
                         dbo.Dim_DOCMetrics.RVPMetric
FROM            dbo.Dim_DOCMetrics INNER JOIN
                         dbo.Doc_AccountGrouping ON dbo.Dim_DOCMetrics.GroupElementSort = dbo.Doc_AccountGrouping.GroupElementSort

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
