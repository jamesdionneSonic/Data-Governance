---
name: vw_Dim_Acct_Insert
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

/*****************************************************************************
--
-- Created By Roger Williams
-- Put into view by CDE 08/29/2012
-- Added NOT EXIST Predicate to accurately check for accounts not 
-- previously loaded into Dim_Account. Replaced IS NULL accountnumber from 
-- Dim_Account
-- Updated CDE 08/31/2012 to remove cora 3732 from being loaded
-- NWC 20140708 Added BeginDate and EndDate columns
-- NWC 20140805 Added FixedAssetCategory column
********************
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
