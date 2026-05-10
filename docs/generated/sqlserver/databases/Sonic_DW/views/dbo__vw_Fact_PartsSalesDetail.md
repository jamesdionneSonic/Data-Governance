---
name: vw_Fact_PartsSalesDetail
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
CREATE VIEW [dbo].[vw_Fact_PartsSalesDetail]
AS
SELECT     dbo.Fact_PartsSalesDetail.*, dbo.vw_Dim_Entity.EntDealerLvl1
FROM         dbo.Fact_PartsSalesDetail INNER JOIN
                      dbo.vw_Dim_Entity ON dbo.Fact_PartsSalesDetail.EntityKey = dbo.vw_Dim_Entity.EntityKey

```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
