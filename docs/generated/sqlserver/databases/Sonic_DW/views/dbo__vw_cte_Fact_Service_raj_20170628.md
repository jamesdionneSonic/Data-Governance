---
name: vw_cte_Fact_Service_raj_20170628
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



CREATE VIEW [dbo].[vw_cte_Fact_Service_raj_20170628]
AS


WITH cte_vw_FactService
AS
(

-- Insert records from staging
--
SELECT 
	COALESCE(c.EntityKey, -1) AS EntityKey,
	COALESCE(d.DimCustomerID, -1) AS CustomerKey,
	coalesce(FF.DMSCustomerKey,-1) as DMSCustomerKey,
	COALESCE(e.VehicleKey, -1) AS VehicleKey,
	COALESCE(f.AssociateKey, -1) AS ServiceAdvisorKey,
	COALESCE(g.DateKey, 19000101) AS OpenDateKey,
	COALESCE(h.DateKey, 19000101) AS CloseDateKey,
	COALESCE(i.DateK
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
