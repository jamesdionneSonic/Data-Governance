---
name: vw_Dim_Dealnumber
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql
CREATE   VIEW  darpts.vw_Dim_Dealnumber
AS
SELECT
Dealnumber as Deal_number
FROM Sonic_DW.darpts.DMR_Non_Deal_Data
UNION
SELECT
	Deal_number
FROM Sonic_DW.darpts.DMR_Sales
UNION
SELECT
DealNumber as Deal_number
FROM Sonic_DW.darpts.DMR_Sold_Whsl

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
