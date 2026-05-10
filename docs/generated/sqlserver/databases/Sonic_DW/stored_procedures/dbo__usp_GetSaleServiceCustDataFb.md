---
name: usp_GetSaleServiceCustDataFb
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

CREATE PROCEDURE [dbo].[usp_GetSaleServiceCustDataFb](@dateToCheck INT)
AS
     BEGIN
         SET NOCOUNT ON;

        -- fb Sales Query:  

         SELECT *
         FROM
         (
             SELECT ff.EntityKey AS entity,
                    der.BigIntegerField AS event_set_id,
                    c.DMSCstEmailAddress1 AS email,
                    '1'+COALESCE(c.DMSCstCellPhone, c.DMSCstHomePhone, c.DMSCstBusinessPhone) AS phone,
                    DMSCstAddressCity AS c
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
