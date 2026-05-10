---
name: vw_Fact_GECReportDaily
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
CREATE VIEW dbo.vw_Fact_GECReportDaily
AS
SELECT        a.Id, a.CompanyName, a.ChildCompanyID, a.AgentOrder, a.Agent, a.lUserID, a.ChildUserID, a.UserName, a.UpTypeOrder, 
                         CASE WHEN UpTypeOrder = 3 THEN 'Internet' WHEN UpTypeOrder = 5 THEN 'Phone' WHEN UpTypeOrder = 7 THEN 'Showroom' WHEN UpTypeOrder = 9 THEN 'Campaign' ELSE 'N/A' END AS UpType, a.NewUsedOrder, 
                         a.NewUsed, a.Ups, a.Visit, a.ApptsSet, a.ApptsDue, a.ApptsShown, a.ApptsNoShow, a
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
