---
name: vw_cte_Fact_Service_18082015
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











--
-- ================================================================
-- Author:		Roger Williams
-- Updated: CDE 04/17/2012 put into a view
-- Description:	Updated R Williams Source 
-- to include Ranking to elimiante dupes
-- Updated CDE 06/22/2012 added shopsupplies cost and sales columns
-- ==================================================================

CREATE VIEW [dbo].[vw_cte_Fact_Service]
AS


WITH cte_vw_FactService
AS
(

-- Insert records from
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
