---
name: usp_LogError
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

-- =============================================
-- Author:      Greg Bishop
-- Create date: 2011/06/11
-- Description: Procedure to log error information
--              into the Error_Log table. This
--              procedure should be placed
--              within the CATCH block of a TRY/
--              CATCH statement.
-- =============================================
CREATE PROCEDURE [dbo].[usp_LogError]
    -- Add the parameters for the stored procedure here
    @ErrorLogID [
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
