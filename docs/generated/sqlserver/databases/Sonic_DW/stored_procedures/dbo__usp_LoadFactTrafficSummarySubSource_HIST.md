---
name: usp_LoadFactTrafficSummarySubSource_HIST
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql


-- ====================================================================================================================================================================================================   
-- Author:       Derrick Davis
-- Create date:  06/12/2023    
-- 02/02/2024:  DMD - Added LeadSubSourceKey UPDATE to fix possible dupe issue
-- 10/03/2024:  DMD - Added CASE statement to load Date so that time conversions for total month loads don't overwrite MTD data
-- 04/28/2025:  DM
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
