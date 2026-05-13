---
name: vw_Fact_AccountingSummary
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
CREATE VIEW dbo.vw_Fact_AccountingSummary
AS
SELECT        dbo.Fact_AccountingSummary.FactAccountingSummaryKey, dbo.Fact_AccountingSummary.AccountKey, dbo.Fact_AccountingSummary.AccountMgmtKey, dbo.Fact_AccountingSummary.EntityKey,
                         dbo.Fact_AccountingSummary.FiscalMonthKey, dbo.Fact_AccountingSummary.Amount, dbo.Fact_AccountingSummary.StatCount, 31 AS ScenarioKey, dbo.Fact_AccountingSummary.Meta_SourceSystemName,
                         CAST(31 AS varchar(2)) + '.' + CAST(dbo.Fact_AccountingSummary.FactAccountingSummaryKey AS varchar(50)) AS UnionTableID, dbo.Fact_AccountingSummary.SECRollupKey,
                         dbo.Dim_AccountMgmt.FUEL_Sign * dbo.Fact_AccountingSummary.Amount AS DisplayAmount, COALESCE (dbo.Fact_AccountingSummary.HFMBrandKey, - 1) AS HFMBrandKey,
                         dbo.Dim_SECRollup.Actual_Sign * dbo.Fact_AccountingSummary.Amount AS CorporateDisplayAmount
FROM            dbo.Fact_AccountingSummary INNER JOIN
                         dbo.Dim_AccountMgmt ON dbo.Fact_AccountingSummary.AccountMgmtKey = dbo.Dim_AccountMgmt.AccountMgmtKey LEFT OUTER JOIN
                         dbo.Dim_SECRollup ON dbo.Fact_AccountingSummary.SECRollupKey = dbo.Dim_SECRollup.SECRollupKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
