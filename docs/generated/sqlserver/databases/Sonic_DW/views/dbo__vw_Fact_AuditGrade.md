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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
                         dbo.Fact_AuditGrade.FiscalMonth, (CASE MetricName WHEN 'Training' THEN (CASE WHEN (CAST(dbo.Fact_AuditGrade.Audit_Count AS money) / 30) < .9 THEN 1 ELSE 0 END)
                         WHEN 'Safety Leadership Team Score' THEN (CASE WHEN (CAST(dbo.Fact_AuditGrade.Audit_Count AS money) / 60) < .9 THEN 1 ELSE 0 END)
                         ELSE (CASE WHEN dbo.Fact_AuditGrade.Audit_Count >= 1 THEN 1 ELSE 0 END) END) AS Audit_UniqueCount,
                         (CASE MetricName WHEN 'Completion Towards OSHA Training' THEN (15 - dbo.Fact_AuditGrade.Audit_Count) WHEN 'Safety Leadership Team Score' THEN (30 - dbo.Fact_AuditGrade.Audit_Count)
                         ELSE dbo.Fact_AuditGrade.Audit_Count END) AS Audit_Instances
FROM            dbo.Dim_Month INNER JOIN
                         dbo.Fact_AuditGrade ON dbo.Dim_Month.FiscalYear = dbo.Fact_AuditGrade.FiscalYear AND dbo.Dim_Month.FiscalMonth = dbo.Fact_AuditGrade.FiscalMonth INNER JOIN
                         dbo.vw_Dim_Dealership ON dbo.Fact_AuditGrade.EntDealerLvl1 = dbo.vw_Dim_Dealership.EntDealerLvl1


```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
