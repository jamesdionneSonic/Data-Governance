---
name: uspScoresDimVehicleSoughtXrefLoad
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




-- =================================================   
-- Author:       Bhramar Chandrakar   
-- Create date:  01/03/2016    
-- Description:  Inserts/Update DimVehicleSoughtXref
--
-- ubs - 4/21/2016 - Added a current date for MetaRowEffectiveDate; set MetaRowIsCurrent = 'Y' for new inserts
-- ubs - 4/26/1016 - Added MATCHED section to MERGE statement
-- ubs - 5/4/2016  - Changed HASHBYTES checksum function to CHECKSUM
-- ubs - 10/26/2016 - Removed VehicleKey as part of the Xre
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
