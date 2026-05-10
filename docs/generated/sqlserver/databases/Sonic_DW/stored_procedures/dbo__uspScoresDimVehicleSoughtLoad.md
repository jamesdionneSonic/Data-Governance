---
name: uspScoresDimVehicleSoughtLoad
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



-- ================================================    
-- Author:       Bhramar Chandrakar / Umberto Sartori
-- Create date:  12/02/2016    
-- Description:  Inserts/Update Vehicle Sought Load
--
-- ubs - 4/21/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 4/29/2016 - Changed MERGE join to employ key columns instead of the HASH value of the key columns.
--					 Also changed default values of Model year columns to -1 instead
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
