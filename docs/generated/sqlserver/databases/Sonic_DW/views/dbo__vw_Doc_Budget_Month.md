---
name: vw_Doc_Budget_Month
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

CREATE VIEW [dbo].[vw_Doc_Budget_Month] AS
SELECT        b.EntityKey, d.DateKey, b.DOCMonthKey, b.GroupElementSort, b.GroupElement, b.GroupSubElement, b.Amount, b.StatCount, b.MetricTypeKey, CONCAT(b.MetricTypeKey, d.DateKey, b.GroupElementSort, b.EntityKey) AS DocTableID
FROM            dbo.vw_Doc_Budget AS b INNER JOIN
                         dbo.Dim_Date AS d ON b.DOCMonthKey = d.FiscalMonthKey

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
