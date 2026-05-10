---
name: vw_Fact_AuditGrade
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

CREATE VIEW [dbo].[vw_Fact_AuditGrade]
AS
SELECT        dbo.Fact_AuditGrade.AuditGradeKey, dbo.Dim_Month.FiscalMonthKey, dbo.Fact_AuditGrade.FiscalYear, dbo.Fact_AuditGrade.Category, dbo.Fact_AuditGrade.MetricName, dbo.Fact_AuditGrade.Audit_Count, 
                         dbo.Fact_AuditGrade.Audit_Grade, dbo.vw_Dim_Dealership.EntRegion, dbo.vw_Dim_Dealership.EntAddressState, dbo.Fact_AuditGrade.EntDealerLvl1, dbo.vw_Dim_Dealership.EntLineOfBusiness, 
                         dbo.Fact_Audi
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
